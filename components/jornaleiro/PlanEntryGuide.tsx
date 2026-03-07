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
        <h3 className={`mt-3 font-semibold text-gray-900 ${compact ? "text-base" : "text-lg"}`}>
          Seu cadastro já começa no Free
        </h3>
        <p className={`mt-2 text-gray-600 ${compact ? "text-sm" : "text-sm sm:text-base"}`}>
          O foco agora é colocar a banca no ar, cadastrar produtos e começar a operar. Outros planos só aparecem
          depois, quando realmente fizerem sentido para o seu momento.
        </p>
      </div>

      <div className="mt-4 rounded-2xl border border-green-200 bg-green-50 p-4 text-green-900">
        <div className="inline-flex rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-green-700">
          Free ativado automaticamente
        </div>
        <ul className="mt-3 space-y-2 text-sm leading-6">
          <li className="flex items-start gap-2">
            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-current opacity-70" />
            <span>Você não precisa escolher plano nem pagar nada agora para entrar no painel.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-current opacity-70" />
            <span>Primeiro você organiza o básico da banca: cadastro, horário, contato e primeiros produtos.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-current opacity-70" />
            <span>Se depois precisar de mais capacidade ou distribuidores, o painel mostra isso no momento certo.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
