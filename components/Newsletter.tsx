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
          <div className="w-full overflow-hidden border border-[#ff5c00]/20 bg-[#6037b3] shadow-[0_24px_80px_-32px_rgba(31,26,73,0.55)]">
            <div className="flex flex-col gap-8 px-6 py-10 text-center text-white lg:flex-row lg:items-center lg:justify-center lg:gap-12 lg:px-10">
              <div className="max-w-xs space-y-3 text-sm leading-relaxed lg:text-left">
                <h3 className="text-base font-semibold uppercase tracking-[0.12em] text-white/80">Novidades exclusivas</h3>
                <p className="text-lg font-semibold text-white">Cadastre-se para receber novidades e promoções exclusivas</p>
              </div>

              <div className="grid gap-4 lg:grid-cols-[1fr_1fr_auto] lg:max-w-3xl w-full mx-auto">
                <label className="relative flex items-center gap-2 bg-white px-5 py-3 text-sm text-[#6037b3] shadow-inner">
                  <span className="flex items-center">
                    <svg viewBox="0 0 24 24" className="mr-2 h-5 w-5 text-[#6037b3]" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 00-3-3.87" />
                      <path d="M4 21v-2a4 4 0 013-3.87" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <span className="whitespace-nowrap text-[13px] uppercase tracking-[0.18em] text-[#6037b3]/70">Nome</span>
                  </span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome"
                    className="w-full bg-transparent text-sm font-medium text-[#1f1a49] placeholder:text-[#6037b3]/40 focus:outline-none"
                    required
                  />
                </label>

                <label className="relative flex items-center gap-2 bg-white px-5 py-3 text-sm text-[#6037b3] shadow-inner">
                  <span className="flex items-center">
                    <svg viewBox="0 0 24 24" className="mr-2 h-5 w-5 text-[#6037b3]" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16v16H4z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    <span className="whitespace-nowrap text-[13px] uppercase tracking-[0.18em] text-[#6037b3]/70">E-mail</span>
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Seu e-mail"
                    className="w-full bg-transparent text-sm font-medium text-[#1f1a49] placeholder:text-[#6037b3]/40 focus:outline-none"
                    required
                  />
                </label>

                <button
                  type="submit"
                  className="h-full border border-[#ffb980] bg-white/10 px-6 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-white/20"
                >
                  Cadastrar
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-white/80 lg:justify-start">
                {interests.map((interest) => (
                  <label key={interest.id} className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="h-4 w-4 border border-white/60 bg-transparent"
                      checked={selectedInterests.includes(interest.id)}
                      onChange={() => toggleInterest(interest.id)}
                    />
                    {interest.label}
                  </label>
                ))}
              </div>

              <p className="text-[11px] text-white/70">
                Ao se cadastrar, você concorda em receber comunicações conforme nossa
                <a href="/privacidade" className="ml-1 underline text-white">Política de Privacidade</a>.
              </p>
            </div>
          </div>
        </form>

        {status === "ok" && (
          <div className="border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            Inscrição realizada com sucesso!
          </div>
        )}
        {status === "error" && (
          <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            Informe nome e um e-mail válido.
          </div>
        )}
      </div>
    </section>
  );
}
