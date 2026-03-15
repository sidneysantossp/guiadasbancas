import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

type CustomerAddressPayload = {
  id?: string;
  label?: string;
  recipient_name?: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  uf?: string;
  cep?: string;
  phone?: string;
  instructions?: string;
  is_default?: boolean;
};

function unauthorized() {
  return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
}

async function getAuthenticatedUserId() {
  const session = await auth();
  const userId = (session?.user as any)?.id as string | undefined;
  return userId || null;
}

function sanitizeZipCode(value: string | null | undefined) {
  const digits = (value || "").replace(/\D+/g, "").slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

function mapAddress(row: any) {
  return {
    id: row.id,
    label: row.label || "Casa",
    recipient_name: row.recipient_name || "",
    street: row.street || "",
    number: row.number || "",
    complement: row.complement || "",
    neighborhood: row.neighborhood || "",
    city: row.city || "",
    uf: row.state || "",
    cep: sanitizeZipCode(row.zip_code),
    phone: row.phone || "",
    instructions: row.instructions || "",
    is_default: Boolean(row.is_default),
    created_at: row.created_at || null,
    updated_at: row.updated_at || null,
  };
}

function buildAddressRecord(body: CustomerAddressPayload) {
  return {
    label: body.label?.trim() || "Casa",
    recipient_name: body.recipient_name?.trim() || null,
    street: body.street?.trim() || "",
    number: body.number?.trim() || null,
    complement: body.complement?.trim() || null,
    neighborhood: body.neighborhood?.trim() || null,
    city: body.city?.trim() || "",
    state: (body.uf || "").trim().toUpperCase(),
    zip_code: sanitizeZipCode(body.cep),
    phone: body.phone?.trim() || null,
    instructions: body.instructions?.trim() || null,
  };
}

function validateAddressRecord(record: ReturnType<typeof buildAddressRecord>) {
  if (!record.street) return "Informe o endereço";
  if (!record.city) return "Informe a cidade";
  if (!record.state || record.state.length !== 2) return "Informe a UF";
  if (!record.zip_code || record.zip_code.replace(/\D+/g, "").length !== 8) return "Informe um CEP válido";
  return null;
}

async function fetchAddresses(userId: string) {
  const { data, error } = await supabaseAdmin
    .from("customer_addresses")
    .select("id, label, recipient_name, street, number, complement, neighborhood, city, state, zip_code, phone, instructions, is_default, created_at, updated_at")
    .eq("user_id", userId)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data || []).map(mapAddress);
}

export async function GET() {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) return unauthorized();

    const addresses = await fetchAddresses(userId);
    return NextResponse.json({ success: true, data: addresses });
  } catch (error: any) {
    console.error("[API Minha Conta Addresses] Erro ao listar endereços:", error);
    if (String(error?.message || "").toLowerCase().includes("customer_addresses")) {
      return NextResponse.json({ success: true, data: [] });
    }
    return NextResponse.json(
      { error: error?.message || "Não foi possível carregar os endereços" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) return unauthorized();

    const body = (await request.json()) as CustomerAddressPayload;
    const addressRecord = buildAddressRecord(body);
    const validationError = validateAddressRecord(addressRecord);

    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const existingAddresses = await fetchAddresses(userId);
    const shouldBeDefault = body.is_default === true || existingAddresses.length === 0;

    if (shouldBeDefault) {
      const { error: clearDefaultError } = await supabaseAdmin
        .from("customer_addresses")
        .update({ is_default: false } as any)
        .eq("user_id", userId);

      if (clearDefaultError) {
        throw new Error(clearDefaultError.message);
      }
    }

    const { data, error } = await supabaseAdmin
      .from("customer_addresses")
      .insert({
        user_id: userId,
        ...addressRecord,
        is_default: shouldBeDefault,
      } as any)
      .select("id, label, recipient_name, street, number, complement, neighborhood, city, state, zip_code, phone, instructions, is_default, created_at, updated_at")
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({
      success: true,
      data: mapAddress(data),
      addresses: await fetchAddresses(userId),
    });
  } catch (error: any) {
    console.error("[API Minha Conta Addresses] Erro ao criar endereço:", error);
    return NextResponse.json(
      { error: error?.message || "Não foi possível salvar o endereço" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) return unauthorized();

    const body = (await request.json()) as CustomerAddressPayload;
    if (!body.id) {
      return NextResponse.json({ error: "Endereço não informado" }, { status: 400 });
    }

    const addressRecord = buildAddressRecord(body);
    const validationError = validateAddressRecord(addressRecord);

    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    if (body.is_default === true) {
      const { error: clearDefaultError } = await supabaseAdmin
        .from("customer_addresses")
        .update({ is_default: false } as any)
        .eq("user_id", userId);

      if (clearDefaultError) {
        throw new Error(clearDefaultError.message);
      }
    }

    const { data, error } = await supabaseAdmin
      .from("customer_addresses")
      .update({
        ...addressRecord,
        is_default: body.is_default === true,
        updated_at: new Date().toISOString(),
      } as any)
      .eq("id", body.id)
      .eq("user_id", userId)
      .select("id, label, recipient_name, street, number, complement, neighborhood, city, state, zip_code, phone, instructions, is_default, created_at, updated_at")
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({
      success: true,
      data: mapAddress(data),
      addresses: await fetchAddresses(userId),
    });
  } catch (error: any) {
    console.error("[API Minha Conta Addresses] Erro ao atualizar endereço:", error);
    return NextResponse.json(
      { error: error?.message || "Não foi possível atualizar o endereço" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) return unauthorized();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Endereço não informado" }, { status: 400 });
    }

    const { data: address, error: currentError } = await supabaseAdmin
      .from("customer_addresses")
      .select("id, is_default")
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (currentError || !address) {
      return NextResponse.json({ error: "Endereço não encontrado" }, { status: 404 });
    }

    const { error: deleteError } = await supabaseAdmin
      .from("customer_addresses")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (deleteError) {
      throw new Error(deleteError.message);
    }

    if (address.is_default) {
      const remaining = await fetchAddresses(userId);
      const nextDefault = remaining[0];

      if (nextDefault) {
        const { error: nextDefaultError } = await supabaseAdmin
          .from("customer_addresses")
          .update({ is_default: true } as any)
          .eq("id", nextDefault.id)
          .eq("user_id", userId);

        if (nextDefaultError) {
          throw new Error(nextDefaultError.message);
        }
      }
    }

    return NextResponse.json({
      success: true,
      addresses: await fetchAddresses(userId),
    });
  } catch (error: any) {
    console.error("[API Minha Conta Addresses] Erro ao remover endereço:", error);
    return NextResponse.json(
      { error: error?.message || "Não foi possível remover o endereço" },
      { status: 500 },
    );
  }
}
