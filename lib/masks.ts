export function maskCPF(value: string): string {
  const v = (value || "").replace(/\D/g, "").slice(0, 11);
  const parts = [] as string[];
  if (v.length > 3) parts.push(v.slice(0,3)); else return v;
  if (v.length > 6) parts.push(v.slice(3,6)); else return `${v.slice(0,3)}.${v.slice(3)}`;
  const tail = v.slice(6);
  if (tail.length > 3) return `${v.slice(0,3)}.${v.slice(3,6)}.${v.slice(6,9)}-${v.slice(9,11)}`;
  return `${v.slice(0,3)}.${v.slice(3,6)}.${tail}`;
}

export function maskCPFOrCNPJ(value: string): string {
  const v = (value || "").replace(/\D/g, "").slice(0, 14);
  
  // Se tem até 11 dígitos, formata como CPF
  if (v.length <= 11) {
    if (v.length <= 3) return v;
    if (v.length <= 6) return `${v.slice(0,3)}.${v.slice(3)}`;
    if (v.length <= 9) return `${v.slice(0,3)}.${v.slice(3,6)}.${v.slice(6)}`;
    return `${v.slice(0,3)}.${v.slice(3,6)}.${v.slice(6,9)}-${v.slice(9,11)}`;
  }
  
  // Se tem mais de 11 dígitos, formata como CNPJ
  if (v.length <= 2) return v;
  if (v.length <= 5) return `${v.slice(0,2)}.${v.slice(2)}`;
  if (v.length <= 8) return `${v.slice(0,2)}.${v.slice(2,5)}.${v.slice(5)}`;
  if (v.length <= 12) return `${v.slice(0,2)}.${v.slice(2,5)}.${v.slice(5,8)}/${v.slice(8)}`;
  return `${v.slice(0,2)}.${v.slice(2,5)}.${v.slice(5,8)}/${v.slice(8,12)}-${v.slice(12,14)}`;
}

export function maskPhoneBR(value: string): string {
  const v = (value || "").replace(/\D/g, "").slice(0, 11);
  if (!v) return "";
  if (v.length <= 2) return `(${v}`;
  if (v.length <= 6) return `(${v.slice(0,2)}) ${v.slice(2)}`;
  if (v.length <= 10) return `(${v.slice(0,2)}) ${v.slice(2,6)}-${v.slice(6)}`;
  return `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
}

export function maskCEP(value: string): string {
  const v = (value || "").replace(/\D/g, "").slice(0, 8);
  if (v.length <= 5) return v;
  return `${v.slice(0,5)}-${v.slice(5)}`;
}
