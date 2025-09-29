"use client";

import { useState } from "react";
import Image from "next/image";

interface VideoTutorialProps {
  title: string;
  videoId?: string; // ID do vídeo do YouTube
  thumbnailUrl?: string; // URL customizada da thumbnail
  description?: string;
}

export default function VideoTutorial({ 
  title, 
  videoId = "dQw4w9WgXcQ", // Video placeholder
  thumbnailUrl,
  description 
}: VideoTutorialProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  // URL da thumbnail do YouTube ou customizada
  const thumbUrl = thumbnailUrl || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  
  // URL do embed do YouTube
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;

  const handlePlayVideo = () => {
    setIsPlaying(true);
  };

  return (
    <div className="rounded-lg border border-red-200 bg-gradient-to-r from-red-50 to-pink-50 p-4 mb-4">
      {/* Header com ícone do YouTube */}
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center justify-center w-8 h-8 bg-red-600 rounded-lg">
          <svg 
            viewBox="0 0 24 24" 
            className="w-5 h-5 text-white" 
            fill="currentColor"
          >
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
          {description && (
            <p className="text-xs text-gray-600 mt-1">{description}</p>
          )}
        </div>
      </div>

      {/* Video Player / Thumbnail */}
      <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
        {!isPlaying ? (
          // Thumbnail com botão play
          <div className="relative w-full h-full cursor-pointer group" onClick={handlePlayVideo}>
            <div className="relative w-full h-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
              {/* Placeholder com ícone do YouTube */}
              <div className="text-center text-white">
                <svg 
                  viewBox="0 0 24 24" 
                  className="w-16 h-16 mx-auto mb-2 opacity-80" 
                  fill="currentColor"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                <div className="text-sm font-medium opacity-90">Tutorial em Vídeo</div>
                <div className="text-xs opacity-75 mt-1">{title}</div>
              </div>
              
              {/* Tentativa de carregar thumbnail do YouTube (oculta se falhar) */}
              <Image
                src={thumbUrl}
                alt={`Thumbnail do vídeo: ${title}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  // Ocultar imagem se falhar
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
                onLoad={(e) => {
                  // Mostrar imagem se carregar com sucesso
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'block';
                }}
                style={{ display: 'none' }}
              />
            </div>
            
            {/* Overlay escuro */}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
            
            {/* Botão Play */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center group-hover:bg-red-700 transition-colors shadow-lg">
                <svg 
                  viewBox="0 0 24 24" 
                  className="w-8 h-8 text-white ml-1" 
                  fill="currentColor"
                >
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>

            {/* Badge YouTube */}
            <div className="absolute bottom-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold">
              YouTube
            </div>
          </div>
        ) : (
          // Player do YouTube incorporado
          <iframe
            src={embedUrl}
            title={title}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>

      {/* Footer com dica */}
      <div className="mt-3 text-xs text-gray-600 flex items-center gap-2">
        <svg viewBox="0 0 24 24" className="w-4 h-4 text-blue-500" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
        </svg>
        <span>Assista ao tutorial para aprender como usar esta funcionalidade</span>
      </div>
    </div>
  );
}
