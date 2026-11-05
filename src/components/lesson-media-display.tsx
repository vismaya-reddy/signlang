'use client';

import Image from 'next/image';
import { useState } from 'react';
import { AlertCircle, Image as ImageIcon } from 'lucide-react';

interface LessonMediaDisplayProps {
  mediaUrl: string | null;
  title: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export function LessonMediaDisplay({
  mediaUrl,
  title,
  size = 'medium',
  className = '',
}: LessonMediaDisplayProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const sizeClasses = {
    small: 'aspect-square',
    medium: 'aspect-square',
    large: 'aspect-square',
  };

  // If no media URL provided, show placeholder
  if (!mediaUrl) {
    return (
      <div
        className={`w-full ${sizeClasses[size]} bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg overflow-hidden flex items-center justify-center flex-col gap-2 ${className}`}
      >
        <ImageIcon className="w-12 h-12 text-muted-foreground/50" />
        <span className="text-2xl font-bold text-muted-foreground/70">{title}</span>
        <span className="text-xs text-muted-foreground/50">No image available</span>
      </div>
    );
  }

  // If media failed to load, show error placeholder
  if (imageError) {
    return (
      <div
        className={`w-full ${sizeClasses[size]} bg-gradient-to-br from-destructive/10 to-destructive/5 rounded-lg overflow-hidden flex items-center justify-center flex-col gap-2 ${className}`}
      >
        <AlertCircle className="w-12 h-12 text-destructive/50" />
        <span className="text-xs text-destructive/70 text-center px-2">
          Failed to load image
        </span>
        <span className="text-2xl font-bold text-muted-foreground/50">{title}</span>
      </div>
    );
  }

  return (
    <div className={`w-full ${sizeClasses[size]} bg-muted rounded-lg overflow-hidden relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-muted animate-pulse z-10" />
      )}
      <Image
        src={mediaUrl}
        alt={title}
        fill
        className="object-cover"
        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
        priority={false}
        loading="lazy"
        onLoadingComplete={() => setIsLoading(false)}
        onError={(e) => {
          console.error('❌ Image load failed:', {
            url: mediaUrl,
            title,
            error: e,
          });
          setImageError(true);
          setIsLoading(false);
        }}
      />
    </div>
  );
}
