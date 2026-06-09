type Props = {
  planName: string;
  graceEndsAt?: string | null;
  accessSuspended?: boolean;
  className?: string;
  showSupportAction?: boolean;
};

export default function PlanOverdueCard(props: Props) {
  const dateLabel = props.graceEndsAt
    ? new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(props.graceEndsAt))
    : null;

  return (
    <div className={`rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-900 ${props.className || ""}`}>
      <div className="font-semibold">
        {props.accessSuspended ? "Recursos do plano suspensos" : "Pagamento em atraso"}
      </div>
      <p className="mt-1 text-red-800">
        {props.accessSuspended
          ? `O ${props.planName} está bloqueado até a regularização.`
          : `O ${props.planName} segue em período de regularização${dateLabel ? ` até ${dateLabel}` : ""}.`}
      </p>
      {props.showSupportAction ? (
        <a
          href="https://wa.me/5511915700240"
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex rounded-md bg-red-600 px-3 py-2 text-xs font-semibold text-white"
        >
          Falar com suporte
        </a>
      ) : null}
    </div>
  );
}
