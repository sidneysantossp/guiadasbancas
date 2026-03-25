import { NextRequest, NextResponse } from "next/server";
import { getWhatsAppConfig } from "@/lib/whatsapp-config";
import { normalizeEvolutionPhoneDigits, sendEvolutionTextMessage } from "@/lib/evolution-api";

export async function POST(request: NextRequest) {
  try {
    const { phone, message } = await request.json();

    if (!phone || !message) {
      return NextResponse.json(
        { error: "Phone and message are required" },
        { status: 400 }
      );
    }

    // Configurações da Evolution API
    const config = await getWhatsAppConfig();
    const EVOLUTION_API_URL = config.baseUrl;
    const EVOLUTION_API_KEY = config.apiKey;
    const EVOLUTION_INSTANCE_NAME = config.instanceName;

    if (!EVOLUTION_API_URL || !EVOLUTION_API_KEY || !EVOLUTION_INSTANCE_NAME) {
      console.error("Evolution API não configurada");
      return NextResponse.json(
        { error: "WhatsApp service not configured" },
        { status: 500 }
      );
    }

    // Formatar número (remover caracteres especiais)
    const formattedPhone = normalizeEvolutionPhoneDigits(phone);
    const result = await sendEvolutionTextMessage({
      baseUrl: EVOLUTION_API_URL,
      apiKey: EVOLUTION_API_KEY,
      instanceName: EVOLUTION_INSTANCE_NAME,
      number: formattedPhone,
      text: message,
      timeoutMs: 20000,
    });

    if (!result.ok) {
      console.error("Erro da Evolution API:", result.raw || result.error);
      throw new Error("Failed to send WhatsApp message");
    }

    return NextResponse.json({
      success: true,
      messageId: result.messageId,
      phone: result.recipientUsed || formattedPhone,
    });
  } catch (error) {
    console.error("Erro ao enviar WhatsApp:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
