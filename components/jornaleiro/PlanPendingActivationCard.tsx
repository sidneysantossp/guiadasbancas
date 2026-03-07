import Link from "next/link";

type Props = {
  requestedPlanName: string;
  className?: string;
  showSupportAction?: boolean;
};

export default function PlanPendingActivationCard({
  requestedPlanName,
  className = "",
  showSupportAction = false,
}: Props) {
  return (
    <div className={`rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-950 shadow-sm ${className}`.trim()}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-amber-700">
          Upgrade iniciado
        </span>
        <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#ff5c00]">
          {requestedPlanName}
        </span>
      </div>

      <h3 className="mt-3 text-lg font-semibold">Falta só confirmar a primeira cobrança</h3>
      <p className="mt-2 text-sm leading-6 opacity-90">
        Seu upgrade para o plano {requestedPlanName} já foi criado, mas os novos recursos só serão liberados após a confirmação do pagamento inicial.
      </p>

      <ul className="mt-4 space-y-2 text-sm">
        <li className="flex items-start gap-2">
          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-current opacity-70" />
          <span>Abra a cobrança do plano para concluir o pagamento com segurança.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-current opacity-70" />
          <span>Assim que o pagamento confirmar, o novo plano entra em vigor automaticamente.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-current opacity-70" />
          <span>Enquanto isso, sua banca continua usando o plano já liberado anteriormente.</span>
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
            href="https://wa.me/5511994683425?text=Ol%C3%A1!%20Meu%20upgrade%20est%C3%A1%20aguardando%20pagamento%20e%20preciso%20de%20ajuda."
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
