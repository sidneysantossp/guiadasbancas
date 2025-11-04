'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Distribuidor } from '@/types/distribuidor';

export default function EditarDistribuidorPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [distribuidor, setDistribuidor] = useState<Distribuidor | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    application_token: '',
    company_token: '',
    base_url: 'https://app.mercos.com/api/v1',
    ativo: true,
  });

  useEffect(() => {
    loadDistribuidor();
  }, []);

  const loadDistribuidor = async () => {
    try {
      const response = await fetch(`/api/admin/distribuidores/${params.id}`);
      const result = await response.json();

      if (result.success) {
        setDistribuidor(result.data);
        setFormData({
          nome: result.data.nome,
          application_token: result.data.application_token,
          company_token: result.data.company_token,
          base_url: result.data.base_url || 'https://app.mercos.com/api/v1',
          ativo: result.data.ativo,
        });
      }
    } catch (error) {
      console.error('Erro ao carregar distribuidor:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`/api/admin/distribuidores/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        alert('Distribuidor atualizado com sucesso!');
        router.push('/admin/distribuidores');
      } else {
        alert('Erro ao atualizar: ' + result.error);
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao atualizar distribuidor');
    } finally {
      setSaving(false);
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

  if (!distribuidor) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-red-600">Distribuidor não encontrado</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <Link
          href="/admin/distribuidores"
          className="text-[#ff5c00] hover:underline flex items-center gap-2 mb-4"
        >
          ← Voltar
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Editar Distribuidor</h1>
        <p className="text-gray-600 mt-2">{distribuidor.nome}</p>
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
              placeholder="d39001ac-0b14-11f0-8ed7-6e1485be00f2"
            />
            <p className="text-sm text-gray-500 mt-1">
              Sandbox: d39001ac-0b14-11f0-8ed7-6e1485be00f2
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
              placeholder="4b866744-a086-11f0-ada6-5e65486a6283"
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

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-blue-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  <strong>Tokens do Sandbox:</strong><br />
                  ApplicationToken: d39001ac-0b14-11f0-8ed7-6e1485be00f2<br />
                  CompanyToken: 4b866744-a086-11f0-ada6-5e65486a6283
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-[#ff5c00] text-white px-6 py-3 rounded-lg hover:bg-[#e05400] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {saving ? 'Salvando...' : 'Salvar Alterações'}
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

      <div className="mt-6 flex gap-4">
        <Link
          href={`/admin/distribuidores/${params.id}/sync`}
          className="flex-1 text-center bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
        >
          Sincronizar Produtos
        </Link>
      </div>
    </div>
  );
}
