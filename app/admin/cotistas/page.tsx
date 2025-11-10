"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Cotista = {
  id: string;
  codigo: string;
  razao_social: string;
  cnpj_cpf: string;
  telefone?: string;
  cidade?: string;
  estado?: string;
  ativo: boolean;
};

export default function CotistasPage() {
  const [cotistas, setCotistas] = useState<Cotista[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState<{ active: number; inactive: number }>({ active: 0, inactive: 0 });

  const fetchCotistas = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      params.append('page', String(currentPage));
      params.append('limit', String(itemsPerPage));
      
      const res = await fetch(`/api/admin/cotistas?${params}`, {
        headers: { 'Authorization': 'Bearer admin-token' }
      });
      
      const json = await res.json();
      if (json.success) {
        setCotistas(json.data || []);
        setTotal(json.total || 0);
        if (json.stats && typeof json.stats.active === 'number' && typeof json.stats.inactive === 'number') {
          setStats({ active: json.stats.active, inactive: json.stats.inactive });
        } else {
          const activeFromPage = (json.data || []).filter((c: Cotista) => c.ativo).length;
          setStats({ active: activeFromPage, inactive: (json.data || []).length - activeFromPage });
        }
      }
    } catch (error) {
      console.error('Error fetching cotistas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCotistas();
  }, [currentPage, itemsPerPage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchCotistas();
  };

  const formatCnpjCpf = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (cleaned.length === 14) {
      return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
    return value;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cotistas</h1>
          <p className="text-sm text-gray-600 mt-1">
            Gerencie os cotistas cadastrados na plataforma
          </p>
        </div>
        <Link
          href="/admin/cotistas/import"
          className="rounded-md bg-[#ff5c00] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
        >
          📤 Importar CSV/Excel
        </Link>
      </div>

      {/* Search */}
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por razão social, CNPJ/CPF ou código..."
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-orange-500"
          />
          <select
            value={itemsPerPage}
            onChange={(e) => { setItemsPerPage(parseInt(e.target.value)); setCurrentPage(1); }}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-orange-500 focus:ring-orange-500"
          >
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={200}>200</option>
          </select>
          <button
            type="submit"
            className="rounded-md bg-gray-600 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700"
          >
            🔍 Buscar
          </button>
          {search && (
            <button
              type="button"
              onClick={() => { setSearch(''); setCurrentPage(1); fetchCotistas(); }}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Limpar
            </button>
          )}
        </form>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-600">Total de Cotistas</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{total}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-600">Ativos</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{stats.active}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-600">Inativos</p>
          <p className="text-2xl font-bold text-red-600 mt-1">{stats.inactive}</p>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Carregando cotistas...</div>
      ) : cotistas.length === 0 ? (
        <div className="text-center py-12 rounded-lg border border-gray-200 bg-white">
          <p className="text-gray-500">
            {search ? 'Nenhum cotista encontrado' : 'Nenhum cotista cadastrado'}
          </p>
          {!search && (
            <Link
              href="/admin/cotistas/import"
              className="inline-block mt-4 text-sm text-[#ff5c00] hover:underline"
            >
              → Importar cotistas agora
            </Link>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto border border-gray-200 rounded-lg bg-white">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Código</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Razão Social</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">CNPJ/CPF</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Telefone</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Localização</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {cotistas.map((cotista) => (
                <tr key={cotista.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {cotista.codigo}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {cotista.razao_social}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 font-mono">
                    {formatCnpjCpf(cotista.cnpj_cpf)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {cotista.telefone || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {cotista.cidade && cotista.estado
                      ? `${cotista.cidade}/${cotista.estado}`
                      : cotista.cidade || cotista.estado || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {cotista.ativo ? (
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        Ativo
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                        Inativo
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {total > 0 && (
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 px-4 py-3">
              <div className="text-sm text-gray-600">
                {(() => {
                  const from = total === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
                  const to = Math.min(currentPage * itemsPerPage, total);
                  return `Mostrando ${from} a ${to} de ${total} cotistas`;
                })()}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`rounded-md border px-3 py-1.5 text-sm ${currentPage === 1 ? 'text-gray-400 border-gray-200 cursor-not-allowed' : 'text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                >
                  Anterior
                </button>
                <div className="text-sm text-gray-600 px-2">
                  {`Página ${currentPage} de ${Math.max(1, Math.ceil(total / itemsPerPage))}`}
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentPage(p => Math.min(Math.max(1, Math.ceil(total / itemsPerPage)), p + 1))}
                  disabled={currentPage >= Math.ceil(total / itemsPerPage) || total === 0}
                  className={`rounded-md border px-3 py-1.5 text-sm ${currentPage >= Math.ceil(total / itemsPerPage) || total === 0 ? 'text-gray-400 border-gray-200 cursor-not-allowed' : 'text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                >
                  Próxima
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
