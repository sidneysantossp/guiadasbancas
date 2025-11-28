'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  IconUpload,
  IconPhoto,
  IconCheck,
  IconX,
  IconTrash,
  IconRefresh,
} from '@tabler/icons-react';

export default function DistribuidorUploadImagensPage() {
  const [distribuidor, setDistribuidor] = useState<any>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [progress, setProgress] = useState<{ done: number; total: number; batch: number; batches: number } | null>(null);
  const BATCH_SIZE = 8;

  useEffect(() => {
    const raw = localStorage.getItem("gb:distribuidor");
    if (raw) {
      setDistribuidor(JSON.parse(raw));
    }
  }, []);

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
    if (!distribuidor?.id) {
      alert('Erro: Distribuidor não identificado');
      return;
    }

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
        formData.append('distribuidor_id', distribuidor.id);
        slice.forEach(file => formData.append('images', file));

        const response = await fetch('/api/distribuidor/upload-imagens', {
          method: 'POST',
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
              singleFD.append('distribuidor_id', distribuidor.id);
              singleFD.append('images', file);
              const r = await fetch('/api/distribuidor/upload-imagens', {
                method: 'POST',
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

  const resetUpload = () => {
    setFiles([]);
    setResults(null);
    setProgress(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Upload de Imagens</h1>
          <p className="text-gray-600">
            Faça upload de múltiplas imagens e vincule automaticamente aos produtos pelo código
          </p>
        </div>
        <Link
          href="/distribuidor/produtos"
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Ver Produtos
        </Link>
      </div>

      {/* Instruções */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
        <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
          <IconPhoto size={20} />
          Como funciona:
        </h3>
        <ol className="list-decimal list-inside text-sm text-blue-800 space-y-2">
          <li>
            Renomeie as imagens com o <strong>código do produto</strong> (ex: <code className="bg-blue-100 px-1.5 py-0.5 rounded font-mono">AKOTO001.jpg</code>)
          </li>
          <li>Arraste as imagens para a área abaixo ou clique para selecionar</li>
          <li>O sistema vincula automaticamente cada imagem ao produto correspondente</li>
          <li>Imagens são adicionadas ao início da galeria do produto</li>
        </ol>
        <div className="mt-3 p-3 bg-blue-100 rounded-lg text-sm text-blue-900">
          <strong>Dica:</strong> Você pode enviar variações como <code className="bg-white px-1 rounded">AKOTO001_01.jpg</code>, <code className="bg-white px-1 rounded">AKOTO001_02.jpg</code> - todas serão vinculadas ao mesmo produto.
        </div>
      </div>

      {/* Área de Drop */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
          uploading 
            ? 'border-gray-300 bg-gray-50' 
            : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50 cursor-pointer'
        }`}
      >
        <input
          type="file"
          id="file-upload"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={uploading}
        />
        <label htmlFor="file-upload" className={uploading ? 'cursor-not-allowed' : 'cursor-pointer'}>
          <div className="mx-auto w-16 h-16 text-gray-400 mb-4 flex items-center justify-center">
            <IconUpload size={48} />
          </div>
          <p className="text-lg font-medium text-gray-700">
            {uploading ? 'Processando...' : 'Arraste as imagens aqui ou clique para selecionar'}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Suporta múltiplos arquivos (JPG, PNG, WebP)
          </p>
        </label>
      </div>

      {/* Progress Bar */}
      {progress && uploading && (
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Processando lote {progress.batch} de {progress.batches}
            </span>
            <span className="text-sm text-gray-500">
              {progress.done} / {progress.total} imagens
            </span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${(progress.done / progress.total) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Lista de Arquivos Selecionados (antes do upload) */}
      {files.length > 0 && !results && !uploading && (
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <IconPhoto size={20} />
            {files.length} imagem(ns) selecionada(s)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
            {files.map((file, index) => {
              const codigo = file.name.split('.')[0].split(/[\s._-]/)[0].toUpperCase();
              return (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      Código: <span className="font-mono text-blue-600">{codigo}</span>
                    </p>
                    <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="ml-2 p-1 text-red-600 hover:bg-red-100 rounded"
                  >
                    <IconTrash size={18} />
                  </button>
                </div>
              );
            })}
          </div>

          <button
            onClick={handleUpload}
            disabled={uploading}
            className="mt-4 w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <IconUpload size={20} />
            Fazer Upload de {files.length} Imagem(ns)
          </button>
        </div>
      )}

      {/* Resultados */}
      {results && (
        <div className="space-y-4">
          {/* Resumo */}
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-green-600">
                  <IconCheck size={20} />
                  <span className="font-medium">{results.success.length} sucesso</span>
                </div>
                {results.errors.length > 0 && (
                  <div className="flex items-center gap-2 text-red-600">
                    <IconX size={20} />
                    <span className="font-medium">{results.errors.length} erro(s)</span>
                  </div>
                )}
              </div>
              <button
                onClick={resetUpload}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2"
              >
                <IconRefresh size={18} />
                Novo Upload
              </button>
            </div>
          </div>

          {/* Sucessos */}
          {results.success.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-5">
              <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                <IconCheck size={20} />
                {results.success.length} imagem(ns) vinculada(s) com sucesso
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {results.success.map((item: any, index: number) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-green-800 bg-green-100 rounded-lg p-2">
                    <span className="font-mono bg-green-200 px-2 py-0.5 rounded">{item.codigo}</span>
                    <span className="text-green-600">→</span>
                    <span className="truncate">{item.produtoNome}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Erros */}
          {results.errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-5">
              <h3 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
                <IconX size={20} />
                {results.errors.length} erro(s)
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {results.errors.map((item: any, index: number) => (
                  <div key={index} className="text-sm text-red-800 bg-red-100 rounded-lg p-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono bg-red-200 px-2 py-0.5 rounded">{item.codigo || item.file}</span>
                      <span className="text-red-600">→</span>
                      <span>{item.error}</span>
                    </div>
                    {item.sugestao && (
                      <p className="text-xs text-red-600 mt-1 ml-2">{item.sugestao}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
