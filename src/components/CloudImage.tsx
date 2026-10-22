import React, { useState, useEffect } from 'react';
import { resolveCloudImageUrl, getCachedCloudMedia } from '../services/firebase';
import { Image as ImageIcon } from 'lucide-react';

interface CloudImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string | null | undefined;
  fallbackIcon?: React.ReactNode;
}

export const CloudImage: React.FC<CloudImageProps> = ({
  src,
  alt = '',
  className = '',
  fallbackIcon,
  ...rest
}) => {
  const [resolvedSrc, setResolvedSrc] = useState<string | null>(() => getCachedCloudMedia(src));
  const [loading, setLoading] = useState<boolean>(() => Boolean(src && !getCachedCloudMedia(src)));
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    setHasError(false);

    if (!src) {
      setResolvedSrc(null);
      setLoading(false);
      return;
    }

    const cached = getCachedCloudMedia(src);
    if (cached) {
      setResolvedSrc(cached);
      setLoading(false);
      return;
    }

    setLoading(true);
    resolveCloudImageUrl(src)
      .then((url) => {
        if (isMounted) {
          if (url) {
            setResolvedSrc(url);
          } else {
            setHasError(true);
          }
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setHasError(true);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [src]);

  if (!src || hasError) {
    return (
      <div
        className={`flex items-center justify-center bg-slate-900 border border-slate-800 text-slate-500 overflow-hidden ${className}`}
        title={alt || 'صورة'}
      >
        {fallbackIcon || <ImageIcon className="w-4 h-4 text-slate-500" />}
      </div>
    );
  }

  if (loading || !resolvedSrc) {
    return (
      <div
        className={`flex items-center justify-center bg-slate-900/80 animate-pulse border border-slate-800/60 overflow-hidden ${className}`}
      >
        <span className="w-3.5 h-3.5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      onError={() => setHasError(true)}
      {...rest}
    />
  );
};
