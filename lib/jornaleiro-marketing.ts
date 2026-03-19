export const JOURNALEIRO_MARKETING_PATH = "/para-jornaleiros";
export const JOURNALEIRO_SIGNUP_PATH = "/jornaleiro/registrar";
export const JOURNALEIRO_LOGIN_PATH = "/jornaleiro";
export const GUIDE_SUPPORT_WHATSAPP_NUMBER = "5511994683425";

export function buildGuideSupportWhatsAppUrl(message: string): string {
  return `https://wa.me/${GUIDE_SUPPORT_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
