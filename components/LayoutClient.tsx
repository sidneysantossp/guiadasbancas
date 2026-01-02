"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import AppFooter from "@/components/AppFooter";
import FloatingCart from "@/components/FloatingCart";
import CookieConsent from "@/components/CookieConsent";

export default function LayoutClient({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');
  const isJornaleiroRoute = pathname?.startsWith('/jornaleiro');
  const isDistribuidorRoute = pathname?.startsWith('/distribuidor');
  const isLoginPage = pathname === '/entrar';
  const shouldHideNavbar = isAdminRoute || isJornaleiroRoute || isDistribuidorRoute || isLoginPage;

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      <main className={!shouldHideNavbar ? "pt-[140px] md:pt-[80px]" : ""}>
        {children}
      </main>
      {!shouldHideNavbar && <AppFooter />}
      {!shouldHideNavbar && <FloatingCart />}
      {!shouldHideNavbar && <CookieConsent />}
    </>
  );
}
