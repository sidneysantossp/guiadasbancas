import { ReactNode } from "react";
import AuthProviders from "@/components/AuthProviders";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <AuthProviders>{children}</AuthProviders>;
}
