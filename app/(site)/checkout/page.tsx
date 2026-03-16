import { Suspense } from "react";
import CheckoutPageClient from "@/components/CheckoutPageClient";

export const dynamic = "force-dynamic";

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="container-max py-10">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 rounded bg-gray-200" />
            <div className="h-40 rounded bg-gray-200" />
            <div className="h-64 rounded bg-gray-200" />
          </div>
        </div>
      }
    >
      <CheckoutPageClient />
    </Suspense>
  );
}
