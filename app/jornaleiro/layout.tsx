import { ReactNode } from "react";
import AuthProviders from "@/components/AuthProviders";
import JornaleiroLayoutClient from "@/components/jornaleiro/JornaleiroLayoutClient";

export default function JornaleiroLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProviders>
      <JornaleiroLayoutClient>{children}</JornaleiroLayoutClient>
    </AuthProviders>
  );
}
