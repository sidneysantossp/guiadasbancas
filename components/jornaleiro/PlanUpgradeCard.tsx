"use client";

import type { UpgradeContext } from "@/lib/plan-messaging";

type Props = {
  currentPlanType: string | null | undefined;
  currentPlanName?: string | null;
  context: UpgradeContext;
  productLimit?: number | null;
  currentCount?: number | null;
  targetPlanPriceLabel?: string | null;
  targetPlanPromotionLabel?: string | null;
  targetPlanTrialDays?: number | null;
  targetPlanTrialAvailable?: boolean | null;
  className?: string;
  showSupportAction?: boolean;
  primaryHref?: string;
  onPrimaryAction?: () => void;
};

export default function PlanUpgradeCard(props: Props) {
  void props;
  return null;
}
