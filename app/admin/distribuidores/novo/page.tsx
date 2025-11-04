'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NovoDistribuidorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    application_token: '',
    company_token: '',
    base_url: 'https://app.mercos.com/api/v1',
    ativo: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/admin/distribuidores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        alert('Distribuidor cadastrado com sucesso!');
        router.push('/admin/distribuidores');
      } else {
        alert('Erro ao cadastrar distribuidor: ' + result.error);
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao cadastrar distribuidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <Link
          href="/admin/distribuidores"
          className="text-[#ff5c00] hover:underline flex items-center gap-2 mb-4"
        >
          ← Voltar
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Novo Distribuidor</h1>
        <p className="text-gray-600 mt-2">
          Cadastre um novo distribuidor integrado com Mercos
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8">
        <div className="space-y-6">
          <div>
            <label
              htmlFor="nome"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Nome do Distribuidor *
            </label>
            <input
              type="text"
              id="nome"
              required
              value={formData.nome}
              onChange={(e) =>
                setFormData({ ...formData, nome: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff5c00] focus:border-transparent"
              placeholder="Ex: Distribuidor XYZ"
            />
          </div>

          <div>
            <label
              htmlFor="application_token"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Application Token *
            </label>
            <input
              type="text"
              id="application_token"
              required
              value={formData.application_token}
              onChange={(e) =>
                setFormData({ ...formData, application_token: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff5c00] focus:border-transparent font-mono text-sm"
              placeholder="Token fornecido pela Mercos"
            />
            <p className="text-sm text-gray-500 mt-1">
              Token da aplicação fornecido pela Mercos após homologação
            </p>
          </div>

          <div>
            <label
              htmlFor="company_token"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Company Token *
            </label>
            <input
              type="text"
              id="company_token"
              required
              value={formData.company_token}
              onChange={(e) =>
                setFormData({ ...formData, company_token: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff5c00] focus:border-transparent font-mono text-sm"
              placeholder="Token da empresa no Mercos"
            />
            <p className="text-sm text-gray-500 mt-1">
              Encontrado em: Minha Conta → Sistema → Integração
            </p>
          </div>

          <div>
            <label
              htmlFor="base_url"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Ambiente da API *
            </label>
            <select
              id="base_url"
              value={formData.base_url}
              onChange={(e) =>
                setFormData({ ...formData, base_url: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff5c00] focus:border-transparent"
            >
              <option value="https://app.mercos.com/api/v1">
                Produção (Dados reais)
              </option>
              <option value="https://sandbox.mercos.com/api/v1">
                Sandbox (Homologação)
              </option>
            </select>
            <p className="text-sm text-gray-500 mt-1">
              Após homologação, utilize o ambiente de Produção com os tokens finais
            </p>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="ativo"
              checked={formData.ativo}
              onChange={(e) =>
                setFormData({ ...formData, ativo: e.target.checked })
              }
              className="h-4 w-4 text-[#ff5c00] focus:ring-[#ff5c00] border-gray-300 rounded"
            />
            <label htmlFor="ativo" className="ml-2 block text-sm text-gray-900">
              Distribuidor ativo (sincronização automática)
            </label>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>Importante:</strong> Após cadastrar, use o botão
                  "Sincronizar" para importar os produtos pela primeira vez.
                  A sincronização automática ocorrerá a cada 15 minutos.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#ff5c00] text-white px-6 py-3 rounded-lg hover:bg-[#e05400] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Cadastrando...' : 'Cadastrar Distribuidor'}
            </button>
            <Link
              href="/admin/distribuidores"
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-center"
            >
              Cancelar
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
