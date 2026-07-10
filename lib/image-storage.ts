import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase";

type UploadBody = Blob | Buffer | Uint8Array;

type ImageUploadResult = {
  provider: "cloudflare_r2" | "supabase";
  path: string;
  url: string;
};

type UploadParams = {
  path: string;
  body: UploadBody;
  contentType: string;
  upsert?: boolean;
};

const R2_PROVIDER = "cloudflare_r2";
const SUPABASE_PROVIDER = "supabase";

function shouldUseCloudflareR2() {
  const provider = process.env.IMAGE_STORAGE_PROVIDER || process.env.NEXT_PUBLIC_IMAGE_STORAGE_PROVIDER;
  return provider?.toLowerCase() === R2_PROVIDER;
}

function getR2Config() {
  const accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID;
  const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
  const bucket = process.env.CLOUDFLARE_R2_BUCKET;
  const publicUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL;

  if (!accountId || !accessKeyId || !secretAccessKey || !bucket || !publicUrl) {
    return null;
  }

  return {
    accountId,
    accessKeyId,
    secretAccessKey,
    bucket,
    publicUrl: publicUrl.replace(/\/+$/, ""),
  };
}

function sha256Hex(value: string | Buffer) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function hmac(key: crypto.BinaryLike, value: string) {
  return crypto.createHmac("sha256", key).update(value).digest();
}

function encodeR2Key(path: string) {
  return path
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

async function toBuffer(body: UploadBody) {
  if (Buffer.isBuffer(body)) return body;
  if (body instanceof Uint8Array) return Buffer.from(body);
  return Buffer.from(await body.arrayBuffer());
}

async function uploadToCloudflareR2(params: UploadParams): Promise<ImageUploadResult> {
  const config = getR2Config();
  if (!config) {
    throw new Error(
      "Cloudflare R2 não configurado. Defina CLOUDFLARE_R2_ACCOUNT_ID, CLOUDFLARE_R2_ACCESS_KEY_ID, CLOUDFLARE_R2_SECRET_ACCESS_KEY, CLOUDFLARE_R2_BUCKET e CLOUDFLARE_R2_PUBLIC_URL.",
    );
  }

  const body = await toBuffer(params.body);
  const encodedKey = encodeR2Key(params.path);
  const host = `${config.accountId}.r2.cloudflarestorage.com`;
  const endpoint = `https://${host}/${config.bucket}/${encodedKey}`;
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
  const dateStamp = amzDate.slice(0, 8);
  const payloadHash = sha256Hex(body);
  const credentialScope = `${dateStamp}/auto/s3/aws4_request`;
  const signedHeaders = "host;x-amz-content-sha256;x-amz-date";

  const canonicalHeaders =
    `host:${host}\n` +
    `x-amz-content-sha256:${payloadHash}\n` +
    `x-amz-date:${amzDate}\n`;

  const canonicalRequest = [
    "PUT",
    `/${config.bucket}/${encodedKey}`,
    "",
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join("\n");

  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    credentialScope,
    sha256Hex(canonicalRequest),
  ].join("\n");

  const dateKey = hmac(`AWS4${config.secretAccessKey}`, dateStamp);
  const regionKey = hmac(dateKey, "auto");
  const serviceKey = hmac(regionKey, "s3");
  const signingKey = hmac(serviceKey, "aws4_request");
  const signature = crypto.createHmac("sha256", signingKey).update(stringToSign).digest("hex");

  const response = await fetch(endpoint, {
    method: "PUT",
    headers: {
      Authorization:
        `AWS4-HMAC-SHA256 Credential=${config.accessKeyId}/${credentialScope}, ` +
        `SignedHeaders=${signedHeaders}, Signature=${signature}`,
      "Content-Type": params.contentType,
      "Content-Length": String(body.length),
      "x-amz-content-sha256": payloadHash,
      "x-amz-date": amzDate,
    },
    body,
  });

  if (!response.ok) {
    const details = await response.text().catch(() => "");
    throw new Error(`Cloudflare R2 upload falhou (${response.status}): ${details || response.statusText}`);
  }

  return {
    provider: R2_PROVIDER,
    path: params.path,
    url: `${config.publicUrl}/${encodedKey}`,
  };
}

async function uploadToSupabase(params: UploadParams): Promise<ImageUploadResult> {
  const { error } = await supabaseAdmin.storage.from("images").upload(params.path, params.body, {
    contentType: params.contentType,
    upsert: params.upsert ?? false,
  });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabaseAdmin.storage.from("images").getPublicUrl(params.path);

  return {
    provider: SUPABASE_PROVIDER,
    path: params.path,
    url: data.publicUrl,
  };
}

export async function uploadImage(params: UploadParams): Promise<ImageUploadResult> {
  if (!shouldUseCloudflareR2()) {
    return uploadToSupabase(params);
  }

  try {
    return await uploadToCloudflareR2(params);
  } catch (error) {
    const shouldFallback = process.env.IMAGE_STORAGE_FALLBACK_TO_SUPABASE !== "false";
    if (!shouldFallback) throw error;

    console.error("[image-storage] Falha no Cloudflare R2, usando Supabase Storage:", error);
    return uploadToSupabase(params);
  }
}
