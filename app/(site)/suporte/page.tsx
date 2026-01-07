"use client";

import { useState } from "react";
import { Metadata } from "next";

const FORMSUBMIT_URL = "https://formsubmit.co/contato@guiadasbancas.com.br";

export default function SuportePage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      await fetch(FORMSUBMIT_URL, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });
      setSubmitted(true);
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
      alert("Erro ao enviar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <main className="container-max py-12 md:py-20">
        <div className="max-w-xl mx-auto text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Mensagem Enviada!</h1>
          <p className="text-gray-600 mb-6">
            Recebemos sua mensagem e responderemos em breve no e-mail informado.
          </p>
          <a
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-[#ff5c00] text-white font-medium rounded-lg hover:bg-[#ff7a33] transition"
          >
            Voltar para a Home
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="container-max py-8 md:py-12">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Suporte</h1>
          <p className="text-gray-600">
            Tem alguma dúvida, sugestão ou precisa de ajuda? Preencha o formulário abaixo e entraremos em contato.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Campos ocultos do FormSubmit */}
            <input type="hidden" name="_subject" value="Nova mensagem de suporte - Guia das Bancas" />
            <input type="hidden" name="_captcha" value="false" />
            <input type="hidden" name="_template" value="table" />
            <input type="text" name="_honey" style={{ display: "none" }} />

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome completo *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff5c00]/20 focus:border-[#ff5c00] transition"
                  placeholder="Seu nome"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  E-mail *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff5c00]/20 focus:border-[#ff5c00] transition"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Telefone / WhatsApp
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff5c00]/20 focus:border-[#ff5c00] transition"
                placeholder="(11) 99999-9999"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                Assunto *
              </label>
              <select
                id="subject"
                name="subject"
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff5c00]/20 focus:border-[#ff5c00] transition bg-white"
              >
                <option value="">Selecione um assunto</option>
                <option value="Dúvida sobre pedido">Dúvida sobre pedido</option>
                <option value="Problema com o site">Problema com o site</option>
                <option value="Quero ser jornaleiro parceiro">Quero ser jornaleiro parceiro</option>
                <option value="Sugestão ou feedback">Sugestão ou feedback</option>
                <option value="Reclamação">Reclamação</option>
                <option value="LGPD - Meus dados">LGPD - Meus dados</option>
                <option value="Outro assunto">Outro assunto</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Mensagem *
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff5c00]/20 focus:border-[#ff5c00] transition resize-none"
                placeholder="Descreva como podemos ajudar..."
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-6 bg-[#ff5c00] text-white font-semibold rounded-lg hover:bg-[#ff7a33] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Enviando...
                  </>
                ) : (
                  "Enviar mensagem"
                )}
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center">
              Ao enviar, você concorda com nossa{" "}
              <a href="/privacidade" className="text-[#ff5c00] underline">
                Política de Privacidade
              </a>
              .
            </p>
          </form>
        </div>

        {/* Info cards */}
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <div className="w-10 h-10 bg-[#fff4ec] rounded-full flex items-center justify-center mx-auto mb-2">
              <svg className="w-5 h-5 text-[#ff5c00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-800">E-mail</p>
            <p className="text-xs text-gray-600">contato@guiadasbancas.com.br</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <div className="w-10 h-10 bg-[#fff4ec] rounded-full flex items-center justify-center mx-auto mb-2">
              <svg className="w-5 h-5 text-[#ff5c00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-800">Horário</p>
            <p className="text-xs text-gray-600">Seg a Sex, 9h às 18h</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <div className="w-10 h-10 bg-[#fff4ec] rounded-full flex items-center justify-center mx-auto mb-2">
              <svg className="w-5 h-5 text-[#ff5c00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-800">FAQ</p>
            <p className="text-xs text-gray-600">Dúvidas frequentes</p>
          </div>
        </div>
      </div>
    </main>
  );
}
