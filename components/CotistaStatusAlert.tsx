"use client";

import Link from "next/link";

type Props = {
  isCotista: boolean;
  stats?: {
    proprios: number;
    distribuidores: number;
  };
};

export default function CotistaStatusAlert({ isCotista, stats }: Props) {
  if (isCotista) {
    return (
      <div className="rounded-lg bg-green-50 border border-green-200 p-4">
        <div className="flex items-start gap-3">
          <span className="text-green-600 text-2xl shrink-0">✓</span>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-green-900">
              Sua banca está vinculada a uma rede parceira
            </h3>
            <p className="text-sm text-green-800 mt-1">
              O vínculo comercial da banca está identificado. O acesso ao catálogo de distribuidores continua sendo definido pelo plano ativo da operação.
            </p>
            {stats && (
              <div className="mt-3 flex gap-4 text-xs">
                <div className="bg-white rounded px-3 py-2 border border-green-300">
                  <span className="text-green-700">Seus produtos:</span>
                  <span className="ml-2 font-semibold text-green-900">{stats.proprios}</span>
                </div>
                <div className="bg-white rounded px-3 py-2 border border-green-300">
                  <span className="text-green-700">Produtos de distribuidores:</span>
                  <span className="ml-2 font-semibold text-green-900">{stats.distribuidores}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-4">
      <div className="flex items-start gap-3">
        <span className="text-yellow-600 text-2xl shrink-0">⚠️</span>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-yellow-900">
            Sua banca ainda não tem vínculo comercial informado
          </h3>
          <p className="text-sm text-yellow-800 mt-1">
            Você pode seguir operando com produtos próprios normalmente. Se a banca faz parte de uma rede parceira, revise o cadastro comercial para manter os dados corretos.
          </p>
          {stats && (
            <div className="mt-3 flex gap-4 text-xs">
              <div className="bg-white rounded px-3 py-2 border border-yellow-300">
                <span className="text-yellow-700">Seus produtos:</span>
                <span className="ml-2 font-semibold text-yellow-900">{stats.proprios}</span>
              </div>
              <div className="bg-white rounded px-3 py-2 border border-yellow-300">
                <span className="text-yellow-700">Produtos de distribuidores:</span>
                <span className="ml-2 font-semibold text-yellow-900">0</span>
              </div>
            </div>
          )}
          <div className="mt-3">
            <Link
              href="/jornaleiro/banca-v2?tab=banca"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#ff5c00] hover:underline"
            >
              → Revisar vínculo comercial da banca
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
