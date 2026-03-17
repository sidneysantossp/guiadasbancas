const SHARED_NO_STORE_HEADERS = {
  Pragma: "no-cache",
  Expires: "0",
  "Surrogate-Control": "no-store",
} as const;

export function buildNoStoreHeaders(options?: {
  isPrivate?: boolean;
  vary?: string | null;
  extra?: HeadersInit;
}): HeadersInit {
  const headers = new Headers({
    "Cache-Control": options?.isPrivate
      ? "no-store, no-cache, must-revalidate, proxy-revalidate, private"
      : "no-store, no-cache, must-revalidate, proxy-revalidate",
    ...SHARED_NO_STORE_HEADERS,
  });

  if (options?.vary) {
    headers.set("Vary", options.vary);
  }

  if (options?.extra) {
    const extra = new Headers(options.extra);
    extra.forEach((value, key) => {
      headers.set(key, value);
    });
  }

  return Object.fromEntries(headers.entries());
}
