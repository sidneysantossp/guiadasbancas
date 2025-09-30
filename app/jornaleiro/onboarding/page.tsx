// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import type { Route } from "next";
import { useAuth } from "@/lib/auth/AuthContext";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function JornaleiroOnboardingPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "creating" | "success" | "error">("loading");
  const [message, setMessage] = useState("Configurando sua conta...");

  useEffect(() => {
    if (!loading && user && profile?.role === "jornaleiro") {
      createBanca();
    } else if (!loading && !user) {
      router.push(("/login" as Route));
    }
  }, [user, profile, loading]);

  const createBanca = async () => {
    try {
      setStatus("creating");
      setMessage("Criando sua banca...");

      // Recuperar dados salvos no localStorage
      const bancaDataStr = localStorage.getItem("gb:bancaData");
      if (!bancaDataStr) {
        setStatus("error");
        setMessage("Dados da banca não encontrados. Por favor, faça o cadastro novamente.");
        return;
      }

      const bancaData = JSON.parse(bancaDataStr);

      // Criar banca no Supabase
      const { data, error } = await supabase
        .from("bancas")
        .insert({
          user_id: user!.id,
          ...bancaData,
          active: false, // Aguardando aprovação
          approved: false,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Atualizar perfil com banca_id
      await supabase
        .from("user_profiles")
        .update({ banca_id: data.id })
        .eq("id", user!.id);

      // Limpar localStorage
      localStorage.removeItem("gb:bancaData");

      setStatus("success");
      setMessage("Banca criada com sucesso! Redirecionando...");

      // Redirecionar para dashboard
      setTimeout(() => {
        router.push(("/jornaleiro/dashboard" as Route));
      }, 2000);

    } catch (error) {
      console.error("Erro ao criar banca:", error);
      setStatus("error");
      setMessage("Erro ao criar banca. Tente novamente mais tarde.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Ícone de Status */}
        <div className="mb-6">
          {status === "loading" || status === "creating" ? (
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-600 mx-auto"></div>
          ) : status === "success" ? (
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="h-8 w-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          ) : (
            <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="h-8 w-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Mensagem */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {status === "success" ? "Tudo pronto!" : status === "error" ? "Ops!" : "Aguarde..."}
        </h2>
        <p className="text-gray-600">{message}</p>

        {/* Botão de Retry */}
        {status === "error" && (
          <div className="mt-6 space-y-3">
            <button
              onClick={createBanca}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all"
            >
              Tentar Novamente
            </button>
            <button
              onClick={() => router.push(("/jornaleiro/registrar" as Route))}
              className="w-full border border-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-lg hover:bg-gray-50 transition-all"
            >
              Voltar ao Cadastro
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
