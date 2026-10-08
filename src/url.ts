export function parseHttpUrl(value: string): URL | null {
    try {
        const url = new URL(value.trim());
        return url.protocol === 'http:' || url.protocol === 'https:' ? url : null;
    } catch {
        return null;
    }
}

const EMBEDDED_URL_PATTERN = /https?:\/\/[^\s<>"')]+/i;

export interface EmbeddedUrlMatch {
    url: URL;
    /** The surrounding text before the matched URL. */
    before: string;
    /** The surrounding text after the matched URL. */
    after: string;
}

export function findEmbeddedUrl(text: string): EmbeddedUrlMatch | null {
    const match = text.match(EMBEDDED_URL_PATTERN);
    if (!match || match.index === undefined) return null;
    // Strip trailing punctuation that's likely sentence punctuation, not part of the URL.
    const trailingPunct = match[0].match(/[.,;:!?)\]]+$/)?.[0] ?? '';
    const raw = trailingPunct ? match[0].slice(0, -trailingPunct.length) : match[0];
    const url = parseHttpUrl(raw);
    if (!url) return null;
    return {
        url,
        before: text.slice(0, match.index),
        after: text.slice(match.index + raw.length),
    };
}
