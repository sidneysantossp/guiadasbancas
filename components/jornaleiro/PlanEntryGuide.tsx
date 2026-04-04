"use client";

type Props = {
  compact?: boolean;
  className?: string;
};

export default function PlanEntryGuide({ compact = false, className = "" }: Props) {
  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-gray-50 ${compact ? "p-4" : "p-5 sm:p-6"} ${className}`.trim()}
    >
      <div className="max-w-2xl">
        <div className="inline-flex items-center rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#ff5c00]">
          Plano inicial da banca
        </div>
          {!compact ? (
            <h3 className="mt-3 text-lg font-semibold text-gray-900">
              Seu cadastro começa no plano Free
            </h3>
          ) : null}
          <p className={`${compact ? "mt-0 text-sm" : "mt-2 text-sm sm:text-base"} text-gray-600`}>
            Sua banca entra sem cobrança no plano Free, com espaço para publicar até 10 produtos próprios e organizar a operação inicial.
          </p>
      </div>

      {!compact ? (
        <div className="mt-4 rounded-2xl border border-green-200 bg-green-50 p-4 text-green-900">
          <div className="inline-flex rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-green-700">
            Plano inicial sem cobrança
          </div>
          <ul className="mt-3 space-y-2 text-sm leading-6">
            <li className="flex items-start gap-2">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-current opacity-70" />
              <span>O plano Free libera o cadastro da banca, a página pública e até 10 produtos próprios.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-current opacity-70" />
              <span>Primeiro você organiza o básico da banca: cadastro, horário, contato e primeiros produtos.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-current opacity-70" />
              <span>Para ativar o catálogo dos distribuidores e ampliar o cadastro manual de produtos, a banca precisa assinar o plano Premium.</span>
            </li>
          </ul>
        </div>
      ) : null}
    </div>
  );
}
