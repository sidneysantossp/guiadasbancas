"use client";

import Link from "next/link";

function SocialIcon({ type }: { type: "instagram" | "facebook" | "x" | "youtube" }) {
  const common = "w-9 h-9 grid place-items-center rounded-full border border-gray-600 hover:bg-white/5 text-gray-300";
  if (type === "instagram")
    return (
      <a href="#" aria-label="Instagram" className={common}>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
          <path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm0 2h10c1.654 0 3 1.346 3 3v10c0 1.654-1.346 3-3 3H7c-1.654 0-3-1.346-3-3V7c0-1.654 1.346-3 3-3zm11 1a1 1 0 100 2 1 1 0 000-2zM12 7a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6z"/>
        </svg>
      </a>
    );
  if (type === "facebook")
    return (
      <a href="#" aria-label="Facebook" className={common}>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
          <path d="M22 12a10 10 0 10-11.6 9.9v-7h-2v-3h2v-2.3c0-2 1.2-3.1 3-3.1.9 0 1.8.1 1.8.1v2h-1c-1 0-1.3.6-1.3 1.2V12h2.2l-.4 3h-1.8v7A10 10 0 0022 12z"/>
        </svg>
      </a>
    );
  if (type === "x")
    return (
      <a href="#" aria-label="X" className={common}>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
          <path d="M3 3h4.6l5.2 6.9L18.8 3H21l-7.3 9.6L21 21h-4.6l-5.5-7.3L7 21H3l7.6-9.9L3 3z"/>
        </svg>
      </a>
    );
  return (
    <a href="#" aria-label="YouTube" className={common}>
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
        <path d="M23.5 6.2a3 3 0 00-2.1-2.1C19.3 3.5 12 3.5 12 3.5s-7.3 0-9.4.6A3 3 0 00.5 6.2 31.6 31.6 0 000 12a31.6 31.6 0 00.5 5.8 3 3 0 002.1 2.1c2.1.6 9.4.6 9.4.6s7.3 0 9.4-.6a3 3 0 002.1-2.1A31.6 31.6 0 0024 12a31.6 31.6 0 00-.5-5.8zM9.5 15.5v-7l6 3.5-6 3.5z"/>
      </svg>
    </a>
  );
}

export default function AppFooter() {
  return (
    <footer className="w-full border-t border-gray-800 bg-[#0b0c10] text-gray-300">
      <div className="container-max py-10">
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-6 lg:gap-8">
          {/* Coluna 1: Logo + descrição + sociais */}
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-[#ff5c00] grid place-items-center text-white font-extrabold">GB</div>
              <div className="text-lg font-bold text-white">Guia das Bancas</div>
            </div>
            <p className="mt-3 text-sm text-gray-400">
              Conectamos você às melhores bancas da sua região. Descubra produtos, ofertas e o jornaleiro mais próximo.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <SocialIcon type="instagram" />
              <SocialIcon type="facebook" />
              <SocialIcon type="x" />
              <SocialIcon type="youtube" />
            </div>
          </div>

          {/* Coluna 2: Institucional */}
          <div>
            <div className="text-sm font-semibold text-white">Institucional</div>
            <ul className="mt-3 space-y-2 text-sm text-gray-300">
              <li><Link href="#">Sobre nós</Link></li>
              <li><Link href="#">Como funciona</Link></li>
              <li><Link href="#">Blog</Link></li>
              <li><Link href="#">Imprensa</Link></li>
            </ul>
          </div>

          {/* Coluna 3: Para o Jornaleiro */}
          <div>
            <div className="text-sm font-semibold text-white">Para o Jornaleiro</div>
            <ul className="mt-3 space-y-2 text-sm text-gray-300">
              <li><Link href="/jornaleiro/registrar">Cadastre sua banca</Link></li>
              <li><Link href="/jornaleiro">Fazer login</Link></li>
              <li><Link href="#">Central de ajuda</Link></li>
              <li><Link href="#">Termos para Parceiros</Link></li>
            </ul>
          </div>

          {/* Coluna 4: Para o Usuário */}
          <div>
            <div className="text-sm font-semibold text-white">Para você</div>
            <ul className="mt-3 space-y-2 text-sm text-gray-300">
              <li><Link href="#">Minha conta</Link></li>
              <li><Link href="#">Pedidos</Link></li>
              <li><Link href="#">Favoritos</Link></li>
              <li><Link href="#">Suporte</Link></li>
            </ul>
          </div>

          {/* Coluna 5: Atalhos */}
          <div>
            <div className="text-sm font-semibold text-white">Atalhos</div>
            <ul className="mt-3 space-y-2 text-sm text-gray-300">
              <li><Link href="/bancas-perto-de-mim">Bancas perto de você</Link></li>
              <li><Link href="/buscar">Buscar produtos</Link></li>
              <li><Link href="#">Ofertas relâmpago</Link></li>
              <li><Link href="#">Categorias</Link></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 h-px bg-gray-800" />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-400">
          <div>© {new Date().getFullYear()} Guia das Bancas. Todos os direitos reservados.</div>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-white">Privacidade</Link>
            <Link href="#" className="hover:text-white">Termos de uso</Link>
            <Link href="#" className="hover:text-white">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
