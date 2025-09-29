"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/components/admin/ToastProvider";

const DEMO_EMAIL = "demo@jornaleiro.com";
const DEMO_PASSWORD = "123456";
const DEFAULT_SESSION = {
  seller: {
    id: "seller-001",
    name: "Maria Alves",
    email: DEMO_EMAIL,
    phone: "+55 11 91234-5678",
    cpf: "123.456.789-00",
  },
  banks: [
    {
      id: "b1",
      name: "Banca São Jorge",
      whatsapp: "+55 11 98765-4321",
      address: {
        street: "Rua Augusta",
        number: "1024",
        neighborhood: "Consolação",
        city: "São Paulo",
        uf: "SP",
        cep: "01305-100",
      },
    },
  ],
};

export default function JornaleiroLoginPage() {
  const router = useRouter();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const auth = localStorage.getItem("gb:sellerAuth");
      if (auth === "1") router.replace("/jornaleiro/dashboard" as any);
    } catch {}
  }, [router]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 400));

      if (email.trim().toLowerCase() !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
        throw new Error("Credenciais inválidas. Utilize o e-mail e senha demo informados.");
      }

      localStorage.setItem("gb:sellerAuth", "1");
      localStorage.setItem("gb:sellerToken", "seller-token");
      localStorage.setItem("gb:seller", JSON.stringify(DEFAULT_SESSION));
      
      // Salvar também no formato que a Navbar espera para manter login no site
      localStorage.setItem("gb:user", JSON.stringify({
        name: DEFAULT_SESSION.seller?.name || "Jornaleiro",
        email: DEFAULT_SESSION.seller?.email || "demo@jornaleiro.com"
      }));
      
      toast.success("Login realizado com sucesso");
      router.replace("/jornaleiro/dashboard" as any);
    } catch (err: any) {
      const message = err?.message || "Ocorreu um erro ao efetuar login.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container-max py-10">
      <div className="max-w-md mx-auto rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold">Login do Jornaleiro</h1>
        <p className="mt-1 text-sm text-gray-600">Acesse sua área para gerenciar sua banca no Guia das Bancas.</p>
        <div className="mt-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
          <div><strong>Credenciais demo</strong></div>
          <div>Email: {DEMO_EMAIL}</div>
          <div>Senha: {DEMO_PASSWORD}</div>
        </div>
        {error && (
          <div className="mt-3 rounded-md border border-rose-300 bg-rose-50 text-rose-700 text-sm px-3 py-2">{error}</div>
        )}
        <form onSubmit={onSubmit} className="mt-4 space-y-3">
          <div>
            <label className="text-[12px] text-gray-700">Email</label>
            <input
              type="email"
              className="input mt-1 w-full"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              required
              placeholder="nome@exemplo.com"
            />
          </div>
          <div>
            <label className="text-[12px] text-gray-700">Senha</label>
            <input
              type="password"
              className="input mt-1 w-full"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              required
              placeholder="••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-gradient-to-r from-[#ff5c00] to-[#ff7a33] px-4 py-2 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
        <div className="mt-4 text-sm text-center">
          Não tem cadastro? <Link href={"/jornaleiro/registrar" as any} className="text-[#ff5c00] hover:underline">Registre-se</Link>
        </div>
      </div>
    </section>
  );
}
