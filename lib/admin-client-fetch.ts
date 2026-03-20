export async function fetchAdminWithDevFallback(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  return fetch(input, {
    cache: init?.cache ?? 'no-store',
    credentials: init?.credentials ?? 'include',
    ...init,
  });
}
