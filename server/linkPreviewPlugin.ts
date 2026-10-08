import type { Connect, Plugin } from 'vite';
import type { ServerResponse } from 'node:http';

const BLOCKED_HOSTNAMES = new Set(['localhost', '127.0.0.1', '0.0.0.0', '::1']);
const FETCH_TIMEOUT_MS = 5000;

interface LinkPreviewData {
    url: string;
    title?: string;
    description?: string;
    image?: string;
}

function isBlockedHost(hostname: string): boolean {
    const lower = hostname.toLowerCase();
    return (
        BLOCKED_HOSTNAMES.has(lower) ||
        lower.endsWith('.local') ||
        lower.startsWith('10.') ||
        lower.startsWith('192.168.') ||
        /^172\.(1[6-9]|2\d|3[0-1])\./.test(lower)
    );
}

function extractMetaContent(html: string, property: string): string | undefined {
    const patterns = [
        new RegExp(`<meta[^>]+property=["']${property}["'][^>]*content=["']([^"']*)["']`, 'i'),
        new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]*property=["']${property}["']`, 'i'),
        new RegExp(`<meta[^>]+name=["']${property}["'][^>]*content=["']([^"']*)["']`, 'i'),
        new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]*name=["']${property}["']`, 'i'),
    ];
    for (const pattern of patterns) {
        const match = html.match(pattern);
        if (match) return match[1];
    }
    return undefined;
}

async function fetchPreview(targetUrl: URL): Promise<LinkPreviewData> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    try {
        const response = await fetch(targetUrl.toString(), {
            signal: controller.signal,
            redirect: 'follow',
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; BusybeeLinkPreview/1.0)',
                Accept: 'text/html',
            },
        });
        const html = await response.text();
        const titleTagMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
        const image = extractMetaContent(html, 'og:image');
        const resolvedImage = image ? new URL(image, targetUrl).toString() : undefined;

        return {
            url: targetUrl.toString(),
            title: titleTagMatch?.[1]?.trim() ?? extractMetaContent(html, 'og:title'),
            description: extractMetaContent(html, 'og:description'),
            image: resolvedImage,
        };
    } finally {
        clearTimeout(timeout);
    }
}

function sendJson(res: ServerResponse, status: number, body: unknown) {
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(body));
}

async function handleLinkPreviewRequest(
    req: Connect.IncomingMessage,
    res: ServerResponse,
): Promise<boolean> {
    const reqUrl = new URL(req.url ?? '', 'http://localhost');
    if (reqUrl.pathname !== '/api/link-preview') return false;

    const target = reqUrl.searchParams.get('url');
    if (!target) {
        sendJson(res, 400, { error: 'Missing url parameter' });
        return true;
    }

    let targetUrl: URL;
    try {
        targetUrl = new URL(target);
    } catch {
        sendJson(res, 400, { error: 'Invalid url' });
        return true;
    }

    if (targetUrl.protocol !== 'http:' && targetUrl.protocol !== 'https:') {
        sendJson(res, 400, { error: 'Unsupported protocol' });
        return true;
    }

    if (isBlockedHost(targetUrl.hostname)) {
        sendJson(res, 400, { error: 'Host not allowed' });
        return true;
    }

    try {
        const preview = await fetchPreview(targetUrl);
        sendJson(res, 200, preview);
    } catch {
        sendJson(res, 502, { error: 'Failed to fetch preview' });
    }
    return true;
}

export function linkPreviewPlugin(): Plugin {
    const middleware: Connect.NextHandleFunction = (req, res, next) => {
        handleLinkPreviewRequest(req, res)
            .then((handled) => {
                if (!handled) next();
            })
            .catch(next);
    };

    return {
        name: 'link-preview-api',
        configureServer(server) {
            server.middlewares.use(middleware);
        },
        configurePreviewServer(server) {
            server.middlewares.use(middleware);
        },
    };
}
