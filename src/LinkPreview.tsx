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
        <span className="flex items-start gap-2 flex-1 min-w-0">
            <a
                href={url}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="shrink-0 leading-[0]"
            >
                {showImage ? (
                    <img
                        src={preview!.image}
                        alt={label}
                        onError={() => setFailedImageUrl(url)}
                        className={`w-12 h-8 object-cover rounded border border-[#ddd] ${done ? 'opacity-50' : ''}`}
                    />
                ) : (
                    <span className="w-12 h-8 rounded border border-[#ddd] flex items-center justify-center text-[0.6rem] text-[#999] text-center px-0.5 overflow-hidden">
                        {hostname}
                    </span>
                )}
            </a>
            <span
                onClick={onTitleClick}
                title={url}
                className={`${done ? 'line-through text-[#888]' : 'text-black'} cursor-text flex-1 min-w-0 wrap-break-word`}
            >
                {label}
            </span>
        </span>
    );
}
