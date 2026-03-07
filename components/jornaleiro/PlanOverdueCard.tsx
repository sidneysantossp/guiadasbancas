import Link from "next/link";

type Props = {
  planName: string;
  graceEndsAt?: string | null;
  accessSuspended?: boolean;
  className?: string;
  showSupportAction?: boolean;
};

export default function PlanOverdueCard({
  planName,
  graceEndsAt,
  accessSuspended = false,
  className = "",
  showSupportAction = false,
}: Props) {
  return (
    <div
      className={`rounded-2xl border p-5 shadow-sm ${
        accessSuspended
          ? "border-red-200 bg-red-50 text-red-950"
          : "border-amber-200 bg-amber-50 text-amber-950"
      } ${className}`.trim()}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-red-700">
          Cobrança em aberto
        </span>
        <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#ff5c00]">
          {planName}
        </span>
      </div>

      <h3 className="mt-3 text-lg font-semibold">
        {accessSuspended ? "Os recursos pagos foram pausados" : "Sua assinatura está em carência"}
      </h3>
      <p className="mt-2 text-sm leading-6 opacity-90">
        {accessSuspended
          ? `A cobrança do plano ${planName} não foi regularizada a tempo. Por isso, os recursos pagos foram pausados até a confirmação do pagamento.`
          : `Há uma cobrança em aberto no plano ${planName}. Enquanto a carência estiver ativa, você ainda consegue usar os recursos pagos normalmente.`}
      </p>

      <ul className="mt-4 space-y-2 text-sm">
        <li className="flex items-start gap-2">
          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-current opacity-70" />
          <span>Abra a cobrança do plano para regularizar o pagamento.</span>
        </li>
        {graceEndsAt && !accessSuspended ? (
          <li className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-current opacity-70" />
            <span>
              A carência termina em <strong>{new Date(graceEndsAt).toLocaleDateString("pt-BR")}</strong>.
            </span>
          </li>
        ) : (
          <li className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-current opacity-70" />
            <span>Assim que o pagamento confirmar, os recursos pagos voltam automaticamente.</span>
          </li>
        )}
        <li className="flex items-start gap-2">
          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-current opacity-70" />
          <span>Você pode acompanhar tudo na tela do seu plano dentro do painel.</span>
        </li>
      </ul>

      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          href="/jornaleiro/meu-plano"
          className="inline-flex items-center justify-center rounded-xl bg-[#ff5c00] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#ff7a33]"
        >
          Ver cobrança do plano
        </Link>
        {showSupportAction ? (
          <a
            href="https://wa.me/5511994683425?text=Ol%C3%A1!%20Tenho%20uma%20cobran%C3%A7a%20em%20aberto%20no%20meu%20plano%20e%20preciso%20de%20ajuda."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-xl border border-current/15 bg-white px-4 py-2.5 text-sm font-semibold transition hover:bg-white/80"
          >
            Falar com a equipe
          </a>
        ) : null}
      </div>
    </div>
  );
}
