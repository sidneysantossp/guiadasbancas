"use client";

import { useState, useRef, DragEvent } from "react";
import Image from "next/image";

interface ProductImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export default function ProductImageUploader({ 
  images, 
  onChange, 
  maxImages = 4 
}: ProductImageUploaderProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    files.forEach(file => {
      if (images.length >= maxImages) return;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImage = e.target?.result as string;
        onChange([...images, newImage]);
      };
      reader.readAsDataURL(file);
    });
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  const handleDragStart = (e: DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    // Add visual feedback
    (e.target as HTMLElement).style.opacity = '0.5';
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e: DragEvent) => {
    e.preventDefault();
    (e.currentTarget as HTMLElement).classList.add('ring-2', 'ring-blue-400');
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    (e.currentTarget as HTMLElement).classList.remove('ring-2', 'ring-blue-400');
  };

  const handleDrop = (e: DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    // Remove visual feedback
    (e.currentTarget as HTMLElement).classList.remove('ring-2', 'ring-blue-400');
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];
    
    // Remove from original position
    newImages.splice(draggedIndex, 1);
    
    // Insert at new position
    newImages.splice(dropIndex, 0, draggedImage);
    
    onChange(newImages);
    setDraggedIndex(null);
  };

  const handleDragEnd = (e: DragEvent) => {
    setDraggedIndex(null);
    // Reset opacity
    (e.target as HTMLElement).style.opacity = '1';
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <label className="text-sm font-medium text-gray-900">Imagem Destacada</label>
      <div className="text-xs text-gray-500 mb-3">
        A primeira imagem será a destacada. Arraste para reordenar.
      </div>
      
      <div className="grid grid-cols-4 gap-2">
        {/* Render existing images */}
        {Array.from({ length: maxImages }).map((_, index) => {
          const image = images[index];
          const isEmpty = !image;
          const isFirst = index === 0;
          
          return (
            <div
              key={index}
              className={`
                relative aspect-square border-2 border-dashed rounded-lg overflow-hidden
                ${isEmpty ? 'border-gray-300 bg-gray-50' : 'border-gray-200 bg-white'}
                ${draggedIndex === index ? 'opacity-50' : ''}
                ${isFirst && !isEmpty ? 'ring-2 ring-[#ff5c00] ring-opacity-50' : ''}
                transition-all duration-200
              `}
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
            >
              {isEmpty ? (
                <button
                  type="button"
                  onClick={openFileDialog}
                  className="w-full h-full flex flex-col items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span className="text-xs font-medium text-center px-1">
                    {index === 0 ? 'Principal' : `+${index}`}
                  </span>
                </button>
              ) : (
                <div
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragEnd={handleDragEnd}
                  className="relative w-full h-full cursor-move group"
                >
                  <Image
                    src={image}
                    alt={`Produto ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  
                  {/* Badge para imagem principal */}
                  {isFirst && (
                    <div className="absolute top-1 left-1 bg-[#ff5c00] text-white text-xs px-1.5 py-0.5 rounded-full font-medium">
                      ★
                    </div>
                  )}
                  
                  {/* Drag handle */}
                  <div className="absolute top-1 right-1 bg-black bg-opacity-50 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-move">
                    <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                    </svg>
                  </div>
                  
                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute bottom-1 right-1 bg-red-500 text-white p-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />
      
      {/* Instructions */}
      <div className="mt-3 text-xs text-gray-500 space-y-1">
        <p>• A primeira imagem será exibida como destaque nos cards</p>
        <p>• As demais aparecerão na galeria da página do produto</p>
        <p>• Arraste as imagens para reordenar</p>
        <p>• Formatos aceitos: JPG, PNG, WebP (máx. 5MB cada)</p>
      </div>
    </div>
  );
}
