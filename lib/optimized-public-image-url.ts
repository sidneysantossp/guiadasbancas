import { sanitizePublicImageUrl } from "@/lib/sanitizePublicImageUrl";

type ResizeMode = "cover" | "contain" | "fill";

type OptimizedImageOptions = {
  width?: number;
  height?: number;
  quality?: number;
  resize?: ResizeMode;
};

function isSvgPath(pathname: string) {
  return pathname.toLowerCase().endsWith(".svg");
}

function setNumericParam(params: URLSearchParams, key: string, value: number | undefined) {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) {
    params.set(key, String(Math.round(value)));
  }
}

function dedupeRepeatedParam(url: URL, key: string) {
  const values = url.searchParams.getAll(key);
  if (values.length <= 1) return;

  const latestValue = values[values.length - 1];
  url.searchParams.delete(key);
  url.searchParams.set(key, latestValue);
}

export function getOptimizedPublicImageUrl(
  value: unknown,
  options: OptimizedImageOptions = {}
): string {
  const src = sanitizePublicImageUrl(value);
  if (!src || src.startsWith("/")) return src;

  try {
    const url = new URL(src);
    if (isSvgPath(url.pathname)) return src;

    const width = options.width;
    const height = options.height;
    const quality = options.quality ?? 74;

    if (url.hostname.endsWith(".supabase.co") && url.pathname.includes("/storage/v1/object/public/")) {
      const next = new URL(src);
      dedupeRepeatedParam(next, "v");
      return next.toString();
    }

    if (url.hostname === "images.unsplash.com") {
      const next = new URL(src);
      setNumericParam(next.searchParams, "w", width);
      setNumericParam(next.searchParams, "h", height);
      setNumericParam(next.searchParams, "q", quality);
      if (height) next.searchParams.set("fit", "crop");
      next.searchParams.set("auto", "format");
      return next.toString();
    }

    return src;
  } catch {
    return src;
  }
}

export function getOptimizedPublicImageSrcSet(
  value: unknown,
  widths: number[],
  options: Omit<OptimizedImageOptions, "width"> = {}
): string | undefined {
  const src = sanitizePublicImageUrl(value);
  if (!src || src.startsWith("/")) return undefined;

  const candidates = widths
    .filter((width) => Number.isFinite(width) && width > 0)
    .map((width) => {
      const url = getOptimizedPublicImageUrl(src, { ...options, width });
      return { url, width: Math.round(width) };
    });

  const uniqueUrls = new Set(candidates.map((candidate) => candidate.url));
  if (uniqueUrls.size <= 1) return undefined;

  const uniqueCandidates = Array.from(
    new Map(candidates.map((candidate) => [`${candidate.url} ${candidate.width}w`, candidate])).values()
  );

  return uniqueCandidates.map((candidate) => `${candidate.url} ${candidate.width}w`).join(", ");
}
