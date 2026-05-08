#!/usr/bin/env node

import process from "node:process";
import { createClient } from "@supabase/supabase-js";

function env(name, fallback = "") {
  return String(process.env[name] ?? fallback).trim();
}

const supabaseUrl = env("NEXT_PUBLIC_SUPABASE_URL");
const serviceRoleKey = env("SUPABASE_SERVICE_ROLE_KEY");

if (!supabaseUrl || !serviceRoleKey) {
  console.error("NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são obrigatórios.");
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const fixtureTag = env("SMOKE_FIXTURE_TAG", "20260322");
const clientPassword = env("SMOKE_FIXTURE_PASSWORD", "Smoke123456");
const jornaleiroEmail = env("SMOKE_FIXTURE_JORNALEIRO_EMAIL", `smoke.jornaleiro.${fixtureTag}@guiadasbancas.local`);
const clienteEmail = env("SMOKE_FIXTURE_CLIENTE_EMAIL", `smoke.cliente.${fixtureTag}@guiadasbancas.local`);
const bancaName = env("SMOKE_FIXTURE_BANCA_NAME", `Banca Smoke ${fixtureTag}`);
const productName = env("SMOKE_FIXTURE_PRODUCT_NAME", `Produto Smoke Cola ${fixtureTag}`);
const productQuery = env("SMOKE_FIXTURE_PRODUCT_QUERY", `smoke ${fixtureTag}`);
const baseUrl = env("SMOKE_FIXTURE_BASE_URL", env("NEXT_PUBLIC_APP_URL", "http://localhost:3000")).replace(/\/$/, "");

async function getUserIdByEmail(email) {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  if (!normalizedEmail) return null;

  const { data, error } = await supabaseAdmin.rpc("get_user_id_by_email", {
    user_email: normalizedEmail,
  });

  if (error) throw error;
  return String(data || "").trim() || null;
}

async function ensureAuthUser({ email, password, role, fullName }) {
  const normalizedEmail = email.toLowerCase();
  const existingUserId = await getUserIdByEmail(normalizedEmail);

  if (existingUserId) {
    return {
      id: existingUserId,
      email: normalizedEmail,
    };
  }

  let createdUserId = null;
  const response = await fetch(`${baseUrl}/api/test/create-user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: normalizedEmail,
      password,
      full_name: fullName,
      role,
    }),
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const recoveredUserId = await getUserIdByEmail(normalizedEmail);
    if (!recoveredUserId) {
      throw new Error(body?.error || `Falha ao criar usuário ${normalizedEmail}`);
    }
    createdUserId = recoveredUserId;
  } else {
    createdUserId = body?.user?.id || null;
  }

  createdUserId = createdUserId || (await getUserIdByEmail(normalizedEmail));
  if (!createdUserId) {
    throw new Error(`Usuário criado sem ID recuperável para ${normalizedEmail}`);
  }

  return {
    id: createdUserId,
    email: normalizedEmail,
  };
}

async function ensureUserProfile({ userId, email, fullName, role, bancaId = null }) {
  const payload = {
    id: userId,
    email,
    full_name: fullName,
    role,
    active: true,
    blocked: false,
    email_verified: true,
    banca_id: bancaId,
  };

  const { error } = await supabaseAdmin.from("user_profiles").upsert(payload, { onConflict: "id" });
  if (error) throw error;
}

async function ensureBanca({ userId, email, name }) {
  const now = new Date().toISOString();
  const { data: existing, error: existingError } = await supabaseAdmin
    .from("bancas")
    .select("id, user_id, name")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existingError) throw existingError;

  const payload = {
    user_id: userId,
    name,
    description: "Banca de teste para smoke de compra ponta a ponta.",
    cep: "04795-000",
    address: "Av. Atlântica, 1000 - Interlagos, São Paulo - SP",
    lat: -23.6734282,
    lng: -46.6711052,
    whatsapp: "5511999999999",
    phone: "5511999999999",
    email,
    delivery_fee: 0,
    min_order_value: 0,
    delivery_radius: 8,
    preparation_time: 15,
    payment_methods: ["pix", "dinheiro"],
    active: true,
    approved: true,
    updated_at: now,
  };

  if (existing?.id) {
    const { data, error } = await supabaseAdmin
      .from("bancas")
      .update(payload)
      .eq("id", existing.id)
      .select("id, name")
      .single();

    if (error || !data) throw error || new Error("Falha ao atualizar banca fixture");
    return data;
  }

  const { data, error } = await supabaseAdmin
    .from("bancas")
    .insert({
      ...payload,
      created_at: now,
    })
    .select("id, name")
    .single();

  if (error || !data) throw error || new Error("Falha ao criar banca fixture");
  return data;
}

async function ensureProduct({ bancaId, name }) {
  const now = new Date().toISOString();
  const { data: existing, error: existingError } = await supabaseAdmin
    .from("products")
    .select("id, name, codigo_mercos")
    .eq("banca_id", bancaId)
    .eq("name", name)
    .limit(1)
    .maybeSingle();

  if (existingError) throw existingError;

  const payload = {
    name,
    description: "Produto fixture para validar busca, carrinho, checkout e pedido do jornaleiro.",
    price: 9.9,
    price_original: null,
    discount_percent: null,
    banca_id: bancaId,
    images: [],
    gallery_images: [],
    stock_qty: 20,
    track_stock: true,
    sob_encomenda: false,
    pre_venda: false,
    pronta_entrega: false,
    active: true,
    codigo_mercos: `SMOKE-${fixtureTag}`,
    updated_at: now,
  };

  if (existing?.id) {
    const { data, error } = await supabaseAdmin
      .from("products")
      .update(payload)
      .eq("id", existing.id)
      .select("id, name, codigo_mercos")
      .single();

    if (error || !data) throw error || new Error("Falha ao atualizar produto fixture");
    return data;
  }

  const { data, error } = await supabaseAdmin
    .from("products")
    .insert({
      ...payload,
      created_at: now,
    })
    .select("id, name, codigo_mercos")
    .single();

  if (error || !data) throw error || new Error("Falha ao criar produto fixture");
  return data;
}

async function main() {
  const jornaleiroUser = await ensureAuthUser({
    email: jornaleiroEmail,
    password: clientPassword,
    role: "jornaleiro",
    fullName: "Jornaleiro Smoke QA",
  });

  const clienteUser = await ensureAuthUser({
    email: clienteEmail,
    password: clientPassword,
    role: "cliente",
    fullName: "Cliente Smoke QA",
  });

  await ensureUserProfile({
    userId: clienteUser.id,
    email: clienteEmail,
    fullName: "Cliente Smoke QA",
    role: "cliente",
    bancaId: null,
  });

  const banca = await ensureBanca({
    userId: jornaleiroUser.id,
    email: jornaleiroEmail,
    name: bancaName,
  });

  await ensureUserProfile({
    userId: jornaleiroUser.id,
    email: jornaleiroEmail,
    fullName: "Jornaleiro Smoke QA",
    role: "jornaleiro",
    bancaId: banca.id,
  });

  const product = await ensureProduct({
    bancaId: banca.id,
    name: productName,
  });

  console.log(
    JSON.stringify(
      {
        fixtureTag,
        banca,
        product,
        search: {
          query: productQuery,
          expectedName: product.name,
        },
        credentials: {
          jornaleiro: {
            email: jornaleiroEmail,
            password: clientPassword,
          },
          cliente: {
            email: clienteEmail,
            password: clientPassword,
          },
        },
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
