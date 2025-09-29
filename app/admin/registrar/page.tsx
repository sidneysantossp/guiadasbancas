"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { fetchViaCEP, ViaCEP } from "@/lib/viacep";
import { maskCEP, maskCPF, maskPhoneBR } from "@/lib/masks";

export default function AdminRegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");
  const [cep, setCep] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [uf, setUf] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingCep, setLoadingCep] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const auth = localStorage.getItem("gb:sellerAuth");
      if (auth === "1") router.replace("/admin/dashboard");
    } catch {}
  }, [router]);

  const onCepBlur = async () => {
    const only = (cep || "").replace(/\D/g, "");
    if (only.length !== 8) return;
    setLoadingCep(true);
    const data: ViaCEP | null = await fetchViaCEP(only);
    setLoadingCep(false);
    if (data) {
      setStreet(data.logradouro || "");
      setNeighborhood(data.bairro || "");
      setCity(data.localidade || "");
      setUf(data.uf || "");
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    // Validações simples
    if (!name || !cpf || !phone || !cep || !number || !email || !password) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }
    try {
      const payload = { name, cpf, phone, cep, street, number, complement, neighborhood, city, uf, email };
      localStorage.setItem("gb:seller", JSON.stringify(payload));
      localStorage.setItem("gb:sellerAuth", "1");
      router.replace("/admin/dashboard");
    } catch {
      setError("Não foi possível concluir o cadastro. Tente novamente.");
    }
  };

  return (
    <section className="container-max py-10">
      <div className="max-w-2xl mx-auto rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold">Cadastro do Jornaleiro</h1>
        <p className="mt-1 text-sm text-gray-600">Faça seu cadastro rápido para acessar o painel e cadastrar suas bancas.</p>
        {error && (
          <div className="mt-3 rounded-md border border-rose-300 bg-rose-50 text-rose-700 text-sm px-3 py-2">{error}</div>
        )}
        <form onSubmit={onSubmit} className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="md:col-span-2">
            <label className="text-[12px] text-gray-700">Nome do Jornaleiro</label>
            <input className="input mt-1 w-full" value={name} onChange={(e)=>setName(e.target.value)} required />
          </div>
          <div>
            <label className="text-[12px] text-gray-700">CPF</label>
            <input className="input mt-1 w-full" value={cpf} onChange={(e)=>setCpf(maskCPF(e.target.value))} placeholder="000.000.000-00" required />
          </div>
          <div>
            <label className="text-[12px] text-gray-700">Whatsapp</label>
            <input className="input mt-1 w-full" value={phone} onChange={(e)=>setPhone(maskPhoneBR(e.target.value))} placeholder="(00) 00000-0000" required />
          </div>

          <div>
            <label className="text-[12px] text-gray-700">CEP da banca</label>
            <input className="input mt-1 w-full" value={cep} onChange={(e)=>setCep(maskCEP(e.target.value))} onBlur={onCepBlur} placeholder="00000-000" required />
          </div>
          <div className="md:col-span-1" aria-live="polite">
            {loadingCep && <div className="text-[12px] text-gray-500 mt-6">Buscando endereço...</div>}
          </div>

          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-[12px] text-gray-700">Rua</label>
              <input className="input mt-1 w-full" value={street} onChange={(e)=>setStreet(e.target.value)} readOnly={!!street} />
            </div>
            <div>
              <label className="text-[12px] text-gray-700">Bairro</label>
              <input className="input mt-1 w-full" value={neighborhood} onChange={(e)=>setNeighborhood(e.target.value)} readOnly={!!neighborhood} />
            </div>
            <div>
              <label className="text-[12px] text-gray-700">Cidade</label>
              <input className="input mt-1 w-full" value={city} onChange={(e)=>setCity(e.target.value)} readOnly={!!city} />
            </div>
            <div>
              <label className="text-[12px] text-gray-700">UF</label>
              <input className="input mt-1 w-full" value={uf} onChange={(e)=>setUf(e.target.value)} readOnly={!!uf} />
            </div>
          </div>

          <div>
            <label className="text-[12px] text-gray-700">Número</label>
            <input className="input mt-1 w-full" value={number} onChange={(e)=>setNumber(e.target.value)} placeholder="Nº" required />
          </div>
          <div>
            <label className="text-[12px] text-gray-700">Complemento</label>
            <input className="input mt-1 w-full" value={complement} onChange={(e)=>setComplement(e.target.value)} placeholder="Opcional" />
          </div>

          <div>
            <label className="text-[12px] text-gray-700">Email</label>
            <input type="email" className="input mt-1 w-full" value={email} onChange={(e)=>setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="text-[12px] text-gray-700">Senha</label>
            <input type="password" className="input mt-1 w-full" value={password} onChange={(e)=>setPassword(e.target.value)} required />
          </div>

          <div className="md:col-span-2">
            <button type="submit" className="w-full rounded-md bg-gradient-to-r from-[#ff5c00] to-[#ff7a33] px-4 py-2 text-sm font-semibold text-white hover:opacity-95">Criar conta</button>
          </div>
        </form>
        <div className="mt-4 text-sm text-center">
          Já tem conta? <Link href="/admin/login" className="text-[#ff5c00] hover:underline">Entrar</Link>
        </div>
      </div>
    </section>
  );
}
