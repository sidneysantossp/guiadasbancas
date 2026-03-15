"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { useParams } from "next/navigation";
import { fetchAdminWithDevFallback } from "@/lib/admin-client-fetch";

type ProductDetail = {
  id: string;
  name: string;
  description: string | null;
  description_full: string | null;
  specifications: string | null;
  price: number | null;
  price_original: number | null;
  stock_qty: number | null;
  active: boolean | null;
  featured: boolean | null;
  category_id: string | null;
  category_name: string | null;
  images: string[] | null;
  codigo_mercos: string | null;
  distribuidor_id: string | null;
  banca_id: string | null;
  created_at: string | null;
  updated_at: string | null;
  banca: {
    id: string;
    user_id: string | null;
    name: string | null;
    address: string | null;
    whatsapp: string | null;
    active: boolean | null;
    approved: boolean | null;
  } | null;
  distribuidor: {
    id: string;
    nome: string | null;
    ativo: boolean | null;
    ultima_sincronizacao: string | null;
  } | null;
};

function formatCurrency(value?: number | null) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value || 0));
}

function formatDate(value?: string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

function SummaryCard({
  title,
  value,
  helper,
}: {
  title: string;
  value: string | number;
  helper: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">{title}</div>
      <div className="mt-2 text-2xl font-semibold text-gray-900">{value}</div>
      <div className="mt-1 text-sm text-gray-500">{helper}</div>
    </div>
  );
}

export default function AdminProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ProductDetail | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const response = await fetchAdminWithDevFallback(`/api/admin/products/${productId}`);
        const json = await response.json();
        if (json.success) {
          setData(json.data);
        } else {
          setData(null);
        }
      } catch (error) {
        console.error("Erro ao carregar produto:", error);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    if (productId) load();
  }, [productId]);

  if (loading) {
    return <div className="py-16 text-center text-sm text-gray-500">Carregando produto...</div>;
  }

  if (!data) {
    return <div className="py-16 text-center text-sm text-gray-500">Produto não encontrado.</div>;
  }

  const source = data.distribuidor ? "Distribuidor" : "Catálogo próprio";
  const sourceLabel = data.distribuidor?.nome || data.banca?.name || "Guia das Bancas";
  const images = Array.isArray(data.images) ? data.images : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <Link href="/admin/products" className="text-sm font-medium text-[#ff5c00] hover:underline">
            Voltar para produtos
          </Link>
          <h1 className="mt-3 text-2xl font-semibold text-gray-900">{data.name}</h1>
          <p className="mt-3 text-sm leading-6 text-gray-600">
            Visão operacional do item no catálogo, ligando origem, exposição, precificação e conteúdo usado no marketplace.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {data.banca?.id ? (
            <Link
              href={`/admin/bancas/${data.banca.id}` as Route}
              className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:border-[#ff5c00] hover:text-[#ff5c00]"
            >
              Ver banca
            </Link>
          ) : null}
          {data.distribuidor?.id ? (
            <Link
              href={`/admin/distribuidores/${data.distribuidor.id}` as Route}
              className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:border-[#ff5c00] hover:text-[#ff5c00]"
            >
              Ver distribuidor
            </Link>
          ) : null}
          <Link
            href={`/admin/products/${data.id}/edit` as Route}
            className="rounded-xl bg-[#ff5c00] px-4 py-2 text-sm font-medium text-white hover:bg-[#e65300]"
          >
            Editar produto
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <SummaryCard title="Preço" value={formatCurrency(data.price)} helper={data.price_original ? `Original ${formatCurrency(data.price_original)}` : "Sem preço de referência"} />
        <SummaryCard title="Estoque" value={Number(data.stock_qty || 0)} helper={data.active === false ? "Item inativo" : "Item ativo"} />
        <SummaryCard title="Origem" value={source} helper={sourceLabel} />
        <SummaryCard title="Categoria" value={data.category_name || "Sem categoria"} helper={data.codigo_mercos || "Sem código Mercos"} />
        <SummaryCard title="Criado" value={formatDate(data.created_at)} helper={`Atualizado em ${formatDate(data.updated_at)}`} />
        <SummaryCard title="Destaque" value={data.featured ? "Sim" : "Não"} helper="Sinalização de exposição editorial" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Resumo do produto</h2>
          <div className="mt-4 space-y-3 text-sm text-gray-700">
            <div><span className="font-medium text-gray-900">Descrição curta:</span> {data.description || "Sem descrição curta"}</div>
            <div><span className="font-medium text-gray-900">Descrição completa:</span> {data.description_full || "Sem descrição completa"}</div>
            <div><span className="font-medium text-gray-900">Especificações:</span> {data.specifications || "Sem especificações"}</div>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Origem e vínculo operacional</h2>
          <div className="mt-4 space-y-3 text-sm text-gray-700">
            <div><span className="font-medium text-gray-900">Fonte:</span> {source}</div>
            <div><span className="font-medium text-gray-900">Responsável:</span> {sourceLabel}</div>
            {data.banca ? (
              <>
                <div><span className="font-medium text-gray-900">Endereço da banca:</span> {data.banca.address || "—"}</div>
                <div><span className="font-medium text-gray-900">WhatsApp:</span> {data.banca.whatsapp || "—"}</div>
              </>
            ) : null}
            {data.distribuidor ? (
              <div><span className="font-medium text-gray-900">Última sincronização:</span> {formatDate(data.distribuidor.ultima_sincronizacao)}</div>
            ) : null}
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-gray-900">Imagens</h2>
          <span className="text-sm text-gray-500">{images.length} arquivo(s)</span>
        </div>

        {images.length > 0 ? (
          <div className="mt-4 grid gap-4 md:grid-cols-3 xl:grid-cols-4">
            {images.map((image, index) => (
              <div key={`${image}-${index}`} className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image} alt={`${data.name} ${index + 1}`} className="h-56 w-full object-cover" />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-xl border border-dashed border-gray-300 px-4 py-6 text-sm text-gray-500">
            Este produto ainda não possui imagens cadastradas.
          </div>
        )}
      </section>
    </div>
  );
}
