import {
  buildJornaleiroNotifications,
  markNotificationKeysAsRead,
} from "@/lib/jornaleiro-notifications";

export async function listJornaleiroNotifications(userId: string) {
  const { banca, notifications } = await buildJornaleiroNotifications(userId);

  if (!banca) {
    throw new Error("BANCA_NOT_FOUND");
  }

  return {
    success: true,
    notifications: notifications.slice(0, 30),
    total: notifications.length,
  };
}

export async function markJornaleiroNotificationRead(params: {
  userId: string;
  notificationId: string;
}) {
  await markNotificationKeysAsRead(params.userId, [params.notificationId]);

  return {
    success: true,
    message: "Notificação marcada como lida",
  };
}

export async function markAllJornaleiroNotificationsRead(userId: string) {
  const { notifications } = await buildJornaleiroNotifications(userId);
  const unreadNotificationIds = notifications
    .filter((notification) => !notification.read)
    .map((notification) => notification.id);

  await markNotificationKeysAsRead(userId, unreadNotificationIds);

  return {
    success: true,
    message: "Todas notificações marcadas como lidas",
  };
}
