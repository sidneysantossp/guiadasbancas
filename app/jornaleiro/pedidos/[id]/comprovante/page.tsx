"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import OrderReceipt from "@/components/admin/OrderReceipt";

type OrderItem = {
  id: string;
  product_id: string;
  product_name: string;
  product_image?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
};

type Order = {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  customer_address?: string;
  banca_id: string;
  banca_name: string;
  items: OrderItem[];
  subtotal: number;
  shipping_fee: number;
  total: number;
  status: string;
  payment_method: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  estimated_delivery?: string;
};

export default function ComprovanteOrderPage() {
  const params = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [params.id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/orders/${params.id}`);
      const json = await res.json();
      
      if (!json.ok) {
        console.error("Erro ao carregar pedido:", json.error);
        return;
      }
      
      setOrder(json.data);
    } catch (e: any) {
      console.error("Erro ao carregar pedido:", e?.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-gray-900">Pedido não encontrado</h1>
          <p className="text-gray-600 mt-2">O pedido solicitado não foi encontrado.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-3 py-4 sm:px-4 sm:py-8">
      <div className="mx-auto max-w-2xl">
        {/* Header com botão voltar */}
        <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:gap-4">
          <Link
            href={`/jornaleiro/pedidos/${params.id}`}
            className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 transition-colors hover:bg-gray-50 sm:w-auto"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar
          </Link>
          
          <Link
            href="/jornaleiro/pedidos"
            className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 sm:w-auto"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Todos os Pedidos
          </Link>
          
          <div className="min-w-0 flex-1 text-left sm:text-center">
            <h1 className="break-words text-lg font-semibold text-gray-900 sm:text-xl">Comprovante do Pedido #{params.id}</h1>
          </div>
        </div>

        <OrderReceipt 
          order={order}
          bancaInfo={{
            name: order.banca_name,
            address: order.customer_address || "Rua Augusta, 1024 - Consolação\nCentro - 01305-100 - São Paulo/SP",
            phone: "(11) 98765-4321",
            cnpj: "11.111.111/0001-11"
          }}
        />
      </div>
    </div>
  );
}
