import { ReactNode } from "react";
import AuthProviders from "@/components/AuthProviders";
import JournaleiroLayoutClient from "@/components/jornaleiro/JornaleiroLayoutClient";

export default function JournaleiroLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProviders>
      <JornaleiroLayoutClient>{children}</JornaleiroLayoutClient>
    </AuthProviders>
  );
}
