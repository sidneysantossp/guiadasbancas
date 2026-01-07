import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export type AsaasEnvironment = "sandbox" | "production";

export type AsaasCustomer = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  cpfCnpj?: string;
  postalCode?: string;
  address?: string;
  addressNumber?: string;
  complement?: string;
  province?: string;
  city?: string;
  state?: string;
};

export type AsaasPayment = {
  id: string;
  customer: string;
  billingType: "BOLETO" | "PIX" | "CREDIT_CARD";
  value: number;
  dueDate: string;
  description?: string;
  externalReference?: string;
  status: string;
  invoiceUrl?: string;
  bankSlipUrl?: string;
  pixQrCode?: {
    encodedImage: string;
    payload: string;
    expirationDate: string;
  };
};

export type AsaasSubscription = {
  id: string;
  customer: string;
  billingType: "BOLETO" | "PIX" | "CREDIT_CARD";
  value: number;
  cycle: "WEEKLY" | "BIWEEKLY" | "MONTHLY" | "QUARTERLY" | "SEMIANNUALLY" | "YEARLY";
  description?: string;
  externalReference?: string;
  status: string;
  nextDueDate: string;
};

async function getAsaasConfig(): Promise<{ apiKey: string; baseUrl: string; environment: AsaasEnvironment }> {
  const { data: settings } = await supabaseAdmin
    .from("system_settings")
    .select("key, value")
    .in("key", ["asaas_api_key", "asaas_environment"]);

  const apiKey = settings?.find(s => s.key === "asaas_api_key")?.value;
  const environment = (settings?.find(s => s.key === "asaas_environment")?.value || "sandbox") as AsaasEnvironment;

  if (!apiKey) {
    throw new Error("API Key do Asaas não configurada");
  }

  const baseUrl = environment === "production"
    ? "https://api.asaas.com/v3"
    : "https://sandbox.asaas.com/api/v3";

  return { apiKey, baseUrl, environment };
}

async function asaasRequest(endpoint: string, options: RequestInit = {}) {
  const { apiKey, baseUrl } = await getAsaasConfig();

  const res = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers: {
      "access_token": apiKey,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const errorMsg = data.errors?.[0]?.description || `Erro ${res.status}`;
    throw new Error(errorMsg);
  }

  return data;
}

// ============ CUSTOMERS ============

export async function createCustomer(customer: {
  name: string;
  email: string;
  cpfCnpj?: string;
  phone?: string;
  externalReference?: string;
}): Promise<AsaasCustomer> {
  return asaasRequest("/customers", {
    method: "POST",
    body: JSON.stringify(customer),
  });
}

export async function findCustomerByEmail(email: string): Promise<AsaasCustomer | null> {
  const data = await asaasRequest(`/customers?email=${encodeURIComponent(email)}`);
  return data.data?.[0] || null;
}

export async function findOrCreateCustomer(customer: {
  name: string;
  email: string;
  cpfCnpj?: string;
  phone?: string;
  externalReference?: string;
}): Promise<AsaasCustomer> {
  const existing = await findCustomerByEmail(customer.email);
  if (existing) return existing;
  return createCustomer(customer);
}

// ============ PAYMENTS ============

export async function createPayment(payment: {
  customer: string;
  billingType: "BOLETO" | "PIX" | "CREDIT_CARD";
  value: number;
  dueDate: string;
  description?: string;
  externalReference?: string;
}): Promise<AsaasPayment> {
  return asaasRequest("/payments", {
    method: "POST",
    body: JSON.stringify(payment),
  });
}

export async function getPayment(paymentId: string): Promise<AsaasPayment> {
  return asaasRequest(`/payments/${paymentId}`);
}

export async function getPaymentPixQrCode(paymentId: string): Promise<{ encodedImage: string; payload: string; expirationDate: string }> {
  return asaasRequest(`/payments/${paymentId}/pixQrCode`);
}

// ============ SUBSCRIPTIONS ============

const BILLING_CYCLE_MAP: Record<string, string> = {
  monthly: "MONTHLY",
  quarterly: "QUARTERLY",
  semiannual: "SEMIANNUALLY",
  annual: "YEARLY",
};

export async function createSubscription(subscription: {
  customer: string;
  billingType: "BOLETO" | "PIX" | "CREDIT_CARD";
  value: number;
  cycle: string;
  nextDueDate: string;
  description?: string;
  externalReference?: string;
}): Promise<AsaasSubscription> {
  return asaasRequest("/subscriptions", {
    method: "POST",
    body: JSON.stringify({
      ...subscription,
      cycle: BILLING_CYCLE_MAP[subscription.cycle] || subscription.cycle,
    }),
  });
}

export async function getSubscription(subscriptionId: string): Promise<AsaasSubscription> {
  return asaasRequest(`/subscriptions/${subscriptionId}`);
}

export async function cancelSubscription(subscriptionId: string): Promise<void> {
  await asaasRequest(`/subscriptions/${subscriptionId}`, {
    method: "DELETE",
  });
}

export async function getSubscriptionPayments(subscriptionId: string): Promise<{ data: AsaasPayment[] }> {
  return asaasRequest(`/subscriptions/${subscriptionId}/payments`);
}

// ============ UTILS ============

export function formatDueDate(date?: Date): string {
  const d = date || new Date();
  d.setDate(d.getDate() + 3); // 3 dias para vencimento padrão
  return d.toISOString().split("T")[0];
}

export { getAsaasConfig };
