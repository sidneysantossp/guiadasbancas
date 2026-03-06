import Image from "next/image";

export default function DashboardOfficialLogo({ className = "" }: { className?: string }) {
  return (
    <span className={`flex shrink-0 items-center ${className}`}>
      <Image
        src="/images/logo-default.svg"
        alt="Guia das Bancas"
        width={172}
        height={52}
        priority
        className="h-auto w-[156px] shrink-0 object-contain sm:w-[172px]"
      />
    </span>
  );
}
