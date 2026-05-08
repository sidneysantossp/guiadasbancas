"use client";

type Props = {
  open: boolean;
  targetPlanType?: string | null;
  bancaName?: string | null;
  onClose: () => void;
  onSuccess?: () => void | Promise<void>;
};

export default function PlanCheckoutModal(props: Props) {
  void props;
  return null;
}
