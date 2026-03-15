"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PlanCheckoutModal from "@/components/jornaleiro/PlanCheckoutModal";
import PlanOverdueCard from "@/components/jornaleiro/PlanOverdueCard";
import PlanPendingActivationCard from "@/components/jornaleiro/PlanPendingActivationCard";
import PlanUpgradeCard from "@/components/jornaleiro/PlanUpgradeCard";
import { getPlanUpgradeHint } from "@/lib/plan-messaging";

type Distribuidor = {
  id: string;
  nome: string;
  url: string;
  descricao: string;
  logo?: string;
  cor: string;
};

const DISTRIBUIDORES: Distribuidor[] = [
  {
    id: "panini",
    nome: "Brancaleone Publicações",
    url: "https://brancaleonepublicacoes.meuspedidos.com.br/",
    descricao: "Revistas, gibis, cards colecionáveis e produtos licenciados",
    cor: "bg-blue-600"
  },
  {
    id: "branca-leone",
    nome: "Bambino distribuidora",
    url: "https://jornaleiro.meuspedidos.com.br/",
    descricao: "Jornais, revistas e publicações especializadas",
    cor: "bg-green-600"
  }
];

export default function DistribuidoresPage() {
  const [loadingAccess, setLoadingAccess] = useState(true);
  const [hasPartnerAccess, setHasPartnerAccess] = useState(false);
  const [planName, setPlanName] = useState("Free");
  const [planType, setPlanType] = useState("free");
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [paidFeaturesLockedUntilPayment, setPaidFeaturesLockedUntilPayment] = useState(false);
  const [requestedPlanName, setRequestedPlanName] = useState<string | null>(null);
  const [overdueFeaturesLocked, setOverdueFeaturesLocked] = useState(false);
  const [overdueInGracePeriod, setOverdueInGracePeriod] = useState(false);
  const [overdueGraceEndsAt, setOverdueGraceEndsAt] = useState<string | null>(null);
  const [contractedPlanName, setContractedPlanName] = useState<string | null>(null);

  useEffect(() => {
    const loadAccess = async () => {
      try {
        const res = await fetch("/api/jornaleiro/banca", {
          cache: "no-store",
          credentials: "include",
        });
        const json = await res.json();
        if (json?.success && json?.data) {
          setHasPartnerAccess(Boolean(json.data?.entitlements?.can_access_partner_directory));
          setPlanName(json.data?.plan?.name || "Free");
          setPlanType(json.data?.entitlements?.plan_type || json.data?.plan?.type || "free");
          setPaidFeaturesLockedUntilPayment(json.data?.entitlements?.paid_features_locked_until_payment === true);
          setRequestedPlanName(json.data?.requested_plan?.name || null);
          setOverdueFeaturesLocked(json.data?.entitlements?.overdue_features_locked === true);
          setOverdueInGracePeriod(json.data?.entitlements?.overdue_in_grace_period === true);
          setOverdueGraceEndsAt(json.data?.entitlements?.overdue_grace_ends_at || null);
          setContractedPlanName(json.data?.subscription?.plan?.name || null);
        }
      } catch (error) {
        console.error("[Distribuidores] Erro ao carregar acesso:", error);
      } finally {
        setLoadingAccess(false);
      }
    };

    loadAccess();
  }, []);

  const partnerUpgradeHint = getPlanUpgradeHint({
    currentPlanType: planType,
    currentPlanName: planName,
    context: "partner-network",
  });
  const canInlineUpgrade = Boolean(partnerUpgradeHint.targetPlanType);
  const availablePartners = DISTRIBUIDORES.length;
  const currentAccessLabel = hasPartnerAccess ? "Liberado" : paidFeaturesLockedUntilPayment ? "Aguardando pagamento" : "Bloqueado pelo plano";
  const nextOperationalStep = hasPartnerAccess
    ? "Abrir um parceiro e começar a montar a reposição da banca."
    : "Ativar o acesso parceiro para incluir distribuidores na rotina da banca.";

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#ff5c00]">
          Abastecimento e crescimento
        </p>
        <h1 className="mt-1 text-2xl font-bold text-gray-900">Rede de distribuidores</h1>
        <p className="mt-1 max-w-3xl text-gray-600">
          Esta área organiza a reposição da banca. O objetivo aqui é ampliar sortimento, encontrar parceiros certos e
          reduzir ruptura de estoque conforme o momento do seu negócio.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">Parceiros disponíveis</div>
          <div className="mt-3 text-2xl font-semibold text-gray-900">{availablePartners}</div>
          <p className="mt-1 text-sm text-gray-500">Distribuidores já preparados para atender a banca.</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">Acesso do plano</div>
          <div className="mt-3 text-2xl font-semibold text-gray-900">{currentAccessLabel}</div>
          <p className="mt-1 text-sm text-gray-500">Situação atual da sua rede parceira dentro do plano.</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">Plano atual</div>
          <div className="mt-3 text-2xl font-semibold text-gray-900">{planName}</div>
          <p className="mt-1 text-sm text-gray-500">Base que define o alcance da banca na rede de supply.</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">Próximo passo</div>
          <div className="mt-3 text-sm font-semibold leading-6 text-gray-900">{nextOperationalStep}</div>
        </div>
      </div>

      {loadingAccess ? (
        <div className="rounded-2xl border border-dashed border-gray-300 px-4 py-6 text-sm text-gray-500">
          Validando os acessos do seu plano...
        </div>
      ) : overdueFeaturesLocked || overdueInGracePeriod ? (
        <PlanOverdueCard
          planName={contractedPlanName || planName}
          graceEndsAt={overdueGraceEndsAt}
          accessSuspended={overdueFeaturesLocked}
          showSupportAction
        />
      ) : paidFeaturesLockedUntilPayment && requestedPlanName ? (
        <PlanPendingActivationCard requestedPlanName={requestedPlanName} showSupportAction />
      ) : !hasPartnerAccess ? (
        <PlanUpgradeCard
          currentPlanType={planType}
          currentPlanName={planName}
          context="partner-network"
          showSupportAction
          onPrimaryAction={canInlineUpgrade ? () => setUpgradeModalOpen(true) : undefined}
        />
      ) : (
        <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-900">
          <div className="font-semibold">Rede parceira liberada</div>
          <p className="mt-1">
            Seu plano já permite navegar pelos distribuidores disponíveis na plataforma. Escolha um parceiro abaixo para continuar.
          </p>
        </div>
      )}

      <div className={`grid grid-cols-1 gap-6 md:grid-cols-2 ${!loadingAccess && !hasPartnerAccess ? "opacity-60" : ""}`}>
        {DISTRIBUIDORES.map((distribuidor) => (
          <div
            key={distribuidor.id}
            className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
          >
            {/* Header do Card */}
            <div className={`${distribuidor.cor} px-6 py-4`}>
              <h3 className="text-lg font-semibold text-white">
                {distribuidor.nome}
              </h3>
            </div>

            {/* Conteúdo do Card */}
            <div className="p-6">
              <p className="text-gray-600 text-sm mb-4">
                {distribuidor.descricao}
              </p>

              <div className="space-y-3">
                {/* URL do Catálogo */}
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <span className="truncate">{distribuidor.url}</span>
                </div>

                {/* Botões de Ação */}
                <div className="flex gap-3 pt-2">
                  {hasPartnerAccess ? (
                    <Link
                      href={`/jornaleiro/distribuidores/${distribuidor.id}`}
                      className={`flex-1 ${distribuidor.cor} text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity text-center`}
                    >
                      Acessar Catálogo
                    </Link>
                  ) : (
                    <Link
                      href="/jornaleiro/meu-plano"
                      onClick={(event) => {
                        if (!paidFeaturesLockedUntilPayment && canInlineUpgrade) {
                          event.preventDefault();
                          setUpgradeModalOpen(true);
                        }
                      }}
                      className="flex-1 rounded-lg bg-gray-900 px-4 py-2 text-center text-sm font-medium text-white hover:opacity-90 transition-opacity"
                    >
                      {paidFeaturesLockedUntilPayment || overdueFeaturesLocked ? "Ver cobrança do plano" : canInlineUpgrade ? "Ativar acesso parceiro" : "Ver planos"}
                    </Link>
                  )}
                  
                  <a
                    href={distribuidor.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium transition-colors ${
                      hasPartnerAccess ? "hover:bg-gray-50" : "pointer-events-none cursor-not-allowed bg-gray-100 text-gray-400"
                    }`}
                    title={hasPartnerAccess ? "Abrir em nova aba" : "Disponível apenas para planos com rede parceira"}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Footer com informações adicionais */}
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Catálogo online disponível</span>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Ativo</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="text-sm font-medium text-blue-900 mb-1">
              Como usar a rede parceira
            </h4>
            <p className="text-sm text-blue-700">
              {hasPartnerAccess
                ? 'Abra o parceiro, avalie o sortimento que falta na sua banca e use a rede como ferramenta de abastecimento, não só como navegação. O ideal é revisar mix, ruptura e oportunidade antes de cada pedido.'
                : 'A rede parceira é liberada conforme o plano da banca. Assim que o acesso for ativado, esta área vira uma central de abastecimento para ampliar mix e reduzir falta de produto.'}
            </p>
          </div>
        </div>
      </div>

      <PlanCheckoutModal
        open={upgradeModalOpen}
        targetPlanType={partnerUpgradeHint.targetPlanType}
        onClose={() => setUpgradeModalOpen(false)}
        onSuccess={async () => {
          const res = await fetch("/api/jornaleiro/banca", {
            cache: "no-store",
            credentials: "include",
          });
          const json = await res.json();
          if (json?.success && json?.data) {
            setHasPartnerAccess(Boolean(json.data?.entitlements?.can_access_partner_directory));
            setPlanName(json.data?.plan?.name || "Free");
            setPlanType(json.data?.entitlements?.plan_type || json.data?.plan?.type || "free");
            setPaidFeaturesLockedUntilPayment(json.data?.entitlements?.paid_features_locked_until_payment === true);
            setRequestedPlanName(json.data?.requested_plan?.name || null);
          }
        }}
      />
    </div>
  );
}
