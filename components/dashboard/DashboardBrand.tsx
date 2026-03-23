type DashboardBrandProps = {
  className?: string;
};

import DashboardOfficialLogo from "@/components/dashboard/DashboardOfficialLogo";

export default function DashboardBrand({ className = "" }: DashboardBrandProps) {
  return <DashboardOfficialLogo className={className} />;
}
