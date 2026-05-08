"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RECURRING_BILLING_ENABLED } from "@/lib/jornaleiro-billing";

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

function getBlockedDestination(source: string) {
  if (RECURRING_BILLING_ENABLED) {
    return "/jornaleiro/dashboard";
  }

  return "/jornaleiro/dashboard";
}

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
          router.replace(getBlockedDestination(source));
          return;
        }

        const hasAccess = json?.data?.entitlements?.[entitlementKey] === true;

        if (!cancelled) {
          setAllowed(hasAccess);
          setGuarding(false);
        }

        if (!hasAccess) {
          router.replace(getBlockedDestination(source));
        }
      } catch {
        if (!cancelled) {
          setAllowed(false);
          setGuarding(false);
        }
        router.replace(getBlockedDestination(source));
      }
    }

    checkAccess();

    return () => {
      cancelled = true;
    };
  }, [entitlementKey, router, source]);

  return { guarding, allowed };
}
