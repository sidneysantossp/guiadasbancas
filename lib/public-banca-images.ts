import { sanitizePublicImageUrl } from "@/lib/sanitizePublicImageUrl";

export const DEFAULT_PUBLIC_BANCA_COVER = "/placeholder/banca-cover.svg";
export const DEFAULT_PUBLIC_BANCA_AVATAR = "/placeholder/banca-avatar.svg";

type PublicBancaImageInput = {
  cover?: unknown;
  coverImage?: unknown;
  avatar?: unknown;
  profileImage?: unknown;
  logoUrl?: unknown;
};

function firstValidImage(...values: unknown[]) {
  for (const value of values) {
    const image = sanitizePublicImageUrl(value);
    if (image) return image;
  }

  return "";
}

export function resolvePublicBancaCover(input: PublicBancaImageInput) {
  return (
    firstValidImage(input.cover, input.coverImage, input.profileImage, input.avatar, input.logoUrl) ||
    DEFAULT_PUBLIC_BANCA_COVER
  );
}

export function resolvePublicBancaAvatar(input: PublicBancaImageInput) {
  return (
    firstValidImage(input.avatar, input.profileImage, input.logoUrl, input.coverImage, input.cover) ||
    DEFAULT_PUBLIC_BANCA_AVATAR
  );
}
