'use client';

import Image from "next/image";

export type VendorBannerData = {
  id?: string;
  title: string;
  subtitle: string;
  description: string;
  button_text: string;
  button_link: string;
  image_url: string;
  background_color: string;
  text_color: string;
  button_color: string;
  button_text_color: string;
  overlay_opacity: number;
  text_position: string;
  active: boolean;
};

type VendorBannerCardProps = {
  banner: VendorBannerData;
  className?: string;
  preview?: boolean;
  layout?: "contained" | "full";
};

export default function VendorBannerCard({
  banner,
  className = "",
  preview = false,
  layout = "contained",
}: VendorBannerCardProps) {
  const isValidImageUrl =
    !!banner.image_url &&
    banner.image_url.length > 15 &&
    (banner.image_url.includes(".jpg") ||
      banner.image_url.includes(".jpeg") ||
      banner.image_url.includes(".png") ||
      banner.image_url.includes(".webp"));

  const widthClass = layout === "full" ? "w-full" : "mx-auto w-full max-w-4xl";
  const roundedClass = layout === "full" ? "rounded-none sm:rounded-2xl" : "rounded-2xl";

  return (
    <div className={`${widthClass} ${className}`.trim()}>
      <div className={`relative w-full overflow-hidden shadow-lg ${roundedClass}`}>
        <div className="relative h-[280px] w-full sm:h-[320px] lg:h-[360px]">
          {isValidImageUrl ? (
            <div className="relative w-full h-full">
              <Image
                src={banner.image_url}
                alt={banner.title}
                fill
                className="object-cover object-[100%_0%] sm:object-[100%_30%]"
                unoptimized
                priority={!preview}
              />
            </div>
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <div className="text-center px-4">
                <span className="text-gray-500 block mb-2">
                  {banner.image_url && banner.image_url.length > 0
                    ? `Digitando... (${banner.image_url?.length || 0} chars)`
                    : "Cole uma URL de imagem para preview"}
                </span>
                {banner.image_url && banner.image_url.length > 10 && (
                  <span className="text-xs text-gray-400 break-all">
                    {banner.image_url.substring(0, 50)}...
                  </span>
                )}
              </div>
            </div>
          )}
          <div
            className="absolute inset-0 flex flex-col items-start justify-end gap-2 bg-gradient-to-b from-black/45 to-black/25 px-4 pb-6 text-white sm:px-6 sm:pb-7 md:justify-center md:px-8 md:pb-8"
            style={{ color: banner.text_color }}
          >
            <h3 className="max-w-[18rem] text-[2.25rem] font-semibold leading-[0.95] sm:max-w-[24rem] sm:text-[2.75rem] md:max-w-[32rem] md:text-5xl">
              {banner.title}
            </h3>
            <div className="max-w-[18rem] text-lg font-semibold leading-tight sm:max-w-[24rem] sm:text-xl md:max-w-[32rem] md:text-2xl">
              {banner.subtitle}
            </div>
            <p className="max-w-[18rem] text-sm opacity-90 sm:max-w-[26rem] sm:text-base md:max-w-2xl">
              {banner.description}
            </p>
            {banner.active && (
              <div
                className="inline-flex items-center justify-center rounded-md text-sm font-semibold px-4 py-2 shadow"
                style={{
                  backgroundColor: banner.button_color || "#FFFFFF",
                  color: banner.button_text_color || "#FF5C00",
                }}
              >
                {banner.button_text}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
