import React, { useState } from 'react';
import images from '../../data/image-manifest.json';

export function imageMetadata(src) {
  const key = typeof src === 'string' ? src.split('/').pop().split('.')[0] : '';
  return images[key];
}

/** Responsive delivery with original URLs retained as the native fallback. */
export default function OptimizedImage({ src, alt, sizes = '100vw', loading = 'lazy', priority = false, ...props }) {
  const metadata = imageMetadata(src);
  const [original, setOriginal] = useState(false);
  const image = (
    <img {...props} src={metadata?.posterFallback || src} alt={alt}
      width={metadata?.width} height={metadata?.height} loading={loading} decoding="async"
      fetchpriority={priority ? 'high' : undefined}
      onError={() => setOriginal(true)}
    />
  );
  if (!metadata) return image;
  return (
    <picture>
      {!original && <source type="image/webp" sizes={sizes} srcSet={metadata.variants.map(variant => `${variant.src} ${variant.width}w`).join(', ')} />}
      {image}
    </picture>
  );
}
