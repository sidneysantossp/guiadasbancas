import type { Route } from "next";
import Link from "next/link";

type RegistrarPageProps = {
  searchParams?: {
    redirect?: string;
  };
};

function getClienteHref(redirect?: string): Route {
  if (!redirect) {
    return "/registrar/cliente";
  }

  return `/registrar/cliente?redirect=${encodeURIComponent(redirect)}` as Route;
}

export default function RegistrarPage({ searchParams }: RegistrarPageProps) {
  const redirect =
    typeof searchParams?.redirect === "string" ? searchParams.redirect : undefined;
  const clienteHref = getClienteHref(redirect);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-white px-4 py-12">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-5xl items-center justify-center">
        <div className="grid w-full gap-6 rounded-[32px] border border-orange-100 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] lg:grid-cols-[1.05fr_0.95fr] lg:p-8">
          <div className="rounded-[28px] bg-[#1f1f1f] px-6 py-8 text-white lg:px-8 lg:py-10">
            <Link href="/" className="inline-flex text-sm font-medium text-orange-200 transition-colors hover:text-white">
              Voltar para a home
            </Link>
            <div className="mt-10 max-w-md">
              <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-orange-200">
                Escolha o cadastro
              </span>
              <h1 className="mt-5 text-3xl font-semibold leading-tight lg:text-4xl">
                Como voce quer usar o Guia das Bancas?
              </h1>
              <p className="mt-4 text-sm leading-6 text-white/75 lg:text-base">
                O cadastro de usuario e o cadastro de jornaleiro sao fluxos
                diferentes. Escolha a opcao correta antes de continuar para
                evitar bloqueio de e-mail e confusao na aprovacao da banca.
              </p>
            </div>
            <div className="mt-8 space-y-3 text-sm text-white/80">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                Cliente: para comprar, favoritar e acompanhar pedidos.
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                Jornaleiro: para cadastrar banca, enviar dados e aguardar
                aprovacao.
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[28px] border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-[#ff5c00]">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5z" />
                  <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
                </svg>
              </div>
              <h2 className="mt-5 text-2xl font-semibold text-gray-900">
                Sou usuario
              </h2>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                Quero criar uma conta para comprar produtos, salvar favoritos e
                acompanhar meus pedidos.
              </p>
              <Link
                href={clienteHref}
                className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-[#ff5c00] px-4 py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-95"
              >
                Continuar como usuario
              </Link>
            </div>

            <div className="rounded-[28px] border border-gray-200 bg-[#fff7f2] p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M4 7h16" />
                  <path d="M6 7v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7" />
                  <path d="M9 11h6" />
                  <path d="M9 15h4" />
                </svg>
              </div>
              <h2 className="mt-5 text-2xl font-semibold text-gray-900">
                Sou jornaleiro
              </h2>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                Quero cadastrar minha banca, preencher os dados do negocio e
                seguir para o onboarding correto.
              </p>
              <Link
                href={("/jornaleiro/registrar" as Route)}
                className="mt-6 inline-flex w-full items-center justify-center rounded-2xl border border-gray-900 bg-white px-4 py-3.5 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-50"
              >
                Continuar como jornaleiro
              </Link>
            </div>

            <p className="px-2 text-center text-sm text-gray-500">
              Ja tem conta?{" "}
              <Link href={("/entrar" as Route)} className="font-medium text-[#ff5c00] hover:text-[#e65300]">
                Fazer login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
