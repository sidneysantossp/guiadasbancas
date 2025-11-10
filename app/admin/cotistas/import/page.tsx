"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ImportCotistasPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState<string>("");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const validTypes = [
        'text/csv',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];
      
      if (validTypes.includes(selectedFile.type) || selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
        setError(null);
      } else {
        setError('Por favor, selecione um arquivo CSV ou Excel (.csv, .xls, .xlsx)');
        setFile(null);
      }
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setImporting(true);
    setProgress("Enviando arquivo...");
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Usar rota CSV por enquanto
      const endpoint = file.name.endsWith('.csv') 
        ? '/api/admin/cotistas/import-csv'
        : '/api/admin/cotistas/import';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer admin-token'
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao importar arquivo');
      }

      setProgress("Importação concluída!");
      setResult(data);
      
      // Limpar formulário
      setFile(null);
      const fileInput = document.getElementById('file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (err: any) {
      console.error('Import error:', err);
      setError(err.message || 'Erro ao importar cotistas');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Importar Cotistas</h1>
          <p className="text-sm text-gray-600 mt-1">
            Faça upload de um arquivo CSV ou Excel com os dados dos cotistas
          </p>
        </div>
        <Link
          href="/admin/cotistas"
          className="rounded-md bg-gray-600 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700"
        >
          ← Voltar
        </Link>
      </div>

      {/* Important Note */}
      <div className="rounded-lg bg-amber-50 border border-amber-300 p-4 mb-4">
        <h3 className="text-sm font-semibold text-amber-900 mb-2">⚠️ Importante</h3>
        <p className="text-sm text-amber-800">
          Por favor, <strong>exporte sua planilha Excel como CSV</strong> antes de importar.
          No Excel/Google Sheets: Arquivo → Salvar Como → CSV (separado por vírgulas).
        </p>
      </div>

      {/* Instructions */}
      <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">📋 Formato do arquivo</h3>
        <p className="text-sm text-blue-800 mb-2">O arquivo deve conter as seguintes colunas:</p>
        <ul className="text-sm text-blue-800 space-y-1 ml-4">
          <li>• <strong>Razão social</strong> (obrigatório)</li>
          <li>• <strong>CNPJ/CPF</strong> (obrigatório, formato: 000.000.000-00 ou 00.000.000/0000-00)</li>
          <li>• <strong>Telefones</strong> (opcional)</li>
          <li>• <strong>Endereço principal</strong> (opcional)</li>
          <li>• <strong>Cidade</strong> (opcional)</li>
          <li>• <strong>Estado</strong> (opcional)</li>
        </ul>
        <p className="text-xs text-blue-700 mt-3">
          💡 O sistema irá extrair automaticamente o código do cotista da razão social (ex: "0001 - NOME" → código "0001")
        </p>
      </div>

      {/* Upload Form */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selecione o arquivo
            </label>
            <input
              id="file-input"
              type="file"
              accept=".csv,.xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              onChange={handleFileChange}
              disabled={importing}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none disabled:opacity-50"
            />
            {file && (
              <p className="mt-2 text-sm text-gray-600">
                ✓ Arquivo selecionado: <strong>{file.name}</strong> ({(file.size / 1024).toFixed(2)} KB)
              </p>
            )}
          </div>

          <button
            onClick={handleImport}
            disabled={!file || importing}
            className="w-full rounded-md bg-[#ff5c00] px-4 py-3 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {importing ? '⏳ Importando...' : '📤 Importar Cotistas'}
          </button>
        </div>
      </div>

      {/* Progress */}
      {progress && (
        <div className="rounded-lg bg-gray-50 border border-gray-200 p-4">
          <p className="text-sm text-gray-700">{progress}</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4">
          <div className="flex items-start gap-3">
            <span className="text-red-600 text-lg">❌</span>
            <div>
              <h3 className="text-sm font-semibold text-red-900">Erro na importação</h3>
              <p className="text-sm text-red-800 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="rounded-lg bg-green-50 border border-green-200 p-4">
          <div className="flex items-start gap-3">
            <span className="text-green-600 text-lg">✅</span>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-green-900 mb-2">Importação concluída com sucesso!</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-green-700">Total processado:</span>
                  <span className="ml-2 font-semibold text-green-900">{result.total || 0}</span>
                </div>
                <div>
                  <span className="text-green-700">Importados:</span>
                  <span className="ml-2 font-semibold text-green-900">{result.imported || 0}</span>
                </div>
                <div>
                  <span className="text-green-700">Atualizados:</span>
                  <span className="ml-2 font-semibold text-green-900">{result.updated || 0}</span>
                </div>
                <div>
                  <span className="text-green-700">Erros:</span>
                  <span className="ml-2 font-semibold text-red-600">{result.errors || 0}</span>
                </div>
              </div>

              {result.errorDetails && result.errorDetails.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-semibold text-red-900 mb-2">Detalhes dos erros:</p>
                  <div className="bg-white rounded border border-red-200 p-3 max-h-48 overflow-y-auto">
                    <ul className="text-xs text-red-800 space-y-1">
                      {result.errorDetails.map((err: string, idx: number) => (
                        <li key={idx}>• {err}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
