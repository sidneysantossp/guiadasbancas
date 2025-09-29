export type ViaCEP = {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string; // cidade
  uf: string;
  ibge?: string;
};

export async function fetchViaCEP(cepRaw: string): Promise<ViaCEP | null> {
  const cep = (cepRaw || "").replace(/\D/g, "");
  if (cep.length !== 8) return null;
  try {
    const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    if (!res.ok) return null;
    const data = await res.json();
    if (data?.erro) return null;
    return data as ViaCEP;
  } catch {
    return null;
  }
}
