'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function UploadImagensMassaPage() {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [progress, setProgress] = useState<{ done: number; total: number; batch: number; batches: number } | null>(null);
  const BATCH_SIZE = 8;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files);
      setFiles(selected);
      setResults(null);
      void startUpload(selected);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      const selected = Array.from(e.dataTransfer.files);
      setFiles(selected);
      setResults(null);
      void startUpload(selected);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const startUpload = async (selected: File[]) => {
    if (selected.length === 0) {
      alert('Selecione pelo menos uma imagem');
      return;
    }

    setUploading(true);
    setResults(null);
    setProgress({ done: 0, total: selected.length, batch: 0, batches: Math.ceil(selected.length / BATCH_SIZE) });

    try {
      const totalBatches = Math.ceil(selected.length / BATCH_SIZE);
      const aggregate = { success: [] as any[], errors: [] as any[], total: selected.length };

      for (let b = 0; b < totalBatches; b++) {
        const slice = selected.slice(b * BATCH_SIZE, (b + 1) * BATCH_SIZE);
        setProgress({ done: b * BATCH_SIZE, total: selected.length, batch: b + 1, batches: totalBatches });

        const formData = new FormData();
        slice.forEach(file => formData.append('images', file));

        const response = await fetch('/api/admin/produtos/upload-imagens-massa', {
          method: 'POST',
          headers: { 'Authorization': 'Bearer admin-token' },
          body: formData,
        });

        let data: any = null;
        const text = await response.text();
        try { data = JSON.parse(text); } catch { data = null; }

        if (!response.ok) {
          const msg = data?.error || text?.slice(0, 200) || 'Erro desconhecido';
          // Se for 413, reprocessar cada arquivo individualmente
          if (response.status === 413 || /entity too large/i.test(msg)) {
            for (const file of slice) {
              const singleFD = new FormData();
              singleFD.append('images', file);
              const r = await fetch('/api/admin/produtos/upload-imagens-massa', {
                method: 'POST',
                headers: { 'Authorization': 'Bearer admin-token' },
                body: singleFD,
              });
              const t = await r.text();
              let j: any = null; try { j = JSON.parse(t); } catch { j = null; }
              if (r.ok) {
                const payload = j?.data || { success: [], errors: [] };
                if (Array.isArray(payload.success)) aggregate.success.push(...payload.success);
                if (Array.isArray(payload.errors)) aggregate.errors.push(...payload.errors);
              } else {
                const emsg = j?.error || t?.slice(0, 200) || `HTTP ${r.status}`;
                aggregate.errors.push({ file: file.name, error: emsg });
              }
              setResults({ ...aggregate });
              setProgress(p => p ? { ...p, done: Math.min((b + 1) * BATCH_SIZE, selected.length) } : null);
              await new Promise(rsl => setTimeout(rsl, 60));
            }
            // Prosseguir para o próximo lote
            continue;
          } else {
            aggregate.errors.push({ file: `lote-${b + 1}`, error: msg });
            setResults({ ...aggregate });
            await new Promise(r => setTimeout(r, 80));
            continue;
          }
        }

        const payload = data?.data || { success: [], errors: [] };
        if (Array.isArray(payload.success)) aggregate.success.push(...payload.success);
        if (Array.isArray(payload.errors)) aggregate.errors.push(...payload.errors);

        setResults({ ...aggregate });
        setProgress({ done: Math.min((b + 1) * BATCH_SIZE, selected.length), total: selected.length, batch: b + 1, batches: totalBatches });
        // Aguardar levemente entre lotes para evitar limitações
        await new Promise(r => setTimeout(r, 120));
      }

      setProgress(p => p ? { ...p, done: p.total } : null);
    } catch (error: any) {
      console.error('Erro no upload:', error);
      alert('Erro ao fazer upload das imagens');
    } finally {
      setUploading(false);
    }
  };

  const handleUpload = async () => {
    await startUpload(files);
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Upload de Imagens em Massa</h1>
          <p className="mt-1 text-sm text-gray-600">
            Faça upload de múltiplas imagens e vincule automaticamente aos produtos pelo código Mercos
          </p>
        </div>
        <Link
          href="/admin/produtos"
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Voltar
        </Link>
      </div>

      {/* Instruções */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">📋 Como funciona:</h3>
        <ol className="list-decimal list-inside text-sm text-blue-800 space-y-1">
          <li>Renomeie as imagens com o código Mercos (ex: <code className="bg-blue-100 px-1 rounded">AKOTO001.jpg</code>)</li>
          <li>Arraste as imagens para a área abaixo ou clique para selecionar</li>
          <li>Clique em "Fazer Upload" para processar</li>
          <li>O sistema vincula automaticamente cada imagem ao produto correspondente</li>
        </ol>
      </div>

      {/* Área de Drop */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-[#ff5c00] transition-colors"
      >
        <input
          type="file"
          id="file-upload"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <div className="mx-auto w-12 h-12 text-gray-400 mb-4">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>
          <p className="text-lg font-medium text-gray-700">
            Arraste as imagens aqui ou clique para selecionar
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Suporta múltiplos arquivos (JPG, PNG, WebP)
          </p>
        </label>
      </div>

      {/* Lista de Arquivos Selecionados */}
      {files.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold text-gray-900 mb-3">
            {files.length} imagem(ns) selecionada(s):
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {files.map((file, index) => {
              const codigo = file.name.split('.')[0];
              return (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      Código: <span className="font-mono text-[#ff5c00]">{codigo}</span>
                    </p>
                    <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="ml-2 text-red-600 hover:text-red-800"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>

          <button
            onClick={handleUpload}
            disabled={uploading}
            className="mt-4 w-full px-6 py-3 bg-[#ff5c00] text-white font-semibold rounded-lg hover:bg-[#e55400] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? 'Processando...' : `Fazer Upload de ${files.length} Imagem(ns)`}
          </button>
        </div>
      )}

      {/* Resultados */}
      {results && (
        <div className="mt-6 space-y-4">
          {/* Sucessos */}
          {results.success.length > 0 && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-3">
                ✅ {results.success.length} imagem(ns) vinculada(s) com sucesso:
              </h3>
              <div className="space-y-2">
                {results.success.map((item: any, index: number) => (
                  <div key={index} className="text-sm text-green-800 flex items-start">
                    <span className="font-mono bg-green-100 px-2 py-1 rounded mr-2">{item.codigo}</span>
                    <span>→ {item.produtoNome}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Erros */}
          {results.errors.length > 0 && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="font-semibold text-red-900 mb-3">
                ❌ {results.errors.length} erro(s):
              </h3>
              <div className="space-y-2">
                {results.errors.map((item: any, index: number) => (
                  <div key={index} className="text-sm text-red-800">
                    <span className="font-mono bg-red-100 px-2 py-1 rounded mr-2">{item.codigo || item.file}</span>
                    <span>→ {item.error}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={() => {
              setFiles([]);
              setResults(null);
            }}
            className="w-full px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700"
          >
            Fazer Novo Upload
          </button>
        </div>
      )}
    </div>
  );
}
