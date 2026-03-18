"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { hydrateDistribuidorClientAuth } from "@/lib/distribuidor-client-auth";

type UseDistribuidorSessionOptions = {
  enabled?: boolean;
  redirectToLogin?: boolean;
  loginPath?: string;
};

export function useDistribuidorSession(options: UseDistribuidorSessionOptions = {}) {
  const {
    enabled = true,
    redirectToLogin = false,
    loginPath = "/distribuidor/login",
  } = options;
  const router = useRouter();
  const [distribuidor, setDistribuidor] = useState<any>(null);
  const [loading, setLoading] = useState(enabled);

  useEffect(() => {
    let cancelled = false;

    if (!enabled) {
      setDistribuidor(null);
      setLoading(false);
      return () => {
        cancelled = true;
      };
    }

    setLoading(true);

    void hydrateDistribuidorClientAuth()
      .then((sessionDistribuidor) => {
        if (cancelled) return;

        if (!sessionDistribuidor?.id) {
          setDistribuidor(null);
          setLoading(false);

          if (redirectToLogin) {
            router.replace(loginPath);
          }
          return;
        }

        setDistribuidor(sessionDistribuidor);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;

        setDistribuidor(null);
        setLoading(false);

        if (redirectToLogin) {
          router.replace(loginPath);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [enabled, loginPath, redirectToLogin, router]);

  return {
    distribuidor,
    loading,
  };
}
