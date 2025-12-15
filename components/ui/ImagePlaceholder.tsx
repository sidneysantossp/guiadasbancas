"use client";

import Image from "next/image";
import { useState } from "react";

type ImagePlaceholderProps = {
  src?: string | null;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

/**
 * Componente de imagem com fallback para placeholder "SEM IMAGEM"
 * Substitui imagens mock/unsplash por um placeholder padrão
 */
export default function ImagePlaceholder({
  src,
  alt,
  fill,
  width,
  height,
  className = "",
  sizes,
  priority,
}: ImagePlaceholderProps) {
  const [hasError, setHasError] = useState(false);
  
  // Verificar se é uma URL mock (unsplash, placeholder, etc)
  const isMockUrl = !src || 
    src.includes('unsplash.com') || 
    src.includes('placeholder.com') || 
    src.includes('picsum.photos') ||
    src.includes('via.placeholder.com');
  
  const showPlaceholder = hasError || isMockUrl;
  
  if (showPlaceholder) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 ${className}`}
        style={fill ? { position: 'absolute', inset: 0 } : { width, height }}
      >
        <div className="flex flex-col items-center justify-center text-gray-400 p-2">
          <svg 
            viewBox="0 0 24 24" 
            className="h-8 w-8 mb-1" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
          <span className="text-[10px] font-medium text-center">SEM IMAGEM</span>
        </div>
      </div>
    );
  }
  
  return (
    <Image
      src={src!}
      alt={alt}
      fill={fill}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      className={className}
      sizes={sizes}
      priority={priority}
      onError={() => setHasError(true)}
    />
  );
}
