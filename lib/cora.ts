import https from "node:https";
import { randomUUID } from "node:crypto";
import { supabaseAdmin } from "@/lib/supabase";

export type CoraEnvironment = "stage" | "production";

export type CoraConfig = {
  clientId: string;
  certificate: string;
  privateKey: string;
  baseUrl: string;
  environment: CoraEnvironment;
};

export type CoraInvoiceInput = {
  code?: string;
  customer: {
    name: string;
    email: string;
    document?: string | null;
    phone?: string | null;
    address?: {
      street?: string | null;
      number?: string | null;
      district?: string | null;
      city?: string | null;
      state?: string | null;
      zipCode?: string | null;
      complement?: string | null;
    };
  };
  amount: number;
  dueDate: string;
  description: string;
  paymentForms: Array<"PIX" | "BANK_SLIP">;
  externalReference?: string;
};

export type CoraInvoice = {
  id: string;
  code?: string | null;
  status?: string | null;
  invoiceUrl?: string | null;
  bankSlipUrl?: string | null;
  pixCode?: string | null;
  pixQrCodeUrl?: string | null;
  dueDate?: string | null;
  raw: any;
};

function normalizePem(value: string) {
  const trimmed = String(value || "").trim();
  if (!trimmed) return "";

  if (trimmed.includes("-----BEGIN")) {
    return trimmed.replace(/\\n/g, "\n");
  }

  try {
    const decoded = Buffer.from(trimmed, "base64").toString("utf8").trim();
    return decoded.includes("-----BEGIN") ? decoded : trimmed;
  } catch {
    return trimmed;
  }
}

function normalizeEnvironment(value?: string | null): CoraEnvironment {
  return String(value || "").trim().toLowerCase() === "stage" ? "stage" : "production";
}

function baseUrlFor(environment: CoraEnvironment) {
  return environment === "stage"
    ? "https://matls-clients.api.stage.cora.com.br"
    : "https://matls-clients.api.cora.com.br";
}

function tokenPathFor(environment: CoraEnvironment) {
  return environment === "production" ? "/token" : "/oauth/token";
}

async function readSettings(keys: string[]) {
  const { data, error } = await supabaseAdmin
    .from("system_settings")
    .select("key, value")
    .in("key", keys);

  if (error) throw new Error(error.message);

  return new Map((data || []).map((item) => [item.key, item.value || ""]));
}

export async function getCoraConfig(): Promise<CoraConfig> {
  const envClientId = process.env.CORA_CLIENT_ID?.trim();
  const envCertificate = process.env.CORA_CERTIFICATE?.trim();
  const envPrivateKey = process.env.CORA_PRIVATE_KEY?.trim();
  const envEnvironment = normalizeEnvironment(process.env.CORA_ENVIRONMENT || process.env.CORA_ENV);

  if (envClientId && envCertificate && envPrivateKey) {
    return {
      clientId: envClientId,
      certificate: normalizePem(envCertificate),
      privateKey: normalizePem(envPrivateKey),
      baseUrl: baseUrlFor(envEnvironment),
      environment: envEnvironment,
    };
  }

  const settings = await readSettings([
    "cora_client_id",
    "cora_certificate",
    "cora_private_key",
    "cora_environment",
  ]);

  const clientId = settings.get("cora_client_id")?.trim() || "";
  const certificate = normalizePem(settings.get("cora_certificate") || "");
  const privateKey = normalizePem(settings.get("cora_private_key") || "");
  const environment = normalizeEnvironment(settings.get("cora_environment"));

  if (!clientId || !certificate || !privateKey) {
    throw new Error("Credenciais da Cora não configuradas");
  }

  return {
    clientId,
    certificate,
    privateKey,
    baseUrl: baseUrlFor(environment),
    environment,
  };
}

