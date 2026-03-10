export async function fetchAdminWithDevFallback(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const requestInitWithDefaults: RequestInit = {
    cache: init?.cache ?? 'no-store',
    credentials: init?.credentials ?? 'include',
    ...init,
  };

  const alreadyHasAuthHeader = hasAuthorizationHeader(init?.headers);
  const devTokenWasAttached =
    shouldAllowDevAdminFallback() &&
    !alreadyHasAuthHeader &&
    isAdminApiRequest(input);

  const firstRequestInit = devTokenWasAttached
    ? {
        ...requestInitWithDefaults,
        headers: mergeHeaders(requestInitWithDefaults.headers, {
          Authorization: 'Bearer admin-token',
        }),
      }
    : requestInitWithDefaults;

  const firstResponse = await fetch(input, firstRequestInit);

  const shouldRetryWithDevToken =
    firstResponse.status === 401 &&
    shouldAllowDevAdminFallback() &&
    !alreadyHasAuthHeader &&
    !devTokenWasAttached;

  if (!shouldRetryWithDevToken) return firstResponse;

  const headers = mergeHeaders(requestInitWithDefaults.headers, {
    Authorization: 'Bearer admin-token',
  });

  return fetch(input, {
    ...requestInitWithDefaults,
    headers,
  });
}

function shouldAllowDevAdminFallback(): boolean {
  if (process.env.NODE_ENV !== 'production') return true;

  if (typeof window !== 'undefined') {
    return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  }

  return false;
}

function isAdminApiRequest(input: RequestInfo | URL): boolean {
  const url = inputToUrlString(input);
  return url.includes('/api/admin/');
}

function inputToUrlString(input: RequestInfo | URL): string {
  if (typeof input === 'string') return input;
  if (input instanceof URL) return input.toString();
  return input.url || '';
}

function hasAuthorizationHeader(headers?: HeadersInit): boolean {
  if (!headers) return false;

  if (headers instanceof Headers) {
    return headers.has('Authorization') || headers.has('authorization');
  }

  if (Array.isArray(headers)) {
    return headers.some(([key]) => key.toLowerCase() === 'authorization');
  }

  return Object.keys(headers).some((key) => key.toLowerCase() === 'authorization');
}

function mergeHeaders(
  originalHeaders: HeadersInit | undefined,
  extraHeaders: Record<string, string>
): Headers {
  const merged = new Headers(originalHeaders);
  for (const [key, value] of Object.entries(extraHeaders)) {
    merged.set(key, value);
  }
  return merged;
}
