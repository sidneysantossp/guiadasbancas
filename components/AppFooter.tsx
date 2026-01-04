"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Route } from "next";

export type FooterLink = {
  id: string;
  text: string;
  url: string;
  section: 'institucional' | 'para_voce' | 'para_jornaleiro' | 'atalhos';
  order: number;
};

export type SimpleCategory = {
  id: string;
  name: string;
  link: string;
};

export type FooterData = {
  title: string;
  description: string;
  socialLinks: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    youtube?: string;
  };
  links: {
    institucional: FooterLink[];
    para_voce: FooterLink[];
    para_jornaleiro: FooterLink[];
    atalhos: FooterLink[];
  };
};

function SocialIcon({ type, href }: { type: "instagram" | "facebook" | "twitter" | "youtube"; href?: string }) {
  const common = "w-9 h-9 grid place-items-center rounded-full border border-gray-300 bg-white text-gray-600 hover:text-gray-900 hover:border-gray-400 transition-colors";
  
  if (!href) return null;
  
  if (type === "instagram")
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={common}>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
          <path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm0 2h10c1.654 0 3 1.346 3 3v10c0 1.654-1.346 3-3 3H7c-1.654 0-3-1.346-3-3V7c0-1.654 1.346-3 3-3zm11 1a1 1 0 100 2 1 1 0 000-2zM12 7a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6z"/>
        </svg>
      </a>
    );
  if (type === "facebook")
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className={common}>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
          <path d="M22 12a10 10 0 10-11.6 9.9v-7h-2v-3h2v-2.3c0-2 1.2-3.1 3-3.1.9 0 1.8.1 1.8.1v2h-1c-1 0-1.3.6-1.3 1.2V12h2.2l-.4 3h-1.8v7A10 10 0 0022 12z"/>
        </svg>
      </a>
    );
  if (type === "twitter")
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" aria-label="Twitter/X" className={common}>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
          <path d="M3 3h4.6l5.2 6.9L18.8 3H21l-7.3 9.6L21 21h-4.6l-5.5-7.3L7 21H3l7.6-9.9L3 3z"/>
        </svg>
      </a>
    );
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className={common}>
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
        <path d="M23.5 6.2a3 3 0 00-2.1-2.1C19.3 3.5 12 3.5 12 3.5s-7.3 0-9.4.6A3 3 0 00.5 6.2 31.6 31.6 0 000 12a31.6 31.6 0 00.5 5.8 3 3 0 002.1 2.1c2.1.6 9.4.6 9.4.6s7.3 0 9.4-.6a3 3 0 002.1-2.1A31.6 31.6 0 0024 12a31.6 31.6 0 00-.5-5.8zM9.5 15.5v-7l6 3.5-6 3.5z"/>
      </svg>
    </a>
  );
}

type AppFooterProps = {
  initialFooterData?: FooterData;
  initialCategories?: SimpleCategory[];
  initialBrandingLogo?: { url: string; alt: string } | null;
};

