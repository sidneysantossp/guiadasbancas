import { ReactNode, Suspense } from "react";
import AuthProviders from "@/components/AuthProviders";
import JornaleiroLayoutClient from "@/components/jornaleiro/JornaleiroLayoutClient";

export default function JornaleiroLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProviders>
      <Suspense fallback={<div className="min-h-screen bg-[#F8FAFC]" />}>
        <JornaleiroLayoutClient>{children}</JornaleiroLayoutClient>
      </Suspense>
    </AuthProviders>
  );
}
