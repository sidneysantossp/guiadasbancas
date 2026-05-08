"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTiktok,
  IconBrandWhatsapp,
  IconClipboardCopy,
  IconExternalLink,
  IconMapPin,
  IconPrinter,
  IconQrcode,
  IconShare,
  IconSpeakerphone,
} from "@tabler/icons-react";
import { useToast } from "@/components/admin/ToastProvider";
import JornaleiroPageHeading from "@/components/jornaleiro/JornaleiroPageHeading";
import { buildBancaHref } from "@/lib/slug";

type BancaMarketingData = {
  id: string;
  name?: string | null;
  address?: string | null;
  addressObj?: { uf?: string | null } | null;
  state?: string | null;
  email?: string | null;
  cover?: string | null;
  avatar?: string | null;
  cover_image?: string | null;
  profile_image?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  instagram?: string | null;
  facebook?: string | null;
  tiktok?: string | null;
  hours?: BancaDayHours[] | null;
  opening_hours?: unknown;
  images?: {
    cover?: string | null;
    avatar?: string | null;
  } | null;
  contact?: { whatsapp?: string | null } | null;
  socials?: {
    instagram?: string | null;
    facebook?: string | null;
    tiktok?: string | null;
  } | null;
};

type SocialLinkKey = "instagram" | "facebook" | "tiktok";
type SocialLinks = Record<SocialLinkKey, string>;
type BancaDayHours = { key: string; label?: string; open?: boolean; start?: string; end?: string };

const emptySocialLinks: SocialLinks = {
  instagram: "",
  facebook: "",
  tiktok: "",
};

const socialLinkConfig: {
  key: SocialLinkKey;
  label: string;
  placeholder: string;
  baseUrl: string;
  Icon: typeof IconBrandInstagram;
}[] = [
  {
    key: "instagram",
    label: "Instagram",
    placeholder: "https://instagram.com/sua_banca",
    baseUrl: "https://instagram.com/",
    Icon: IconBrandInstagram,
  },
  {
    key: "facebook",
    label: "Facebook",
    placeholder: "https://facebook.com/sua_banca",
    baseUrl: "https://facebook.com/",
    Icon: IconBrandFacebook,
  },
  {
    key: "tiktok",
    label: "TikTok",
    placeholder: "https://tiktok.com/@sua_banca",
    baseUrl: "https://tiktok.com/@",
    Icon: IconBrandTiktok,
  },
];

const flyerCategories = ["Álbuns e Figurinhas da Copa", "Informática", "Tabacaria"];

const readyMessages = [
  {
    title: "Divulgação geral",
    label: "Perfil da banca",
    text: "Agora você pode ver produtos, novidades e falar direto com a nossa banca pelo Guia das Bancas. Acesse:",
  },
  {
    title: "Figurinhas e novidades",
    label: "Status e grupos",
    text: "Chegaram novidades na banca. Fale com a gente antes de sair de casa e confirme disponibilidade pelo nosso perfil:",
  },
  {
    title: "QR Code no balcão",
    label: "Atendimento presencial",
    text: "Escaneie o QR Code da nossa banca para ver produtos, salvar o contato e falar direto pelo WhatsApp:",
  },
];

function marketingShareText(bancaName: string, profileUrl: string) {
  return `Conheça a ${bancaName} no Guia das Bancas. Veja produtos, novidades e fale direto pelo WhatsApp: ${profileUrl}`;
}

