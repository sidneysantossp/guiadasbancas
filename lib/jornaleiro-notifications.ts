import { loadActiveJornaleiroBancaRow } from "@/lib/modules/jornaleiro/bancas";
import { supabaseAdmin } from "@/lib/supabase";

const NOTIFICATION_READS_TABLE = "notification_reads";

export type JornaleiroNotification = {
  id: string;
  type: "novo_produto" | "pedido" | "admin_message";
  title: string;
  message: string;
  order_id?: string;
  product_id?: string;
  product_name?: string;
  customer_name?: string;
  distribuidor_nome?: string;
  status?: string;
  total?: number;
  read: boolean;
  created_at: string;
  priority: number;
};

type InternalNotification = JornaleiroNotification & {
  persisted?: boolean;
};

async function getNotificationReadKeys(userId: string, notificationIds: string[]) {
  if (notificationIds.length === 0) {
    return new Set<string>();
  }

  try {
    const { data, error } = await supabaseAdmin
      .from(NOTIFICATION_READS_TABLE)
      .select("notification_key")
      .eq("user_id", userId)
      .in("notification_key", notificationIds);

    if (error) {
      throw error;
    }

    return new Set((data || []).map((row: any) => row.notification_key));
  } catch (error) {
    console.warn("[NOTIFICACOES] Tabela notification_reads indisponível:", error);
    return new Set<string>();
  }
}

export async function markNotificationKeysAsRead(userId: string, notificationIds: string[]) {
  const uniqueIds = [...new Set(notificationIds.filter(Boolean))];
  if (uniqueIds.length === 0) {
    return;
  }

  try {
    const now = new Date().toISOString();
    const payload = uniqueIds.map((notificationId) => ({
      user_id: userId,
      notification_key: notificationId,
      read_at: now,
    }));

    const { error } = await supabaseAdmin
      .from(NOTIFICATION_READS_TABLE)
      .upsert(payload, { onConflict: "user_id,notification_key" });

    if (error) {
      throw error;
    }
  } catch (error) {
    console.warn("[NOTIFICACOES] Não foi possível persistir leitura:", error);
    throw error;
  }
}

export async function buildJornaleiroNotifications(userId: string) {
  const banca = await loadActiveJornaleiroBancaRow({
    userId,
    select: "id, user_id, is_cotista, cotista_id",
  });

  if (!banca) {
    return { banca: null, notifications: [] as JornaleiroNotification[] };
  }

  const notifications: InternalNotification[] = [];
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { data: pedidosRecentes } = await supabaseAdmin
    .from("orders")
    .select("id, customer_name, status, total, created_at, updated_at")
    .eq("banca_id", banca.id)
    .gte("created_at", sevenDaysAgo.toISOString())
    .order("created_at", { ascending: false })
    .limit(20);

  (pedidosRecentes || []).forEach((pedido: any) => {
    const statusLabels: Record<string, string> = {
      pending: "Novo pedido aguardando",
      confirmed: "Pedido confirmado",
      preparing: "Pedido em preparação",
      ready: "Pedido pronto para entrega",
      delivered: "Pedido entregue",
      cancelled: "Pedido cancelado",
    };

    const isPending = pedido.status === "pending";
    notifications.push({
      id: `pedido_${pedido.id}`,
      type: "pedido",
      title: statusLabels[pedido.status] || "Atualização de pedido",
      message: `Pedido de ${pedido.customer_name} - R$ ${pedido.total?.toFixed(2) || "0.00"}`,
      order_id: pedido.id,
      customer_name: pedido.customer_name,
      status: pedido.status,
      total: pedido.total,
      read: !isPending,
      created_at: pedido.created_at,
      priority: isPending ? 1 : 2,
    });
  });

  if (banca.is_cotista && banca.cotista_id) {
    const { data: novosProdutos } = await supabaseAdmin
      .from("products")
      .select("id, name, created_at, distribuidor_id")
      .not("distribuidor_id", "is", null)
      .gte("created_at", sevenDaysAgo.toISOString())
      .order("created_at", { ascending: false })
      .limit(10);

    const distIds = Array.from(new Set((novosProdutos || []).map((p) => p.distribuidor_id).filter(Boolean)));
    let distMap = new Map<string, string>();
    if (distIds.length > 0) {
      const { data: distRows } = await supabaseAdmin
        .from("distribuidores")
        .select("id, nome")
        .in("id", distIds as any);
      distMap = new Map(
        (distRows || []).map((d: any) => [d.id, d.nome || "Distribuidor"])
      );
    }

    (novosProdutos || []).forEach((produto: any) => {
      notifications.push({
        id: `novo_${produto.id}`,
        type: "novo_produto",
        title: "Novo produto disponível",
        message: `"${produto.name}" foi adicionado ao catálogo`,
        product_id: produto.id,
        product_name: produto.name,
        distribuidor_nome: distMap.get(produto.distribuidor_id) || "Distribuidor",
        read: false,
        created_at: produto.created_at,
        priority: 3,
      });
    });
  }

  try {
    const [{ data: userNotifications }, { data: bancaNotifications }] = await Promise.all([
      supabaseAdmin
        .from("notifications")
        .select("id, type, title, message, data, read_at, created_at")
        .eq("user_id", userId)
        .gte("created_at", sevenDaysAgo.toISOString())
        .order("created_at", { ascending: false })
        .limit(10),
      supabaseAdmin
        .from("notifications")
        .select("id, type, title, message, data, read_at, created_at")
        .is("user_id", null)
        .or(`banca_id.eq.${banca.id},banca_id.is.null`)
        .gte("created_at", sevenDaysAgo.toISOString())
        .order("created_at", { ascending: false })
        .limit(10),
    ]);

    const deduped = new Map<string, any>();
    [...(userNotifications || []), ...(bancaNotifications || [])].forEach((notif: any) => {
      deduped.set(notif.id, notif);
    });

    deduped.forEach((notif: any) => {
      const data = notif.data || {};
      notifications.push({
        id: `admin_${notif.id}`,
        type: "admin_message",
        title: notif.title || data.title || "Mensagem do Sistema",
        message: notif.message || data.message || data.body || "Nova notificação",
        read: Boolean(notif.read_at),
        created_at: notif.created_at,
        priority: 0,
        persisted: true,
      });
    });
  } catch (error) {
    console.log("[NOTIFICACOES] Tabela notifications indisponível ou vazia:", error);
  }

  const trackedIds = notifications.map((notification) => notification.id);
  const readKeys = await getNotificationReadKeys(userId, trackedIds);

  const mergedNotifications = notifications.map((notification) => ({
    ...notification,
    read: notification.read || readKeys.has(notification.id),
  }));

  mergedNotifications.sort((a, b) => {
    if (a.priority !== b.priority) {
      return a.priority - b.priority;
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return {
    banca,
    notifications: mergedNotifications,
  };
}
