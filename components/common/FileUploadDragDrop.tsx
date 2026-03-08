"use client";

import { useRef, useState } from "react";

interface FileUploadDragDropProps {
  label: string;
  value?: string;
  onChange?: (url: string) => void;
  // Compatibilidade com modo legado (múltiplos arquivos)
  currentFiles?: string[];
  onUploadAction?: (urls: string[]) => void | Promise<void>;
  onRemoveAction?: (url: string) => void;
  maxFiles?: number;
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
  currentFiles,
  onUploadAction,
  onRemoveAction,
  maxFiles = 1,
  placeholder,
  className = "h-28 w-full",
  accept = 'application/pdf',
  maxDisplayLength = 80,
}: FileUploadDragDropProps) {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isMultiMode = Array.isArray(currentFiles) || typeof onUploadAction === 'function' || maxFiles > 1;
  const filesValue = Array.isArray(currentFiles) ? currentFiles : [];
  const primaryValue = value || filesValue[0] || '';

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
    if (files.length > 0) {
      await uploadFiles(files);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      await uploadFiles(files);
    }
  };

  // Função para comprimir imagem antes do upload
  const compressImage = async (file: File, maxSizeMB: number = 2): Promise<File> => {
    // Se não for imagem ou já for pequena, retorna original
    if (!file.type.startsWith('image/') || file.size <= maxSizeMB * 1024 * 1024) {
      return file;
    }

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let { width, height } = img;
          
          // Redimensionar se muito grande (max 1920px)
          const maxDimension = 1920;
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = (height / width) * maxDimension;
              width = maxDimension;
            } else {
              width = (width / height) * maxDimension;
              height = maxDimension;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Comprimir com qualidade reduzida
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                });
                console.log(`📸 Imagem comprimida: ${(file.size / 1024 / 1024).toFixed(2)}MB → ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);
                resolve(compressedFile);
              } else {
                resolve(file);
              }
            },
            'image/jpeg',
            0.8 // Qualidade 80%
          );
        };
        img.src = e.target?.result as string;
      };
      reader.onerror = () => resolve(file);
      reader.readAsDataURL(file);
    });
  };

  const uploadSingleFile = async (file: File): Promise<string | null> => {
    try {
      if (accept && file.type && !file.type.match(accept.replace('*', '.*'))) {
        alert(`Tipo de arquivo inválido. Esperado: ${accept}`);
        return null;
      }

      // Comprimir imagem se necessário (limite de 4MB para Vercel)
      let fileToUpload = file;
      if (file.type.startsWith('image/') && file.size > 2 * 1024 * 1024) {
        console.log(`📸 Comprimindo imagem de ${(file.size / 1024 / 1024).toFixed(2)}MB...`);
        fileToUpload = await compressImage(file, 2);
      }

      // Verificar tamanho final
      if (fileToUpload.size > 4 * 1024 * 1024) {
        alert('Arquivo muito grande. O tamanho máximo é 4MB. Tente uma imagem menor.');
        return null;
      }

      const formData = new FormData();
      formData.append('file', fileToUpload);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      // Verificar erro 413 especificamente
      if (response.status === 413) {
        alert('Arquivo muito grande para o servidor. Tente uma imagem menor (máximo 4MB).');
        return null;
      }

      const result = await response.json();

      if (result.ok && result.url) {
        return result.url as string;
      } else {
        const detail = result.error || `status ${response.status}`;
        alert('Erro ao fazer upload: ' + detail);
        return null;
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Erro ao fazer upload do arquivo');
      return null;
    }
  };

  const uploadFiles = async (files: File[]) => {
    try {
      setUploading(true);

      const allowed = isMultiMode ? Math.max(1, maxFiles) : 1;
      const filesToProcess = files.slice(0, allowed);
      const uploadedUrls: string[] = [];

      for (const file of filesToProcess) {
        const url = await uploadSingleFile(file);
        if (url) uploadedUrls.push(url);
      }

      if (uploadedUrls.length === 0) return;

      if (isMultiMode) {
        if (onUploadAction) {
          await onUploadAction(uploadedUrls);
        } else if (onChange) {
          onChange(uploadedUrls[0]);
        }
      } else if (onChange) {
        onChange(uploadedUrls[0]);
      }
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
    if (!primaryValue) return null;
    
    const isPdf = primaryValue.toLowerCase().endsWith('.pdf') || accept.includes('pdf');
    const isImage = accept.includes('image') || primaryValue.match(/\.(jpg|jpeg|png|gif|webp)$/i);
    
    if (isImage) {
      return (
        <div className="rounded-md border p-3 bg-white">
          <img 
            src={primaryValue} 
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
      const isDataUrl = primaryValue.startsWith('data:');
      const rawName = isDataUrl ? 'TPU.pdf' : (primaryValue.split('/').pop() || 'Arquivo.pdf');
      const name = rawName.length > 80 ? `${rawName.slice(0, 40)}...${rawName.slice(-30)}` : rawName;
      return (
        <div className="flex items-center justify-between rounded-md border p-3 bg-white max-w-full overflow-hidden">
          <div className="flex items-center gap-3 min-w-0">
            <svg className="h-6 w-6 text-red-600" viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"/><path d="M14 2v6h6" fill="#fff" opacity=".3"/></svg>
            <div className="min-w-0">
              <div className="text-sm font-medium break-all">{name}</div>
              <a href={primaryValue} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline break-all">Abrir documento</a>
            </div>
          </div>
          {uploading && <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-500"></div>}
        </div>
      );
    }
    return null;
  };

  const isDataUrl = Boolean(primaryValue && primaryValue.startsWith('data:'));
  const displayValue = isMultiMode
    ? (filesValue.length > 0 ? `${filesValue.length} arquivo(s)` : '')
    : getDisplayValue(primaryValue);

  const renderMultiPreview = () => {
    if (!isMultiMode || filesValue.length === 0) return null;
    return (
      <div className="rounded-md border p-3 bg-white space-y-2">
        {filesValue.map((fileUrl) => (
          <div key={fileUrl} className="flex items-center justify-between gap-2 text-sm">
            <a href={fileUrl} target="_blank" rel="noreferrer" className="truncate text-blue-600 hover:underline">
              {getFileName(fileUrl)}
            </a>
            {onRemoveAction && (
              <button
                type="button"
                onClick={() => onRemoveAction(fileUrl)}
                className="shrink-0 rounded border border-gray-300 px-2 py-1 text-xs text-gray-700 hover:bg-gray-50"
              >
                Remover
              </button>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-3 max-w-full">
      <label className="text-sm font-medium">{label}</label>

      <div className="flex items-center gap-2 min-w-0">
        <input
          type="text"
          value={displayValue}
          onChange={(e) => {
            if (!isDataUrl && !isMultiMode && onChange) {
              onChange(e.target.value);
            }
          }}
          readOnly={isDataUrl || isMultiMode || !onChange}
          title={primaryValue}
          placeholder={placeholder}
          maxLength={256}
          className="min-w-0 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-orange-500 whitespace-nowrap overflow-hidden text-ellipsis"
        />
        {primaryValue && (
          <button
            type="button"
            onClick={() => {
              if (isMultiMode && onRemoveAction) {
                filesValue.forEach((url) => onRemoveAction(url));
                return;
              }
              if (onChange) onChange('');
            }}
            className="text-xs text-gray-600 hover:text-red-600 shrink-0 px-2 py-1 border rounded"
          >
            Limpar
          </button>
        )}
      </div>

      {(isMultiMode ? filesValue.length > 0 : Boolean(primaryValue)) ? (
        isMultiMode ? renderMultiPreview() : renderPreview()
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
        multiple={isMultiMode}
        onChange={handleFileSelect}
        className="hidden"
      />

      <p className="text-xs text-gray-500">
        Formato aceito: {accept === 'image/*' ? 'JPG, PNG, JPEG' : accept === 'application/pdf' ? 'PDF' : accept}. Máximo 5MB.
      </p>
    </div>
  );
}
