import Image from "next/image";

type DashboardBrandProps = {
  className?: string;
};

export default function DashboardBrand({ className = "" }: DashboardBrandProps) {
  return (
    <span className={`flex shrink-0 items-center ${className}`}>
      <Image
        src="/images/logo-default.svg"
        alt="Guia das Bancas"
        width={156}
        height={48}
        priority
        className="h-10 w-auto shrink-0 sm:h-12"
      />
    </span>
  );
}
