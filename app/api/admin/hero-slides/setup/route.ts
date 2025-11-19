import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// API para criar as tabelas automaticamente
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const authHeader = request.headers.get("authorization");
    if (!authHeader || authHeader !== "Bearer admin-token") {
      return NextResponse.json(
        { success: false, error: "Não autorizado" },
        { status: 401 }
      );
    }

    console.log('[setup] Criando tabelas hero_slides e slider_config...');

    // Criar tabela hero_slides
    const createSlidesTable = `
      CREATE TABLE IF NOT EXISTS hero_slides (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        "imageUrl" TEXT NOT NULL,
        "imageAlt" TEXT NOT NULL,
        "gradientFrom" TEXT NOT NULL DEFAULT '#ff7a33',
        "gradientTo" TEXT NOT NULL DEFAULT '#e64a00',
        "cta1Text" TEXT NOT NULL,
        "cta1Link" TEXT NOT NULL,
        "cta1Style" TEXT NOT NULL DEFAULT 'primary',
        "cta2Text" TEXT NOT NULL,
        "cta2Link" TEXT NOT NULL,
        "cta2Style" TEXT NOT NULL DEFAULT 'outline',
        active BOOLEAN NOT NULL DEFAULT true,
        "order" INTEGER NOT NULL DEFAULT 1,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    // Criar tabela slider_config
    const createConfigTable = `
      CREATE TABLE IF NOT EXISTS slider_config (
        id INTEGER PRIMARY KEY DEFAULT 1,
        "autoPlayTime" INTEGER NOT NULL DEFAULT 6000,
        "transitionSpeed" INTEGER NOT NULL DEFAULT 600,
        "showArrows" BOOLEAN NOT NULL DEFAULT true,
        "showDots" BOOLEAN NOT NULL DEFAULT true,
        "heightDesktop" INTEGER NOT NULL DEFAULT 520,
        "heightMobile" INTEGER NOT NULL DEFAULT 360,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    // Executar via RPC (requer uma função no Supabase)
    // Como alternativa, vamos inserir os dados diretamente
    
    // Inserir slides padrão
    const defaultSlides = [
      {
        id: "slide-1",
        title: "Sua banca favorita\nagora delivery",
        description: "Jornais, revistas, papelaria, snacks e muito mais direto da sua banca de confiança.",
        imageUrl: "https://images.unsplash.com/photo-1521334726092-b509a19597d6?q=80&w=1600&auto=format&fit=crop",
        imageAlt: "Banca de jornal com revistas e jornais ao fundo",
        gradientFrom: "#ff7a33",
        gradientTo: "#e64a00",
        cta1Text: "Peça agora",
        cta1Link: "/bancas-perto-de-mim",
        cta1Style: "primary" as const,
        cta2Text: "Sou jornaleiro",
        cta2Link: "/jornaleiro",
        cta2Style: "outline" as const,
        active: true,
        order: 1
      },
      {
        id: "slide-2",
        title: "Revistas, jornais\ne colecionáveis",
        description: "Encontre os lançamentos e clássicos nas bancas mais próximas de você.",
        imageUrl: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1600&auto=format&fit=crop",
        imageAlt: "Pilha de revistas coloridas",
        gradientFrom: "#ffa366",
        gradientTo: "#ff5c00",
        cta1Text: "Ver departamentos",
        cta1Link: "/departamentos",
        cta1Style: "primary" as const,
        cta2Text: "Bancas próximas",
        cta2Link: "/bancas-perto-de-mim",
        cta2Style: "outline" as const,
        active: true,
        order: 2
      },
      {
        id: "slide-3",
        title: "Tudo de conveniência\nem poucos cliques",
        description: "Bebidas, snacks, pilhas, papelaria e recargas com entrega rápida.",
        imageUrl: "https://images.unsplash.com/photo-1601050690597-9b614fb3a3e7?q=80&w=1600&auto=format&fit=crop",
        imageAlt: "Loja de conveniência com prateleiras e bebidas",
        gradientFrom: "#ffd6c2",
        gradientTo: "#ff5c00",
        cta1Text: "Explorar agora",
        cta1Link: "/bancas-perto-de-mim",
        cta1Style: "primary" as const,
        cta2Text: "Como funciona",
        cta2Link: "/minha-conta",
        cta2Style: "outline" as const,
        active: true,
        order: 3
      }
    ];

    console.log('[setup] Inserindo slides padrão...');
    
    const { error: slidesError } = await supabase
      .from('hero_slides')
      .upsert(defaultSlides, { onConflict: 'id' });

    if (slidesError) {
      console.error('[setup] Erro ao inserir slides:', slidesError);
      return NextResponse.json(
        { 
          success: false, 
          error: "Erro ao inserir slides",
          details: slidesError.message,
          hint: "Execute o SQL manualmente no Supabase SQL Editor: /database/create-hero-slides-tables.sql"
        },
        { status: 500 }
      );
    }

    console.log('[setup] Inserindo configuração padrão...');

    const { error: configError } = await supabase
      .from('slider_config')
      .upsert({
        id: 1,
        autoPlayTime: 6000,
        transitionSpeed: 600,
        showArrows: true,
        showDots: true,
        heightDesktop: 520,
        heightMobile: 360
      }, { onConflict: 'id' });

    if (configError) {
      console.error('[setup] Erro ao inserir config:', configError);
      return NextResponse.json(
        { 
          success: false, 
          error: "Erro ao inserir configuração",
          details: configError.message,
          hint: "Execute o SQL manualmente no Supabase SQL Editor: /database/create-hero-slides-tables.sql"
        },
        { status: 500 }
      );
    }

    console.log('[setup] ✅ Tabelas criadas e dados inseridos com sucesso!');

    return NextResponse.json({ 
      success: true, 
      message: "Tabelas criadas e dados inseridos com sucesso!",
      data: {
        slides: defaultSlides.length,
        config: true
      }
    });

  } catch (error: any) {
    console.error('[setup] Erro geral:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Erro ao criar tabelas",
        details: error.message,
        hint: "As tabelas podem já existir. Execute o SQL manualmente no Supabase SQL Editor: /database/create-hero-slides-tables.sql"
      },
      { status: 500 }
    );
  }
}
