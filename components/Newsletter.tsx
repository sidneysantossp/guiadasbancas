"use client";

import { useState } from "react";

const interests = [
  { id: "figurinhas", label: "Figurinhas da Copa 2026" },
  { id: "revistas", label: "Revistas & Gibis" },
  { id: "outros", label: "Outros" },
];

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [status, setStatus] = useState<null | "ok" | "error">(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      return;
    }
    // TODO: integrar com API real (Mailchimp/Sendgrid ou backend próprio)
    setStatus("ok");
    setEmail("");
    setName("");
    setSelectedInterests([]);
    setTimeout(() => setStatus(null), 3000);
  };

  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <section className="w-full">
      <div className="container-max space-y-4">
        <form onSubmit={onSubmit} className="w-full">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#ff5c00] via-[#ff7a33] to-[#ff9955] p-[2px] shadow-2xl">
            <div className="relative rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] px-6 py-12 sm:px-10 sm:py-16">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 h-64 w-64 bg-[#ff5c00]/10 rounded-full blur-3xl -translate-y-32 translate-x-32"></div>
              <div className="absolute bottom-0 left-0 h-64 w-64 bg-[#ff9955]/10 rounded-full blur-3xl translate-y-32 -translate-x-32"></div>
              
              <div className="relative z-10 max-w-5xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center space-y-3">
                  <div className="inline-flex items-center gap-2 bg-[#ff5c00]/10 backdrop-blur-sm rounded-full px-4 py-1.5 border border-[#ff5c00]/20">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 text-[#ff5c00]" fill="currentColor">
                      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                    <span className="text-xs font-semibold text-[#ff5c00] uppercase tracking-wider">Newsletter Exclusiva</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white">
                    Novidades e Promoções
                  </h3>
                  <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
                    Cadastre-se e seja o primeiro a saber sobre lançamentos, ofertas especiais e produtos exclusivos das bancas
                  </p>
                </div>

                {/* Form */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto] max-w-3xl mx-auto">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#ff5c00] to-[#ff9955] rounded-lg opacity-0 group-focus-within:opacity-100 blur transition-opacity"></div>
                    <div className="relative bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 group-focus-within:border-[#ff5c00]/50 transition-colors">
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Seu nome completo"
                        className="w-full bg-transparent px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none"
                        required
                      />
                      <svg viewBox="0 0 24 24" className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      <div className="absolute inset-0 pl-12"></div>
                    </div>
                  </div>

                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#ff5c00] to-[#ff9955] rounded-lg opacity-0 group-focus-within:opacity-100 blur transition-opacity"></div>
                    <div className="relative bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 group-focus-within:border-[#ff5c00]/50 transition-colors">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="seu@email.com"
                        className="w-full bg-transparent px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none"
                        required
                      />
                      <svg viewBox="0 0 24 24" className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="5" width="18" height="14" rx="2" />
                        <path d="M3 7l9 6 9-6" />
                      </svg>
                      <div className="absolute inset-0 pl-12"></div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="sm:col-span-2 lg:col-span-1 relative group overflow-hidden rounded-lg bg-gradient-to-r from-[#ff5c00] to-[#ff7a33] px-8 py-3 font-bold text-white shadow-lg shadow-[#ff5c00]/25 transition-all hover:shadow-xl hover:shadow-[#ff5c00]/40 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Cadastrar Agora
                      <svg viewBox="0 0 24 24" className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  </button>
                </div>

                {/* Interests */}
                <div className="flex flex-wrap items-center justify-center gap-4">
                  {interests.map((interest) => (
                    <label 
                      key={interest.id} 
                      className="group inline-flex items-center gap-2 cursor-pointer bg-white/5 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10 hover:border-[#ff5c00]/50 transition-all"
                    >
                      <div className="relative">
                        <input
                          type="checkbox"
                          className="peer sr-only"
                          checked={selectedInterests.includes(interest.id)}
                          onChange={() => toggleInterest(interest.id)}
                        />
                        <div className="h-5 w-5 rounded border-2 border-gray-600 peer-checked:border-[#ff5c00] peer-checked:bg-[#ff5c00] transition-all flex items-center justify-center">
                          <svg viewBox="0 0 24 24" className="h-3 w-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" stroke="currentColor" strokeWidth="3">
                            <path d="M5 12l5 5L20 7"/>
                          </svg>
                        </div>
                      </div>
                      <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                        {interest.label}
                      </span>
                    </label>
                  ))}
                </div>

                {/* Privacy */}
                <p className="text-center text-xs text-gray-500 max-w-2xl mx-auto">
                  Ao se cadastrar, você concorda em receber comunicações conforme nossa{' '}
                  <a href="/privacidade" className="text-[#ff5c00] hover:text-[#ff7a33] underline transition-colors">
                    Política de Privacidade
                  </a>
                  . Você pode cancelar a inscrição a qualquer momento.
                </p>
              </div>
            </div>
          </div>
        </form>

        {/* Status Messages */}
        {status === "ok" && (
          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 backdrop-blur-sm px-6 py-4 text-center">
            <div className="flex items-center justify-center gap-2 text-emerald-400 font-semibold">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              Inscrição realizada com sucesso! Verifique seu e-mail.
            </div>
          </div>
        )}
        {status === "error" && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 backdrop-blur-sm px-6 py-4 text-center">
            <div className="flex items-center justify-center gap-2 text-red-400 font-semibold">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
              Por favor, informe um nome e e-mail válidos.
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
