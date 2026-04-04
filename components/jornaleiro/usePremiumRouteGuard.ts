"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type BancaEntitlementsPayload = {
  can_access_campaigns?: boolean;
  can_manage_collaborators?: boolean;
  can_access_distributor_catalog?: boolean;
  can_access_partner_directory?: boolean;
};

type BancaAccessResponse = {
  success?: boolean;
  data?: {
    entitlements?: BancaEntitlementsPayload;
  };
};

type PremiumEntitlementKey = keyof BancaEntitlementsPayload;

type UsePremiumRouteGuardParams = {
  entitlementKey: PremiumEntitlementKey;
  source: string;
};

export function usePremiumRouteGuard({ entitlementKey, source }: UsePremiumRouteGuardParams) {
  const router = useRouter();
  const [guarding, setGuarding] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function checkAccess() {
      try {
        const res = await fetch("/api/jornaleiro/banca", {
          cache: "no-store",
          credentials: "include",
        });
        const json = (await res.json().catch(() => ({}))) as BancaAccessResponse;

        if (!res.ok || !json?.success) {
          if (!cancelled) {
            setAllowed(false);
            setGuarding(false);
          }
          router.replace(`/jornaleiro/meu-plano?source=${encodeURIComponent(source)}`);
          return;
        }

        const hasAccess = json?.data?.entitlements?.[entitlementKey] === true;

        if (!cancelled) {
          setAllowed(hasAccess);
          setGuarding(false);
        }

        if (!hasAccess) {
          router.replace(`/jornaleiro/meu-plano?source=${encodeURIComponent(source)}`);
        }
      } catch {
        if (!cancelled) {
          setAllowed(false);
          setGuarding(false);
        }
        router.replace(`/jornaleiro/meu-plano?source=${encodeURIComponent(source)}`);
      }
    }

    checkAccess();

    return () => {
      cancelled = true;
    };
  }, [entitlementKey, router, source]);

  return { guarding, allowed };
}
