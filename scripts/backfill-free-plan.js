require("dotenv").config({ path: ".env.local" });
require("dotenv").config({ path: ".env.development", override: false });

const { createClient } = require("@supabase/supabase-js");

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Variáveis NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não encontradas.");
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: freePlan, error: freePlanError } = await supabase
    .from("plans")
    .select("id, name, type, price")
    .eq("is_active", true)
    .or("type.eq.free,price.eq.0")
    .order("sort_order", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (freePlanError) {
    throw freePlanError;
  }

  if (!freePlan?.id) {
    throw new Error("Nenhum plano Free ativo encontrado.");
  }

  const [{ data: bancas, error: bancasError }, { data: currentSubscriptions, error: subscriptionsError }] =
    await Promise.all([
      supabase.from("bancas").select("id"),
      supabase
        .from("subscriptions")
        .select("banca_id")
        .in("status", ["active", "trial", "pending", "overdue"]),
    ]);

  if (bancasError) {
    throw bancasError;
  }

  if (subscriptionsError) {
    throw subscriptionsError;
  }

  const bancaIds = (bancas || []).map((item) => item.id).filter(Boolean);
  const bancaIdsWithCurrentPlan = new Set(
    (currentSubscriptions || []).map((item) => item.banca_id).filter(Boolean)
  );
  const missingBancaIds = bancaIds.filter((bancaId) => !bancaIdsWithCurrentPlan.has(bancaId));

  if (missingBancaIds.length === 0) {
    console.log(
      JSON.stringify(
        {
          success: true,
          freePlanId: freePlan.id,
          freePlanName: freePlan.name,
          totalBancas: bancaIds.length,
          alreadyWithCurrentPlan: bancaIds.length,
          addedToFree: 0,
        },
        null,
        2
      )
    );
    return;
  }

  const now = new Date().toISOString();
  const payload = missingBancaIds.map((bancaId) => ({
    banca_id: bancaId,
    plan_id: freePlan.id,
    status: "active",
    current_period_start: now,
    current_period_end: null,
  }));

  const { error: insertError } = await supabase
    .from("subscriptions")
    .insert(payload);

  if (insertError) {
    throw insertError;
  }

  console.log(
    JSON.stringify(
      {
        success: true,
        freePlanId: freePlan.id,
        freePlanName: freePlan.name,
        totalBancas: bancaIds.length,
        alreadyWithCurrentPlan: bancaIds.length - missingBancaIds.length,
        addedToFree: missingBancaIds.length,
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(
    JSON.stringify(
      {
        success: false,
        error: error?.message || String(error),
      },
      null,
      2
    )
  );
  process.exit(1);
});