function getStoredSocialLinks(bancaId: string): Partial<SocialLinks> | null {
  try {
    const stored = window.localStorage.getItem(`guiadasbancas:marketing-socials:${bancaId}`);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function resolveInitialSocialLinks(data: BancaMarketingData): SocialLinks {
  const stored = data.id ? getStoredSocialLinks(data.id) : null;

  return {
    instagram: stored?.instagram ?? data.socials?.instagram ?? data.instagram ?? "",
    facebook: stored?.facebook ?? data.socials?.facebook ?? data.facebook ?? "",
    tiktok: stored?.tiktok ?? data.socials?.tiktok ?? data.tiktok ?? "",
  };
}

function normalizeSocialUrl(key: SocialLinkKey, value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;

  const config = socialLinkConfig.find((item) => item.key === key);
  const cleanHandle = trimmed.replace(/^@+/, "").replace(/^\/+/, "");
  return config ? `${config.baseUrl}${cleanHandle}` : trimmed;
}

function formatSocialDisplay(key: SocialLinkKey, value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";

  try {
    const url = new URL(normalizeSocialUrl(key, trimmed));
    const handle = url.pathname.replace(/^\/+/, "").replace(/^@+/, "").split("/")[0];
    return handle ? `@${handle}` : url.hostname.replace(/^www\./, "");
  } catch {
    return trimmed.startsWith("@") ? trimmed : `@${trimmed.replace(/^\/+/, "")}`;
  }
}

const dayKeyAliases: Record<string, string> = {
  seg: "seg",
  mon: "seg",
  monday: "seg",
  segunda: "seg",
  ter: "ter",
  tue: "ter",
  tuesday: "ter",
  terca: "ter",
  terça: "ter",
  qua: "qua",
  wed: "qua",
  wednesday: "qua",
  quarta: "qua",
  qui: "qui",
  thu: "qui",
  thursday: "qui",
  quinta: "qui",
  sex: "sex",
  fri: "sex",
  friday: "sex",
  sexta: "sex",
  sab: "sab",
  sat: "sab",
  saturday: "sab",
  sabado: "sab",
  sábado: "sab",
  dom: "dom",
  sun: "dom",
  sunday: "dom",
  domingo: "dom",
};

const dayLabels: Record<string, string> = {
  seg: "Seg",
  ter: "Ter",
  qua: "Qua",
  qui: "Qui",
  sex: "Sex",
  sab: "Sáb",
  dom: "Dom",
};

function normalizeDayKey(key?: string) {
  return key ? dayKeyAliases[key.toLowerCase()] || key.toLowerCase() : "";
}

function formatHourRange(day?: BancaDayHours) {
  if (!day) return "Não informado";
  if (day.open === false) return "Fechado";

  const start = day.start || "";
  const end = day.end || "";
  if (!start && !end) return "Não informado";
  if (start && end) return `${start} às ${end}`;
  return start || end;
}

function resolveHoursMap(hours?: BancaDayHours[] | null) {
  const map: Record<string, BancaDayHours> = {};
  if (!Array.isArray(hours)) return map;

  hours.forEach((day) => {
    const key = normalizeDayKey(day.key);
    if (key) map[key] = day;
  });

  return map;
}

const orderedDayKeys = ["seg", "ter", "qua", "qui", "sex", "sab", "dom"];

function formatDayGroupLabel(startKey: string, endKey: string) {
  if (startKey === endKey) return dayLabels[startKey] || startKey;
  return `${dayLabels[startKey] || startKey} a ${dayLabels[endKey] || endKey}`;
}

function formatScheduleLines(hoursMap: Record<string, BancaDayHours>) {
  const lines: Array<{ label: string; range: string }> = [];
  let startIndex = 0;
  let currentRange = formatHourRange(hoursMap[orderedDayKeys[0]]);

  for (let index = 1; index <= orderedDayKeys.length; index += 1) {
    const nextRange = index < orderedDayKeys.length ? formatHourRange(hoursMap[orderedDayKeys[index]]) : null;

    if (nextRange === currentRange) {
      continue;
    }

    lines.push({
      label: formatDayGroupLabel(orderedDayKeys[startIndex], orderedDayKeys[index - 1]),
      range: currentRange,
    });

    startIndex = index;
    currentRange = nextRange || "";
  }

  return lines;
}

export default function JornaleiroMarketingPage() {
  const toast = useToast();
  const [banca, setBanca] = useState<BancaMarketingData | null>(null);
  const [origin, setOrigin] = useState("");
  const [loading, setLoading] = useState(true);
  const [socialLinks, setSocialLinks] = useState<SocialLinks>(emptySocialLinks);
  const [socialLinksReady, setSocialLinksReady] = useState(false);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    let active = true;

    async function loadBanca() {
      try {
        setLoading(true);
        const response = await fetch(`/api/jornaleiro/banca?ts=${Date.now()}`, {
          cache: "no-store",
          credentials: "include",
        });
        const json = await response.json().catch(() => null);

        if (active && response.ok && json?.success && json?.data) {
          setBanca(json.data);
          setSocialLinks(resolveInitialSocialLinks(json.data));
          setSocialLinksReady(true);
        }
      } catch {
        if (active) {
          setBanca(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadBanca();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!banca?.id || !socialLinksReady) return;

    try {
      window.localStorage.setItem(`guiadasbancas:marketing-socials:${banca.id}`, JSON.stringify(socialLinks));
    } catch {
      // Mantém a edição local mesmo se o navegador bloquear storage.
    }
  }, [banca?.id, socialLinks, socialLinksReady]);

  const profilePath = useMemo(() => {
    if (!banca?.id) return "";
    return buildBancaHref(
      banca.name || "banca",
      banca.id,
      banca.addressObj?.uf || banca.state || banca.address || "sp"
    );
  }, [banca]);

  const profileUrl = origin && profilePath ? `${origin}${profilePath}` : "";
  const bancaName = banca?.name || "Minha banca";
  const shareText = profileUrl ? marketingShareText(bancaName, profileUrl) : "";
  const featuredImage = banca?.images?.cover || banca?.cover_image || banca?.cover || banca?.images?.avatar || banca?.profile_image || banca?.avatar || "";
  const bancaAddress = banca?.address || "Endereço da banca";
  const hoursMap = resolveHoursMap(banca?.hours);
  const scheduleLines = formatScheduleLines(hoursMap);
  const whatsappShareUrl = shareText ? `https://wa.me/?text=${encodeURIComponent(shareText)}` : "#";
  const facebookShareUrl = profileUrl
    ? `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}`
    : "#";
  const qrCodeUrl = profileUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=360x360&margin=16&data=${encodeURIComponent(profileUrl)}`
    : "";

  const copyToClipboard = async (value: string, successMessage: string) => {
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);
      toast.success(successMessage);
    } catch {
      toast.error("Não foi possível copiar agora.");
    }
  };

  const shareProfile = async () => {
    if (!profileUrl) return;

    const sharePayload = {
      title: bancaName,
      text: shareText,
      url: profileUrl,
    };

    if ("share" in navigator) {
      try {
        await (navigator as Navigator & { share: (data: typeof sharePayload) => Promise<void> }).share(sharePayload);
        return;
      } catch {
        return;
      }
    }

    await copyToClipboard(shareText, "Texto de divulgação copiado.");
  };

  const printPage = () => {
    window.print();
  };

  const activeSocialLinks = socialLinkConfig
    .map((item) => {
      const value = socialLinks[item.key];
      return {
        ...item,
        value,
        href: normalizeSocialUrl(item.key, value),
        display: formatSocialDisplay(item.key, value),
      };
    })
    .filter((item) => item.href && item.display);

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-500 shadow-sm">
        Carregando ferramentas de marketing...
      </div>
    );
  }

  if (!banca?.id) {
    return (
      <div className="space-y-6">
        <JornaleiroPageHeading title="Marketing" />
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
          Cadastre ou vincule uma banca antes de gerar links, QR Code e materiais de divulgação.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 12mm;
          }

          body {
            background: #ffffff !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          body * {
            visibility: hidden !important;
          }

          #marketing-print-card,
          #marketing-print-card * {
            visibility: visible !important;
          }

          #marketing-print-card {
            position: fixed !important;
            top: 12mm !important;
            left: 50% !important;
            width: 124mm !important;
            max-width: 124mm !important;
            transform: translateX(-50%) !important;
            border: 1px solid #d1d5db !important;
            box-shadow: none !important;
          }
        }
      `}</style>

      <JornaleiroPageHeading
        title="Marketing"
        actions={
          <button
            type="button"
            onClick={shareProfile}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#ff5c00] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-90"
          >
            <IconShare size={18} />
            Compartilhar banca
          </button>
        }
      />

      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-[#ff5c00]">
            <IconSpeakerphone size={20} />
          </div>
          <div className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">Link público</div>
          <div className="mt-2 text-lg font-semibold text-gray-900">Perfil pronto para divulgar</div>
          <p className="mt-1 text-sm text-gray-500">Use o link da banca em redes sociais, status e mensagens.</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-700">
            <IconQrcode size={20} />
          </div>
          <div className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">QR Code</div>
          <div className="mt-2 text-lg font-semibold text-gray-900">Acesso direto no balcão</div>
          <p className="mt-1 text-sm text-gray-500">Imprima ou mostre o QR Code para o cliente abrir no celular.</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
            <IconClipboardCopy size={20} />
          </div>
          <div className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">Mensagens</div>
          <div className="mt-2 text-lg font-semibold text-gray-900">Textos prontos para copiar</div>
          <p className="mt-1 text-sm text-gray-500">Divulgue novidades e atendimento direto sem escrever do zero.</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[#ff5c00]">Divulgação digital</div>
                <h2 className="mt-2 text-xl font-semibold text-gray-900">Link da sua banca</h2>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Compartilhe este endereço para o cliente acessar seu perfil, ver produtos e chamar a banca.
                </p>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(profileUrl, "Link da banca copiado.")}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-50"
              >
                <IconClipboardCopy size={18} />
                Copiar link
              </button>
            </div>

            <div className="mt-5 rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-4">
              <div className="break-all font-mono text-sm text-gray-700">{profileUrl}</div>
              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href={whatsappShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700"
                >
                  <IconBrandWhatsapp size={18} />
                  Enviar no WhatsApp
                </a>
                <button
                  type="button"
                  onClick={() => copyToClipboard(shareText, "Texto para Instagram copiado.")}
                  className="inline-flex items-center gap-2 rounded-xl bg-pink-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-pink-700"
                >
                  Copiar para Instagram
                </button>
                <a
                  href={facebookShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  <IconBrandFacebook size={18} />
                  Facebook
                </a>
                <Link
                  href={profilePath as Route}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-50"
                >
                  <IconExternalLink size={18} />
                  Ver perfil
                </Link>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_440px] xl:items-start">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-green-700">QR Code da banca</div>
                <h2 className="mt-2 text-xl font-semibold text-gray-900">Folheto pronto para imprimir</h2>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
                  Monte um material simples para balcão, sacolas ou gráfica. O QR Code leva direto para o perfil da banca e os links abaixo aparecem na prévia.
                </p>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {socialLinkConfig.map((item) => {
                    const Icon = item.Icon;

                    return (
                      <label key={item.key} className="block">
                        <span className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
                          <Icon size={15} />
                          {item.label}
                        </span>
                        <input
                          type="url"
                          value={socialLinks[item.key]}
                          onChange={(event) =>
                            setSocialLinks((current) => ({
                              ...current,
                              [item.key]: event.target.value,
                            }))
                          }
                          placeholder={item.placeholder}
                          className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-[#ff5c00] focus:ring-2 focus:ring-orange-100"
                        />
                      </label>
                    );
                  })}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <a
                    href={qrCodeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#ff5c00] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90"
                  >
                    <IconQrcode size={18} />
                    Abrir QR Code
                  </a>
                  <button
                    type="button"
                    onClick={printPage}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-50"
                  >
                    <IconPrinter size={18} />
                    Imprimir folheto
                  </button>
                </div>
              </div>

              <div className="flex justify-center xl:justify-end">
                <div
                  id="marketing-print-card"
                  className="w-full max-w-[440px] overflow-hidden rounded-[26px] border border-gray-200 bg-white text-gray-950 shadow-sm"
                >
                  <div className="relative overflow-hidden bg-orange-50">
                    <div className="relative overflow-hidden bg-white">
                      {featuredImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={featuredImage} alt={`Imagem de destaque da ${bancaName}`} className="h-36 w-full object-cover" />
                      ) : (
                        <div className="flex h-36 w-full items-center justify-center bg-white px-5 text-center text-sm font-semibold text-slate-400">
                          Imagem de destaque da banca
                        </div>
                      )}
                      <div className="absolute left-4 top-4 rounded-full bg-[#ff5c00] px-3.5 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-white shadow-lg shadow-orange-950/20">
                        Compre pelo WhatsApp
                      </div>
                    </div>

                    <div className="px-5 pb-5 pt-4">
                      <h3 className="text-2xl font-black leading-[1.05] text-slate-950">
                        Escaneie e faça suas compras online.
                      </h3>
                      <p className="mt-2 text-[13px] leading-5 text-slate-600">
                        Conheça nosso catálogo de produtos e faça seus pedidos pelo WhatsApp.
                      </p>
                    </div>
                  </div>

                  <div className="px-5 py-4 text-center">
                    <div className="mx-auto w-fit rounded-3xl border border-gray-200 bg-white p-3 shadow-sm">
                      {qrCodeUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={qrCodeUrl} alt={`QR Code da ${bancaName}`} className="h-36 w-36 rounded-xl bg-white" />
                      ) : (
                        <div className="grid h-36 w-36 place-items-center rounded-xl bg-gray-50 text-sm text-gray-400">
                          QR Code
                        </div>
                      )}
                    </div>
                    <div className="mt-3 text-base font-bold text-slate-950">{bancaName}</div>
                    <div className="mt-1 text-xs text-slate-500">Aponte a câmera do celular</div>
                  </div>

                  <div className="bg-slate-950 px-5 py-4 text-white">
                    <div className="space-y-2 text-[13px]">
                      <div className="rounded-2xl bg-white/5 px-3 py-2.5">
                        <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Categorias</div>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {flyerCategories.map((category) => (
                            <span key={category} className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold text-slate-950">
                              {category}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <IconMapPin size={18} className="mt-0.5 shrink-0 text-[#ff5c00]" />
                        <span className="font-semibold leading-5">{bancaAddress}</span>
                      </div>
                      <div className="flex flex-wrap gap-x-3 gap-y-1 rounded-2xl bg-white/5 px-3 py-2.5 text-left text-[11px] leading-5 text-slate-200">
                        {scheduleLines.map((line) => (
                          <div key={line.label} className="whitespace-nowrap">
                            <span className="font-bold text-white">{line.label}:</span> {line.range}
                          </div>
                        ))}
                      </div>
                    </div>

                    {activeSocialLinks.length > 0 ? (
                      <div className="mt-4 border-t border-white/10 pt-3">
                        <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Mídias sociais</div>
                        <div className="mt-2 grid grid-cols-3 gap-1.5">
                          {activeSocialLinks.map((item) => {
                            const Icon = item.Icon;

                            return (
                              <a
                                key={item.key}
                                href={item.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex min-w-0 items-center justify-center gap-1.5 rounded-lg bg-white/5 px-1.5 py-1.5 text-[10px] font-semibold text-white"
                              >
                                <Icon size={14} className="shrink-0 text-[#ff5c00]" />
                                <span className="truncate">{item.display}</span>
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">Mensagens prontas</div>
                <h2 className="mt-2 text-xl font-semibold text-gray-900">Copie e divulgue em segundos</h2>
                <p className="mt-1 text-sm text-gray-500">Use estes textos no status, grupos, Instagram ou conversa com clientes.</p>
              </div>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {readyMessages.map((message) => {
                const fullMessage = `${message.text} ${profileUrl}`;

                return (
                  <div key={message.title} className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                    <div className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-400">{message.label}</div>
                    <h3 className="mt-2 text-sm font-semibold text-gray-900">{message.title}</h3>
                    <p className="mt-2 line-clamp-4 text-sm leading-6 text-gray-600">{fullMessage}</p>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(fullMessage, "Mensagem copiada.")}
                      className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-3 py-2.5 text-sm font-semibold text-gray-800 ring-1 ring-gray-200 hover:bg-gray-50"
                    >
                      <IconClipboardCopy size={17} />
                      Copiar mensagem
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">Checklist de divulgação</div>
            <h2 className="mt-2 text-lg font-semibold text-gray-900">Próximas ações</h2>
            <div className="mt-4 space-y-3">
              {[
                "Colocar o link no status do WhatsApp.",
                "Enviar o perfil para clientes frequentes.",
                "Deixar o QR Code visível no balcão.",
                "Publicar uma mensagem quando chegarem novidades.",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 px-3 py-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#ff5c00]" />
                  <span className="text-sm leading-5 text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-slate-950 p-4 text-white shadow-sm sm:p-6">
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-orange-300">Cartaz rápido</div>
            <h2 className="mt-2 text-xl font-semibold">Use o QR Code no ponto físico</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Imprima esta página ou abra o QR Code em uma tela maior para criar um material simples de balcão.
            </p>
            <div className="mt-5 rounded-2xl bg-white p-4 text-slate-950">
              <div className="rounded-full bg-[#ff5c00] px-3 py-1 text-center text-xs font-bold uppercase tracking-[0.12em] text-white">
                Estamos no Guia das Bancas
              </div>
              <h3 className="mt-4 text-xl font-bold leading-tight">Escaneie e fale direto com nossa banca</h3>
              <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-3">
                <div className="text-sm font-semibold">{bancaName}</div>
                <div className="mt-1 text-xs leading-5 text-gray-500">Produtos, novidades e contato pelo WhatsApp.</div>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
