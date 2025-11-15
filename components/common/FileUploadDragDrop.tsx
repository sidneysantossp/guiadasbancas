"use client";

import { useRef, useState } from "react";

interface FileUploadDragDropProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  className?: string;
  accept?: string; // e.g. 'application/pdf'
  role?: 'admin' | 'jornaleiro';
  maxDisplayLength?: number; // limite visual no input
}

export default function FileUploadDragDrop({
  label,
  value,
  onChange,
  placeholder,
  className = "h-28 w-full",
  accept = 'application/pdf',
  role = 'jornaleiro',
  maxDisplayLength = 80,
}: FileUploadDragDropProps) {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const authHeader = role === 'admin' ? 'Bearer admin-token' : 'Bearer jornaleiro-token';

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
    const file = files[0];
    if (file) {
      await uploadFile(file);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadFile(file);
    }
  };

  const uploadFile = async (file: File) => {
    try {
      setUploading(true);

      if (accept && file.type && !file.type.match(accept.replace('*', '.*'))) {
        alert(`Tipo de arquivo inválido. Esperado: ${accept}`);
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Authorization': authHeader },
        body: formData,
      });

      const result = await response.json();

      if (result.ok && result.url) {
        onChange(result.url);
      } else {
        alert('Erro ao fazer upload: ' + (result.error || 'Erro desconhecido'));
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Erro ao fazer upload do arquivo');
    } finally {
      setUploading(false);
    }
  };

  const handleClick = () => fileInputRef.current?.click();

  const getFileName = (url: string) => {
    try {
      if (!url) return '';
      if (url.startsWith('data:')) return 'TPU.pdf';
      if (url.startsWith('http')) {
        const u = new URL(url);
        const last = u.pathname.split('/').pop() || '';
        return decodeURIComponent(last || u.hostname);
      }
      const last = url.split('/').pop();
      return last || url;
    } catch {
      return url;
    }
  };

  const getDisplayValue = (url: string) => {
    const name = getFileName(url);
    if (!name) return '';
    return name.length > maxDisplayLength
      ? `${name.slice(0, Math.max(0, maxDisplayLength - 1))}…`
      : name;
  };

  const renderPreview = () => {
    if (!value) return null;
    
    const isPdf = value.toLowerCase().endsWith('.pdf') || accept.includes('pdf');
    const isImage = accept.includes('image') || value.match(/\.(jpg|jpeg|png|gif|webp)$/i);
    
    if (isImage) {
      return (
        <div className="rounded-md border p-3 bg-white">
          <img 
            src={value} 
            alt="Preview" 
            className="w-full h-32 object-cover rounded"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      );
    }
    
    if (isPdf) {
      const isDataUrl = value.startsWith('data:');
      const rawName = isDataUrl ? 'TPU.pdf' : (value.split('/').pop() || 'Arquivo.pdf');
      const name = rawName.length > 80 ? `${rawName.slice(0, 40)}...${rawName.slice(-30)}` : rawName;
      return (
        <div className="flex items-center justify-between rounded-md border p-3 bg-white max-w-full overflow-hidden">
          <div className="flex items-center gap-3 min-w-0">
            <svg className="h-6 w-6 text-red-600" viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"/><path d="M14 2v6h6" fill="#fff" opacity=".3"/></svg>
            <div className="min-w-0">
              <div className="text-sm font-medium break-all">{name}</div>
              <a href={value} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline break-all">Abrir documento</a>
            </div>
          </div>
          {uploading && <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-500"></div>}
        </div>
      );
    }
    return null;
  };

  const isDataUrl = Boolean(value && value.startsWith('data:'));
  const displayValue = getDisplayValue(value);

  return (
    <div className="space-y-3 max-w-full">
      <label className="text-sm font-medium">{label}</label>

      <div className="flex items-center gap-2 min-w-0">
        <input
          type="text"
          value={displayValue}
          onChange={(e) => !isDataUrl && onChange(e.target.value)}
          readOnly={isDataUrl}
          title={value}
          placeholder={placeholder}
          maxLength={256}
          className="min-w-0 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-orange-500 whitespace-nowrap overflow-hidden text-ellipsis"
        />
        {value && (
          <button type="button" onClick={() => onChange('')} className="text-xs text-gray-600 hover:text-red-600 shrink-0 px-2 py-1 border rounded">
            Limpar
          </button>
        )}
      </div>

      {value ? (
        renderPreview()
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
          className={`relative border-2 border-dashed rounded-lg cursor-pointer transition-colors ${dragOver ? 'border-orange-500 bg-orange-50' : 'border-gray-300 hover:border-gray-400'}`}
        >
          <div className={`${className} flex flex-col items-center justify-center text-gray-500 p-4`}>
            {uploading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            ) : (
              <>
                <svg className="h-8 w-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span className="text-xs text-center">
                  Clique ou arraste um arquivo ({accept})
                </span>
              </>
            )}
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
      />

      <p className="text-xs text-gray-500">
        Formato aceito: {accept === 'image/*' ? 'JPG, PNG, JPEG' : accept === 'application/pdf' ? 'PDF' : accept}. Máximo 5MB.
      </p>
    </div>
  );
}
