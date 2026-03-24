import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

type MinhaContaPageProps = {
  searchParams?: {
    redirect?: string;
    checkout?: string;
  };
};

export default function MinhaContaPage({ searchParams }: MinhaContaPageProps) {
  const params = new URLSearchParams();

  if (typeof searchParams?.redirect === "string" && searchParams.redirect) {
    params.set("redirect", searchParams.redirect);
  }

  if (typeof searchParams?.checkout === "string" && searchParams.checkout) {
    params.set("checkout", searchParams.checkout);
  }

  const suffix = params.toString();
  redirect(suffix ? `/minha-conta/inteligencia?${suffix}` : "/minha-conta/inteligencia");
}
