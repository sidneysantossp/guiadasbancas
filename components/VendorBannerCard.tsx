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
};

export default function VendorBannerCard({
  banner,
  className = "",
  preview = false,
}: VendorBannerCardProps) {
  const isValidImageUrl =
    !!banner.image_url &&
    banner.image_url.length > 15 &&
    (banner.image_url.includes(".jpg") ||
      banner.image_url.includes(".jpeg") ||
      banner.image_url.includes(".png") ||
      banner.image_url.includes(".webp"));

  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`.trim()}>
      <div className="relative w-full overflow-hidden rounded-2xl shadow-lg">
        <div className="relative h-96 sm:h-64 md:h-72 w-full">
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
            className="absolute inset-0 bg-gradient-to-b from-black/45 to-black/25 px-3 sm:px-5 md:px-8 text-white flex flex-col items-start justify-end md:justify-center gap-2 sm:gap-3 pb-6 sm:pb-6 md:pb-8"
            style={{ color: banner.text_color }}
          >
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight">
              {banner.title}
            </h3>
            <div className="text-lg sm:text-xl md:text-2xl font-semibold leading-tight">
              {banner.subtitle}
            </div>
            <p className="text-sm sm:text-base max-w-2xl opacity-90">
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
