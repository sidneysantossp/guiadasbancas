"use client";

import { useState, useRef } from "react";

interface ImageUploadDragDropProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  className?: string;
}

export default function ImageUploadDragDrop({ 
  label, 
  value, 
  onChange, 
  placeholder = "https://exemplo.com/imagem.jpg",
  className = "h-32 w-32"
}: ImageUploadDragDropProps) {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      await uploadFile(imageFile);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      await uploadFile(file);
    }
  };

  const uploadFile = async (file: File) => {
    try {
      setUploading(true);
      
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer admin-token'
        },
        body: formData
      });
      
      const result = await response.json();
      
      if (result.ok && result.url) {
        onChange(result.url);
      } else {
        alert('Erro ao fazer upload: ' + (result.error || 'Erro desconhecido'));
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Erro ao fazer upload da imagem');
    } finally {
      setUploading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">{label}</label>
      
      {/* URL Input */}
      <input
        type="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-orange-500"
      />
      
      {/* Drag & Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`
          relative border-2 border-dashed rounded-lg cursor-pointer transition-colors
          ${dragOver ? 'border-orange-500 bg-orange-50' : 'border-gray-300 hover:border-gray-400'}
          ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {value ? (
          <div className={`${className} relative overflow-hidden rounded-lg`}>
            <img 
              src={value} 
              alt="Preview" 
              className="h-full w-full object-cover"
            />
            {uploading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              </div>
            )}
            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-opacity flex items-center justify-center">
              <span className="text-white text-sm opacity-0 hover:opacity-100 transition-opacity">
                Clique ou arraste para alterar
              </span>
            </div>
          </div>
        ) : (
          <div className={`${className} flex flex-col items-center justify-center text-gray-500 p-4`}>
            {uploading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            ) : (
              <>
                <svg className="h-8 w-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span className="text-xs text-center">
                  Clique ou arraste uma imagem
                </span>
              </>
            )}
          </div>
        )}
      </div>
      
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      {/* Helper Text */}
      <p className="text-xs text-gray-500">
        Formatos aceitos: JPG, PNG, GIF, WebP. Máximo 5MB.
      </p>
    </div>
  );
}
