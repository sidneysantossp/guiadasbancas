"use client";

import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<null | "ok" | "error">(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      return;
    }
    // TODO: integrar com API real (Mailchimp/Sendgrid ou backend próprio)
    setStatus("ok");
    setEmail("");
    setTimeout(() => setStatus(null), 3000);
  };

  return (
    <section className="w-full">
      <div className="container-max">
        <div
          className="relative overflow-hidden rounded-2xl p-5 sm:p-7"
          style={{
            background: "linear-gradient(90deg, #fff7f2 0%, #fff1e8 100%)",
          }}
        >
          {/* bg decorativo sutil */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "blur(2px)",
            }}
          />

          <div className="relative grid grid-cols-1 md:grid-cols-2 items-center gap-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#0f172a]">Conecte-se com o seu Jornaleiro!</h3>
              <p className="mt-1 text-sm text-gray-700">Receba novidades das bancas e produtos perto de você.</p>
            </div>

            <form onSubmit={onSubmit} className="flex w-full items-stretch justify-end">
              <div className="flex w-full max-w-md items-center rounded-xl bg-white shadow-sm overflow-hidden">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Digite seu e-mail"
                  className="flex-1 px-3 py-3 text-sm outline-none"
                />
                <button
                  type="submit"
                  className="h-full shrink-0 px-4 py-3 text-white text-sm font-semibold"
                  style={{
                    background: "linear-gradient(90deg, #ff5c00 0%, #ff7a33 100%)",
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                  }}
                >
                  ➤
                </button>
              </div>
            </form>
          </div>

          {status === "ok" && (
            <div className="relative mt-3 text-sm text-emerald-700">Inscrição realizada com sucesso!</div>
          )}
          {status === "error" && (
            <div className="relative mt-3 text-sm text-red-600">Informe um e-mail válido.</div>
          )}
        </div>
      </div>
    </section>
  );
}