function requestJson<T>(
  config: CoraConfig,
  path: string,
  options: {
    method?: string;
    headers?: Record<string, string>;
    body?: string;
  } = {}
): Promise<T> {
  const url = new URL(path, config.baseUrl);
  const body = options.body || "";

  return new Promise((resolve, reject) => {
    const req = https.request(
      url,
      {
        method: options.method || "GET",
        cert: config.certificate,
        key: config.privateKey,
        headers: {
          Accept: "application/json",
          ...(body ? { "Content-Length": Buffer.byteLength(body) } : {}),
          ...options.headers,
        },
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on("data", (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
        res.on("end", () => {
          const text = Buffer.concat(chunks).toString("utf8");
          const data = text ? safeJson(text) : {};

          if (!res.statusCode || res.statusCode < 200 || res.statusCode >= 300) {
            const message =
              data?.message ||
              data?.error_description ||
              data?.error ||
              data?.errors?.[0]?.message ||
              `Erro ${res.statusCode}`;
            reject(new Error(message));
            return;
          }

          resolve(data as T);
        });
      }
    );

    req.on("error", reject);
    if (body) req.write(body);
    req.end();
  });
}

function safeJson(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}

function explainCoraError(message: string) {
  if (message === "invalid_client") {
    return (
      "Cora recusou as credenciais com invalid_client. " +
      "Confira se o Client ID pertence ao mesmo ambiente selecionado e ao mesmo certificado/private key cadastrados na Cora. " +
      "O token de webhook não é usado no teste de conexão."
    );
  }

  return message;
}

async function getCoraAccessToken(config: CoraConfig): Promise<string> {
  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: config.clientId,
  }).toString();

  const data = await requestJson<{ access_token?: string }>(config, tokenPathFor(config.environment), {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!data.access_token) {
    throw new Error("Token de acesso da Cora não retornado");
  }

  return data.access_token;
}

function documentType(document?: string | null) {
  const digits = String(document || "").replace(/\D/g, "");
  if (!digits) return undefined;
  return digits.length > 11 ? "CNPJ" : "CPF";
}

function toCents(value: number) {
  return Math.round(Number(value || 0) * 100);
}

function buildInvoicePayload(input: CoraInvoiceInput) {
  const document = String(input.customer.document || "").replace(/\D/g, "");
  const address = input.customer.address || {};

  return {
    code: input.code || input.externalReference || randomUUID(),
    customer: {
      name: input.customer.name,
      email: input.customer.email,
      ...(document
        ? {
            document: {
              identity: document,
              type: documentType(document),
            },
          }
        : {}),
      ...(input.customer.phone ? { phone: String(input.customer.phone).replace(/\D/g, "") } : {}),
      address: {
        street: address.street || "Nao informado",
        number: address.number || "S/N",
        district: address.district || "Nao informado",
        city: address.city || "Nao informado",
        state: address.state || "SP",
        zip_code: String(address.zipCode || "").replace(/\D/g, ""),
        complement: address.complement || undefined,
      },
    },
    services: [
      {
        name: input.description,
        description: input.description,
        amount: toCents(input.amount),
      },
    ],
    payment_terms: {
      due_date: input.dueDate,
    },
    payment_forms: input.paymentForms,
  };
}

function pickFirstString(...values: any[]) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value;
  }
  return null;
}

function normalizeInvoice(raw: any): CoraInvoice {
  return {
    id: String(raw?.id || raw?.invoice_id || raw?.code || ""),
    code: raw?.code || null,
    status: raw?.status || null,
    invoiceUrl: pickFirstString(raw?.invoice_url, raw?.payment_options?.bank_slip?.url, raw?.bank_slip?.url),
    bankSlipUrl: pickFirstString(raw?.bank_slip_url, raw?.payment_options?.bank_slip?.url, raw?.bank_slip?.url),
    pixCode: pickFirstString(raw?.pix?.emv, raw?.payment_options?.pix?.emv, raw?.pix?.copy_paste),
    pixQrCodeUrl: pickFirstString(raw?.pix?.qr_code_url, raw?.payment_options?.pix?.qr_code_url),
    dueDate: pickFirstString(raw?.payment_terms?.due_date, raw?.due_date),
    raw,
  };
}

export async function createCoraInvoice(input: CoraInvoiceInput): Promise<CoraInvoice> {
  const config = await getCoraConfig();
  const token = await getCoraAccessToken(config);
  const payload = buildInvoicePayload(input);

  const data = await requestJson<any>(config, "/invoices/", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "Idempotency-Key": input.externalReference || payload.code || randomUUID(),
    },
    body: JSON.stringify(payload),
  });

  const invoice = normalizeInvoice(data);
  if (!invoice.id) {
    throw new Error("Cobrança Cora criada sem identificador retornado");
  }

  return invoice;
}

export async function testCoraConnection() {
  const config = await getCoraConfig();
  try {
    await getCoraAccessToken(config);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(explainCoraError(message));
  }

  return {
    success: true,
    environment: config.environment,
    baseUrl: config.baseUrl,
  };
}
