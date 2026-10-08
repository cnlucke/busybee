import { useEffect, useState } from 'react';
import { parseHttpUrl } from './url';

interface PreviewData {
    url: string;
    title?: string;
    description?: string;
    image?: string;
}

interface LinkPreviewProps {
    url: string;
    done: boolean;
    onTitleClick: () => void;
    /** Text surrounding the URL in the original task title, kept around the fetched page title. */
    before?: string;
    after?: string;
}

const previewCache = new Map<string, PreviewData | null>();

export default function LinkPreview({ url, done, onTitleClick, before, after }: LinkPreviewProps) {
    const [fetchedPreview, setFetchedPreview] = useState<PreviewData | null>(null);
    const [failedImageUrl, setFailedImageUrl] = useState<string | null>(null);

    useEffect(() => {
        if (previewCache.has(url)) return;
        let cancelled = false;
        fetch(`/api/link-preview?url=${encodeURIComponent(url)}`)
            .then((res) => (res.ok ? res.json() : Promise.reject(new Error('preview failed'))))
            .then((data: PreviewData) => {
                if (cancelled) return;
                previewCache.set(url, data);
                setFetchedPreview(data);
            })
            .catch(() => {
                if (cancelled) return;
                previewCache.set(url, null);
                setFetchedPreview(null);
            });
        return () => {
            cancelled = true;
        };
    }, [url]);

    const preview = previewCache.has(url) ? previewCache.get(url)! : fetchedPreview;
    const imageFailed = failedImageUrl === url;
    const hostname = parseHttpUrl(url)?.hostname ?? url;
    const titleText = preview?.title ?? hostname;
    const label = `${before ?? ''}${titleText}${after ?? ''}`;
    const showImage = preview?.image && !imageFailed;

    return (
        <span style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', flex: 1, minWidth: 0 }}>
            <a
                href={url}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                style={{ flexShrink: 0, lineHeight: 0 }}
            >
                {showImage ? (
                    <img
                        src={preview!.image}
                        alt={label}
                        onError={() => setFailedImageUrl(url)}
                        style={{
                            width: '48px',
                            height: '32px',
                            objectFit: 'cover',
                            borderRadius: '4px',
                            border: '1px solid #ddd',
                            opacity: done ? 0.5 : 1,
                        }}
                    />
                ) : (
                    <span
                        style={{
                            width: '48px',
                            height: '32px',
                            borderRadius: '4px',
                            border: '1px solid #ddd',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.6rem',
                            color: '#999',
                            textAlign: 'center',
                            padding: '0 2px',
                            overflow: 'hidden',
                        }}
                    >
                        {hostname}
                    </span>
                )}
            </a>
            <span
                onClick={onTitleClick}
                title={url}
                style={{
                    textDecoration: done ? 'line-through' : 'none',
                    color: done ? '#888' : '#000',
                    cursor: 'text',
                    flex: 1,
                    minWidth: 0,
                    overflowWrap: 'break-word',
                }}
            >
                {label}
            </span>
        </span>
    );
}
