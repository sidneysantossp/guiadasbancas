type Props = {
  requestedPlanName: string;
  className?: string;
  showSupportAction?: boolean;
};

export default function PlanPendingActivationCard(props: Props) {
  return (
    <div className={`rounded-lg border border-orange-200 bg-orange-50 p-4 text-sm text-orange-900 ${props.className || ""}`}>
      <div className="font-semibold">Plano aguardando pagamento</div>
      <p className="mt-1 text-orange-800">
        A liberação do {props.requestedPlanName} acontece automaticamente assim que o pagamento for confirmado.
      </p>
      {props.showSupportAction ? (
        <a
          href="https://wa.me/5511915700240"
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex rounded-md bg-[#ff5c00] px-3 py-2 text-xs font-semibold text-white"
        >
          Falar com suporte
        </a>
      ) : null}
    </div>
  );
}
