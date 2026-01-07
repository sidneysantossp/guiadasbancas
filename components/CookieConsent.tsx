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
    <div className="fixed bottom-4 right-4 z-[70] pointer-events-none sm:bottom-6 sm:right-6">
      <div className="pointer-events-auto max-w-sm">
        <div className="rounded-xl border border-gray-200 bg-white shadow-lg">
          <div className="p-3">
            <p className="text-xs text-gray-600">
              Usamos cookies para melhorar sua experiência.{" "}
              <Link href="/privacidade" className="text-[#ff5c00] underline">
                Saiba mais
              </Link>
            </p>

            {settingsOpen && (
              <div className="mt-3 space-y-2 rounded-lg border border-gray-100 bg-gray-50 p-2">
                <PreferencesItem
                  label="Necessários"
                  description="Essenciais para o site funcionar."
                  checked
                  disabled
                />
                <PreferencesItem
                  label="Analíticos"
                  description="Ajudam a melhorar o site."
                  checked={preferences.analytics}
                  onToggle={() => togglePreference("analytics")}
                />
                <PreferencesItem
                  label="Marketing"
                  description="Personalizam ofertas."
                  checked={preferences.marketing}
                  onToggle={() => togglePreference("marketing")}
                />
              </div>
            )}

            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSettingsOpen(prev => !prev)}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                {settingsOpen ? "Fechar" : "Opções"}
              </button>
              <div className="flex-1" />
              <button
                type="button"
                onClick={handleRejectAll}
                className="rounded px-2 py-1 text-xs text-gray-600 hover:bg-gray-100"
              >
                Rejeitar
              </button>
              <button
                type="button"
                onClick={settingsOpen ? handleSavePreferences : handleAcceptAll}
                className="rounded bg-[#ff5c00] px-3 py-1 text-xs font-medium text-white hover:bg-[#ff7a33]"
              >
                {settingsOpen ? "Salvar" : "Aceitar"}
              </button>
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
