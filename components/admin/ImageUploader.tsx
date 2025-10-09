"use client";

import React, { useEffect, useRef, useState } from "react";

export interface ImageUploaderProps {
  label?: string;
  multiple?: boolean;
  max?: number;
  value?: string[]; // urls atuais
  onChange?: (files: File[], previews: string[]) => void;
  previewShape?: 'square' | 'circle';
}

export default function ImageUploader({ label = "Imagens", multiple = true, max = 8, value = [], onChange, previewShape = 'square' }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [previews, setPreviews] = useState<string[]>(value);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setPreviews(value);
  }, [value]);

  const onPick = () => inputRef.current?.click();

  const handleFiles = (filesList: FileList | null) => {
    if (!filesList) return;
    const files = Array.from(filesList).slice(0, Math.max(1, max));
    const readers = files.map((f) => new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(f);
    }));
    Promise.all(readers).then((urls) => {
      const next = [...previews, ...urls].slice(0, max);
      setPreviews(next);
      onChange?.(files, next);
    });
  };

  const removeAt = (idx: number) => {
    const next = previews.filter((_, i) => i !== idx);
    setPreviews(next);
    onChange?.([], next);
  };

  const move = (from: number, to: number) => {
    if (to < 0 || to >= previews.length) return;
    const next = previews.slice();
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    setPreviews(next);
    onChange?.([], next);
  };

  // Drag and Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">{label}</label>
        <button type="button" onClick={onPick} className="text-sm text-[#ff5c00] font-medium">Adicionar</button>
      </div>
      <input ref={inputRef} type="file" accept="image/*" multiple={multiple} className="hidden" onChange={(e)=>handleFiles(e.target.files)} />

      {previews.length === 0 ? (
        <div 
          className={`mt-2 border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer ${
            isDragging 
              ? 'border-[#ff5c00] bg-orange-50 text-[#ff5c00]' 
              : 'border-gray-300 text-gray-500 hover:border-gray-400 hover:bg-gray-50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={onPick}
        >
          <div className="flex flex-col items-center gap-2">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <div className="text-sm font-medium">
              {isDragging ? 'Solte as imagens aqui' : 'Arraste imagens ou clique para selecionar'}
            </div>
            <div className="text-xs opacity-75">
              Suporta JPG, PNG • Máximo {max} imagens • Até 2MB cada
            </div>
          </div>
        </div>
      ) : (
        <div 
          className={`mt-2 relative ${isDragging ? 'bg-orange-50 border-2 border-dashed border-[#ff5c00] rounded-lg p-2' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {isDragging && (
            <div className="absolute inset-0 bg-orange-100/80 rounded-lg flex items-center justify-center z-10">
              <div className="text-[#ff5c00] text-sm font-medium">Solte para adicionar mais imagens</div>
            </div>
          )}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {previews.map((src, i) => (
              <div
                key={i}
                className={
                  previewShape === 'circle'
                    ? "relative group rounded-full overflow-hidden border h-24 w-24 mx-auto"
                    : "relative group rounded-md overflow-hidden border"
                }
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt="preview"
                  className={previewShape === 'circle' ? 'h-24 w-24 object-cover' : 'w-full h-24 object-cover'}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button type="button" onClick={()=>move(i, i-1)} className="text-white bg-black/40 rounded px-2 py-1 text-xs">◀︎</button>
                  <button type="button" onClick={()=>removeAt(i)} className="text-white bg-red-600 rounded px-2 py-1 text-xs">Remover</button>
                  <button type="button" onClick={()=>move(i, i+1)} className="text-white bg-black/40 rounded px-2 py-1 text-xs">▶︎</button>
                </div>
              </div>
            ))}
            {previews.length < max && (
              <div
                className={
                  previewShape === 'circle'
                    ? "border-2 border-dashed border-gray-300 rounded-full h-24 w-24 mx-auto flex items-center justify-center cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors"
                    : "border-2 border-dashed border-gray-300 rounded-md h-24 flex items-center justify-center cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors"
                }
                onClick={onPick}
              >
                <div className="text-center">
                  <svg className="w-6 h-6 mx-auto mb-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <div className="text-xs text-gray-500">Adicionar</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
