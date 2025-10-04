'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Distribuidor } from '@/types/distribuidor';

export default function DistribuidoresPage() {
  const [distribuidores, setDistribuidores] = useState<Distribuidor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDistribuidores();
  }, []);

  const loadDistribuidores = async () => {
    try {
      const response = await fetch('/api/admin/distribuidores');
      const result = await response.json();
      
      if (result.success) {
        setDistribuidores(result.data);
      }
    } catch (error) {
      console.error('Erro ao carregar distribuidores:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este distribuidor?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/distribuidores/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        alert('Distribuidor excluído com sucesso!');
        loadDistribuidores();
      } else {
        alert('Erro ao excluir distribuidor: ' + result.error);
      }
    } catch (error) {
      console.error('Erro ao excluir distribuidor:', error);
      alert('Erro ao excluir distribuidor');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff5c00] mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Distribuidores</h1>
          <p className="text-gray-600 mt-2">
            Gerencie os distribuidores integrados com Mercos
          </p>
        </div>
        <Link
          href="/admin/distribuidores/novo"
          className="bg-[#ff5c00] text-white px-6 py-3 rounded-lg hover:bg-[#e05400] transition-colors"
        >
          + Novo Distribuidor
        </Link>
      </div>

      {distribuidores.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="text-gray-400 mb-4">
            <svg
              className="mx-auto h-24 w-24"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Nenhum distribuidor cadastrado
          </h3>
          <p className="text-gray-600 mb-6">
            Comece adicionando seu primeiro distribuidor para sincronizar produtos.
          </p>
          <Link
            href="/admin/distribuidores/novo"
            className="inline-block bg-[#ff5c00] text-white px-6 py-3 rounded-lg hover:bg-[#e05400] transition-colors"
          >
            Cadastrar Primeiro Distribuidor
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {distribuidores.map((distribuidor) => (
            <div
              key={distribuidor.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  {distribuidor.nome}
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    distribuidor.ativo
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {distribuidor.ativo ? 'Ativo' : 'Inativo'}
                </span>
              </div>

              <div className="space-y-2 mb-6">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Produtos:</span>{' '}
                  {distribuidor.total_produtos || 0}
                </p>
                {distribuidor.ultima_sincronizacao && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Última sinc:</span>{' '}
                    {new Date(distribuidor.ultima_sincronizacao).toLocaleString('pt-BR')}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/admin/distribuidores/${distribuidor.id}`}
                  className="flex-1 text-center bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Editar
                </Link>
                <Link
                  href={`/admin/distribuidores/${distribuidor.id}/sync`}
                  className="flex-1 text-center bg-[#ff5c00] text-white px-4 py-2 rounded-lg hover:bg-[#e05400] transition-colors"
                >
                  Sincronizar
                </Link>
                <button
                  onClick={() => handleDelete(distribuidor.id)}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
