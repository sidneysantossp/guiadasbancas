// Hooks reutilizáveis para reduzir duplicação de código

import { useCallback } from 'react';

// Hook para formatação de telefone (XX) XXXXX-XXXX
export function usePhoneFormatter() {
  const formatPhone = useCallback((val: string) => {
    const d = val.replace(/\D/g, '').slice(0, 11);
    if (d.length <= 2) return d;
    if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  }, []);

  const onlyDigits = useCallback((s: string) => s.replace(/\D/g, ''), []);

  return { formatPhone, onlyDigits };
}

// Hook para formatação de CEP XXXXX-XXX
export function useCEPFormatter() {
  const formatCEP = useCallback((digits: string) => {
    const d = digits.replace(/\D/g, '').slice(0, 8);
    if (d.length <= 5) return d;
    return `${d.slice(0, 5)}-${d.slice(5)}`;
  }, []);

  const onlyDigits = useCallback((s: string) => s.replace(/\D/g, ''), []);

  return { formatCEP, onlyDigits };
}

// Hook para validação de email
export function useEmailValidator() {
  const isValidEmail = useCallback((email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  }, []);

  return { isValidEmail };
}

// Hook para validação de senha
export function usePasswordValidator() {
  const validatePassword = useCallback((password: string) => {
    if (!password.trim()) {
      return { isValid: false, error: "Informe sua senha" };
    }

    if (password.length < 6) {
      return { isValid: false, error: "A senha deve ter pelo menos 6 caracteres" };
    }

    return { isValid: true, error: null };
  }, []);

  return { validatePassword };
}

// Hook para validação de UF (estado brasileiro)
export function useUFValidator() {
  const isValidUF = useCallback((uf: string) => {
    const ufs = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];
    return ufs.includes(uf.trim().toUpperCase());
  }, []);

  return { isValidUF };
}

// Hook para validação de número de endereço
export function useAddressNumberValidator() {
  const isValidNumber = useCallback((number: string) => {
    const v = number.trim().toUpperCase();
    if (!v) return false;
    if (v === "S/N") return true;
    return /\d+/.test(v);
  }, []);

  return { isValidNumber };
}