export default function AppFooter({
  initialFooterData,
  initialCategories,
  initialBrandingLogo,
}: AppFooterProps) {
  const needsFooter = initialFooterData === undefined;
  const needsCategories = initialCategories === undefined;
  const needsBranding = initialBrandingLogo === undefined;
  const hasInitial = !needsFooter && !needsCategories && !needsBranding;
  const [footerData, setFooterData] = useState<FooterData | null>(initialFooterData ?? null);
  const [loading, setLoading] = useState(needsFooter || needsCategories || needsBranding);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [categories, setCategories] = useState<SimpleCategory[]>(initialCategories ?? []);
  const [brandingLogo, setBrandingLogo] = useState<{ url: string; alt: string } | null>(
    initialBrandingLogo ?? null
  );

  useEffect(() => {
    if (hasInitial) return;
    let active = true;
    (async () => {
      try {
        const [footerRes, categoriesRes, brandingRes] = await Promise.all([
          needsFooter ? fetch('/api/footer') : null,
          needsCategories ? fetch('/api/categories') : null,
          needsBranding ? fetch('/api/admin/branding') : null
        ]);

        if (active && needsFooter && footerRes && footerRes.ok) {
          const footerJson = await footerRes.json();
          setFooterData(footerJson);
        }

        if (active && needsCategories && categoriesRes && categoriesRes.ok) {
          const catJson = await categoriesRes.json();
          const list: SimpleCategory[] = Array.isArray(catJson?.data)
            ? catJson.data.map((c: any, index: number) => ({
                id: c.id || String(index),
                name: c.name || 'Categoria',
                link: c.link || `/categorias/${c.id || ''}`
              }))
            : [];
          setCategories(list);
        }

        if (active && needsBranding && brandingRes && brandingRes.ok) {
          const brandingJson = await brandingRes.json();
          if (brandingJson?.success && brandingJson?.data?.logoUrl) {
            setBrandingLogo({
              url: brandingJson.data.logoUrl,
              alt: brandingJson.data.logoAlt || 'Guia das Bancas'
            });
          }
        }
      } catch (error) {
        console.error('Erro ao carregar footer ou categorias:', error);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [hasInitial, needsFooter, needsCategories, needsBranding]);

  // Dados padrão enquanto carrega
  const defaultData: FooterData = {
    title: 'Guia das Bancas',
    description: 'Conectamos você às melhores bancas da sua região. Descubra produtos, ofertas e o jornaleiro mais próximo.',
    socialLinks: {},
    links: {
      institucional: [],
      para_voce: [],
      para_jornaleiro: [],
      atalhos: []
    }
  };

  const data = footerData || defaultData;
  const sections = [
    { key: 'institucional', label: 'Institucional', links: data.links.institucional.map(link => ({ id: link.id, text: link.text, url: link.url })) },
    { key: 'para_jornaleiro', label: 'Para o Jornaleiro', links: data.links.para_jornaleiro.map(link => ({ id: link.id, text: link.text, url: link.url })) },
    { key: 'para_voce', label: 'Para você', links: data.links.para_voce.map(link => ({ id: link.id, text: link.text, url: link.url })) },
    { key: 'atalhos', label: 'Atalhos', links: data.links.atalhos.map(link => ({ id: link.id, text: link.text, url: link.url })) },
    ...(categories.length ? [{ key: 'categorias', label: 'Categorias', links: categories.map(cat => ({ id: cat.id, text: cat.name, url: cat.link })) }] : []),
  ].filter(section => section.links.length > 0);

  return (
    <footer className="w-full border-t border-gray-200 bg-white text-gray-700">
      <div className="container-max py-10">
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-6 lg:gap-8">
          {/* Coluna 1: Logo + descrição + sociais */}
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-3">
              {brandingLogo ? (
                <img
                  src={brandingLogo.url}
                  alt={brandingLogo.alt}
                  className="h-9 w-auto"
                  loading="lazy"
                />
              ) : (
                <div className="h-9 w-9 rounded-lg bg-[#ff5c00] grid place-items-center text-white font-extrabold" aria-label={data.title}>
                  GB
                </div>
              )}
            </div>
            <p className="mt-3 text-sm text-gray-600">
              {data.description}
            </p>
            <div className="mt-4 flex items-center gap-2">
              <SocialIcon type="instagram" href={data.socialLinks.instagram} />
              <SocialIcon type="facebook" href={data.socialLinks.facebook} />
              <SocialIcon type="twitter" href={data.socialLinks.twitter} />
              <SocialIcon type="youtube" href={data.socialLinks.youtube} />
            </div>
          </div>

          <div className="hidden md:block">
            <div className="text-sm font-semibold text-gray-900">Institucional</div>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              {data.links.institucional.map((link) => (
                <li key={link.id}>
                  <Link href={link.url as Route} className="hover:text-gray-900 transition-colors">
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="hidden md:block">
            <div className="text-sm font-semibold text-gray-900">Para o Jornaleiro</div>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              {data.links.para_jornaleiro.map((link) => (
                <li key={link.id}>
                  <Link href={link.url as Route} className="hover:text-gray-900 transition-colors">
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="hidden md:block">
            <div className="text-sm font-semibold text-gray-900">Para você</div>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              {data.links.para_voce.map((link) => (
                <li key={link.id}>
                  <Link href={link.url as Route} className="hover:text-gray-900 transition-colors">
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="hidden md:block">
            <div className="text-sm font-semibold text-gray-900">Atalhos</div>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              {data.links.atalhos.map((link) => (
                <li key={link.id}>
                  <Link href={link.url as Route} className="hover:text-gray-900 transition-colors">
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Mobile accordion */}
        {sections.length > 0 && (
          <div className="md:hidden mt-8 bg-white rounded-2xl p-4 shadow-sm">
            <div className="text-center text-sm font-semibold text-gray-800">Links Úteis</div>
            <div className="mt-3 space-y-2">
              {sections.map((section) => {
                const isOpen = openSection === section.key;
                return (
                  <div key={section.key} className="rounded-xl bg-white border border-gray-200">
                    <button
                      type="button"
                      onClick={() => setOpenSection(isOpen ? null : section.key)}
                      className="w-full flex items-center justify-between px-4 py-3 text-left"
                    >
                      <span className="text-sm font-medium text-gray-900">{section.label}</span>
                      <svg
                        viewBox="0 0 24 24"
                        className={`h-4 w-4 text-[#2740d7] transition-transform ${isOpen ? '-rotate-180' : 'rotate-0'}`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>
                    {isOpen && (
                      <ul className="px-4 pb-4 space-y-2 text-sm text-gray-600">
                        {section.links.map((link) => (
                          <li key={link.id}>
                            <Link href={link.url as Route} className="block rounded-md px-2 py-1 hover:bg-gray-100 hover:text-gray-900 transition">
                              {link.text}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Payments & security */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="flex flex-col items-center text-center gap-3">
            <div className="text-sm font-semibold text-gray-800">Formas de Pagamento</div>
            <img
              src="https://res.cloudinary.com/beleza-na-web/image/upload/f_auto,fl_progressive,q_auto:eco,w_iw/dpr_2.0/v1/banner/2025_08_11_09_55_16_8/7f1cfcae-38fe-40e8-905b-ba12fbaa9610-pagamentos.png"
              alt="Formas de pagamento"
              className="w-full max-w-sm object-contain"
              loading="lazy"
            />
          </div>
          <div className="flex flex-col items-center text-center gap-3">
            <div className="text-sm font-semibold text-gray-800">Segurança</div>
            <img
              src="https://res.cloudinary.com/beleza-na-web/image/upload/f_auto,fl_progressive,q_auto:eco,w_iw/dpr_2.0/v1/banner/2025_05_06_10_15_51_5/5de7d0ba-aa98-48b8-84f1-388f0e901606-security-blz.png"
              alt="Selo de segurança"
              className="w-full max-w-sm object-contain"
              loading="lazy"
            />
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 h-px bg-gray-300" />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-600">
          <div>© {new Date().getFullYear()} {data.title}. Todos os direitos reservados.</div>
          <div className="flex items-center gap-4">
            <Link href="/privacidade" className="hover:text-gray-900 transition-colors">Privacidade</Link>
            <Link href="/termos-de-uso" className="hover:text-gray-900 transition-colors">Termos de uso</Link>
            <Link href="/cookies" className="hover:text-gray-900 transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
