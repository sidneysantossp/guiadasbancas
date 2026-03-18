import { ensureBancaHasOnboardingPlan } from "@/lib/banca-subscription";
import { loadJornaleiroActor } from "@/lib/modules/jornaleiro/access";
import { supabaseAdmin } from "@/lib/supabase";

type JornaleiroProfilePayload = {
  full_name?: string | null;
  phone?: string | null;
  cpf?: string | null;
  avatar_url?: string | null;
};

type JornaleiroBancaPayload = {
  name?: string | null;
  description?: string | null;
  logo_url?: string | null;
  cover_image?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  instagram?: string | null;
  facebook?: string | null;
  cep?: string | null;
  address?: string | null;
  lat?: number | null;
  lng?: number | null;
  opening_hours?: unknown;
  delivery_fee?: number | null;
  min_order_value?: number | null;
  delivery_radius?: number | null;
  preparation_time?: number | null;
  payment_methods?: string[] | null;
};

function pickDefinedEntries<T extends Record<string, unknown>>(input: T) {
  return Object.fromEntries(
    Object.entries(input).filter(([, value]) => value !== undefined)
  ) as Partial<T>;
}

async function ensureJornaleiroActor(userId: string) {
  const { actor, error } = await loadJornaleiroActor(userId);

  if (error) {
    throw new Error(error.message || "Erro ao validar acesso do jornaleiro");
  }

  if (!actor.isJornaleiro) {
    throw new Error("FORBIDDEN_JORNALEIRO");
  }

  return actor;
}

async function loadOwnedBanca(userId: string) {
  const { data, error } = await supabaseAdmin
    .from("bancas")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(error.message || "Erro ao buscar banca do jornaleiro");
  }

  return data || null;
}

export async function loadJornaleiroProfileBundle(userId: string) {
  await ensureJornaleiroActor(userId);

  const [{ data: profile, error: profileError }, banca] = await Promise.all([
    supabaseAdmin.from("user_profiles").select("*").eq("id", userId).maybeSingle(),
    loadOwnedBanca(userId),
  ]);

  if (profileError) {
    throw new Error(profileError.message || "Erro ao buscar perfil do jornaleiro");
  }

  if (!profile) {
    throw new Error("PROFILE_NOT_FOUND");
  }

  return {
    profile,
    banca,
  };
}

export async function saveJornaleiroProfileBundle(params: {
  userId: string;
  profileUpdates?: JornaleiroProfilePayload | null;
  bancaUpdates?: JornaleiroBancaPayload | null;
}) {
  await ensureJornaleiroActor(params.userId);

  if (params.profileUpdates) {
    const profilePayload = pickDefinedEntries<JornaleiroProfilePayload>({
      full_name: params.profileUpdates.full_name,
      phone: params.profileUpdates.phone,
      cpf: params.profileUpdates.cpf,
      avatar_url: params.profileUpdates.avatar_url,
    });

    if (Object.keys(profilePayload).length > 0) {
      const { error } = await supabaseAdmin
        .from("user_profiles")
        .update(profilePayload)
        .eq("id", params.userId);

      if (error) {
        throw new Error(error.message || "Erro ao atualizar perfil do jornaleiro");
      }
    }
  }

  let bancaId: string | null = null;

  if (params.bancaUpdates) {
    const existingBanca = await loadOwnedBanca(params.userId);
    const bancaPayload = pickDefinedEntries<JornaleiroBancaPayload>({
      name: params.bancaUpdates.name,
      description: params.bancaUpdates.description,
      logo_url: params.bancaUpdates.logo_url,
      cover_image: params.bancaUpdates.cover_image,
      phone: params.bancaUpdates.phone,
      whatsapp: params.bancaUpdates.whatsapp,
      email: params.bancaUpdates.email,
      instagram: params.bancaUpdates.instagram,
      facebook: params.bancaUpdates.facebook,
      cep: params.bancaUpdates.cep,
      address: params.bancaUpdates.address,
      lat: params.bancaUpdates.lat,
      lng: params.bancaUpdates.lng,
      opening_hours: params.bancaUpdates.opening_hours,
      delivery_fee: params.bancaUpdates.delivery_fee,
      min_order_value: params.bancaUpdates.min_order_value,
      delivery_radius: params.bancaUpdates.delivery_radius,
      preparation_time: params.bancaUpdates.preparation_time,
      payment_methods: params.bancaUpdates.payment_methods,
    });

    if (existingBanca) {
      if (Object.keys(bancaPayload).length > 0) {
        const { error } = await supabaseAdmin
          .from("bancas")
          .update(bancaPayload)
          .eq("id", existingBanca.id);

        if (error) {
          throw new Error(error.message || "Erro ao atualizar banca do jornaleiro");
        }
      }

      bancaId = existingBanca.id;
    } else {
      const { data: createdBanca, error } = await supabaseAdmin
        .from("bancas")
        .insert({
          user_id: params.userId,
          active: false,
          approved: false,
          cep: "00000-000",
          address: "Endereço não informado",
          lat: -23.5505,
          lng: -46.6333,
          delivery_fee: 0,
          min_order_value: 0,
          delivery_radius: 5,
          preparation_time: 30,
          payment_methods: ["pix", "dinheiro"],
          ...bancaPayload,
        })
        .select("id")
        .single();

      if (error) {
        throw new Error(error.message || "Erro ao criar banca do jornaleiro");
      }

      bancaId = createdBanca?.id || null;

      if (bancaId) {
        const { error: profileUpdateError } = await supabaseAdmin
          .from("user_profiles")
          .update({ banca_id: bancaId })
          .eq("id", params.userId);

        if (profileUpdateError) {
          throw new Error(profileUpdateError.message || "Erro ao vincular banca ao perfil");
        }
      }
    }
  }

  if (bancaId) {
    try {
      await ensureBancaHasOnboardingPlan(bancaId);
    } catch (error: any) {
      console.warn(
        "[JornaleiroProfile] Falha ao garantir plano inicial da banca:",
        error?.message || error
      );
    }
  }

  return loadJornaleiroProfileBundle(params.userId);
}
