import { NextRequest, NextResponse } from "next/server";

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
    const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL;
    const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY;
    const EVOLUTION_INSTANCE_NAME = process.env.EVOLUTION_INSTANCE_NAME;

    if (!EVOLUTION_API_URL || !EVOLUTION_API_KEY || !EVOLUTION_INSTANCE_NAME) {
      console.error("Evolution API não configurada");
      return NextResponse.json(
        { error: "WhatsApp service not configured" },
        { status: 500 }
      );
    }

    // Formatar número (remover caracteres especiais)
    const cleanPhone = phone.replace(/\D/g, "");
    const formattedPhone = cleanPhone.includes("@") 
      ? cleanPhone 
      : `55${cleanPhone}@s.whatsapp.net`;

    // Enviar mensagem via Evolution API
    const response = await fetch(
      `${EVOLUTION_API_URL}/message/sendText/${EVOLUTION_INSTANCE_NAME}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: EVOLUTION_API_KEY,
        },
        body: JSON.stringify({
          number: formattedPhone,
          text: message,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Erro da Evolution API:", errorData);
      throw new Error("Failed to send WhatsApp message");
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      messageId: data.key?.id,
    });
  } catch (error) {
    console.error("Erro ao enviar WhatsApp:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
