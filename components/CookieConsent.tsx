"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type ConsentStatus = "accepted" | "rejected" | "custom";

type StoredConsent = {
  status: ConsentStatus;
  preferences: Record<string, boolean>;
};

const STORAGE_KEY = "gb-cookie-consent";

const DEFAULT_PREFERENCES: Record<string, boolean> = {
  necessary: true,
  analytics: true,
  marketing: false
};

export default function CookieConsent() {
  const [isMounted, setIsMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window === "undefined") return;
    try {
      const storedRaw = window.localStorage.getItem(STORAGE_KEY);
      if (!storedRaw) {
        setVisible(true);
        return;
      }
      const stored: StoredConsent = JSON.parse(storedRaw);
      if (stored?.preferences) {
        setPreferences(prev => ({ ...prev, ...stored.preferences }));
      }
    } catch (error) {
      console.error("Erro ao carregar consentimento de cookies:", error);
      setVisible(true);
    }
  }, []);

  const persistConsent = (status: ConsentStatus, prefs: Record<string, boolean>) => {
    if (typeof window === "undefined") return;
    const payload: StoredConsent = { status, preferences: prefs };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  };

  const handleAcceptAll = () => {
    const next = { ...preferences, analytics: true, marketing: true };
    setPreferences(next);
    persistConsent("accepted", next);
    setVisible(false);
  };

  const handleRejectAll = () => {
    const next = { ...preferences, analytics: false, marketing: false };
    setPreferences(next);
    persistConsent("rejected", next);
    setVisible(false);
  };

  const handleSavePreferences = () => {
    persistConsent("custom", preferences);
    setVisible(false);
  };

  const togglePreference = (key: keyof typeof DEFAULT_PREFERENCES) => {
    if (key === "necessary") return;
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const actionButtons = useMemo(() => (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end sm:gap-3">
      <button
        type="button"
        onClick={() => setSettingsOpen(prev => !prev)}
        className="w-full sm:w-auto rounded-lg border border-gray-400 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-gray-500 hover:text-gray-900"
      >
        Definições de cookies
      </button>
      <button
        type="button"
        onClick={handleRejectAll}
        className="w-full sm:w-auto rounded-lg border border-[#ff5c00]/30 bg-white px-4 py-2 text-sm font-semibold text-[#ff5c00] transition hover:bg-[#fff2e8]"
      >
        Rejeitar Todos
      </button>
      <button
        type="button"
        onClick={settingsOpen ? handleSavePreferences : handleAcceptAll}
        className="w-full sm:w-auto rounded-lg bg-[#ff5c00] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#ff7a33]"
      >
        {settingsOpen ? "Salvar preferências" : "Aceitar todos os cookies"}
      </button>
    </div>
  ), [handleRejectAll, handleAcceptAll, handleSavePreferences, settingsOpen]);

  if (!isMounted || !visible) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center pointer-events-none">
      <div className="absolute inset-0 bg-black/50 pointer-events-auto sm:hidden" aria-hidden />
      <div className="relative w-full pointer-events-auto sm:max-w-6xl sm:px-6 sm:pb-8">
        <div className="mx-auto w-full max-w-[calc(100%-2rem)] px-4 pb-6 sm:max-w-none sm:px-0 sm:pb-0">
          <div className="rounded-2xl border border-[#ff5c00]/30 bg-white shadow-2xl sm:rounded-xl sm:border sm:shadow-[0_-16px_48px_-24px_rgba(0,0,0,0.35)]">
            <div className="hidden sm:block h-1 w-full bg-gradient-to-r from-[#ff6b18] via-[#ff5c00] to-[#ff7a33]" aria-hidden />
            <div className="px-4 py-4 sm:px-6 sm:py-4">
              <p className="text-sm text-gray-700 sm:max-w-4xl">
                Ao clicar em "Aceitar todos os cookies", concorda com o armazenamento de cookies no seu dispositivo para
                melhorar a navegação no site, analisar a utilização e ajudar nas nossas iniciativas de marketing. Para mais
                informações consulte a nossa {""}
                <Link href="/privacidade" className="font-semibold text-[#ff5c00] underline underline-offset-2">
                  Política de cookies
                </Link>
                .
              </p>

              {settingsOpen && (
                <div className="mt-4 space-y-3 rounded-xl border border-[#ff5c00]/20 bg-[#fff4ec] p-3">
                  <PreferencesItem
                    label="Cookies necessários"
                    description="Essenciais para o funcionamento do site e não podem ser desativados."
                    checked
                    disabled
                  />
                  <PreferencesItem
                    label="Cookies analíticos"
                    description="Ajudam a analisar o desempenho e entender como os visitantes interagem com o site."
                    checked={preferences.analytics}
                    onToggle={() => togglePreference("analytics")}
                  />
                  <PreferencesItem
                    label="Cookies de marketing"
                    description="Utilizados para personalizar ofertas e campanhas relevantes para você."
                    checked={preferences.marketing}
                    onToggle={() => togglePreference("marketing")}
                  />
                </div>
              )}

              <div className="mt-4">{actionButtons}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type PreferencesItemProps = {
  label: string;
  description: string;
  checked?: boolean;
  disabled?: boolean;
  onToggle?: () => void;
};

function PreferencesItem({ label, description, checked = false, disabled, onToggle }: PreferencesItemProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <div className="text-sm font-semibold text-gray-800">{label}</div>
        <p className="mt-1 text-xs text-gray-600 leading-relaxed">{description}</p>
      </div>
      <button
        type="button"
        onClick={onToggle}
        disabled={disabled}
        aria-pressed={checked}
        className={`relative h-6 w-11 rounded-full border transition ${
          checked ? "border-[#ff5c00] bg-[#ff5c00]" : "border-gray-300 bg-gray-200"
        } ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
      >
        <span
          className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-white transition ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}
