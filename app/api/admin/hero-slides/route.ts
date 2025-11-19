import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

type HeroSlide = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  gradientFrom: string;
  gradientTo: string;
  cta1Text: string;
  cta1Link: string;
  cta1Style: "primary" | "outline";
  cta2Text: string;
  cta2Link: string;
  cta2Style: "primary" | "outline";
  active: boolean;
  order: number;
};

type SliderConfig = {
  autoPlayTime: number;
  transitionSpeed: number;
  showArrows: boolean;
  showDots: boolean;
  heightDesktop: number;
  heightMobile: number;
};

// Funções para ler/gravar no Supabase
async function readSlides(): Promise<HeroSlide[]> {
  try {
    const { data, error } = await supabase
      .from('hero_slides')
      .select('*')
      .order('order', { ascending: true });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('[hero-slides] Erro ao ler slides:', error);
    return [];
  }
}

async function writeSlide(slide: HeroSlide) {
  const { error } = await supabase
    .from('hero_slides')
    .upsert(slide, { onConflict: 'id' });
  
  if (error) throw error;
}

async function deleteSlide(slideId: string) {
  const { error } = await supabase
    .from('hero_slides')
    .delete()
    .eq('id', slideId);
  
  if (error) throw error;
}

async function readConfig(): Promise<SliderConfig | null> {
  try {
    const { data, error } = await supabase
      .from('slider_config')
      .select('*')
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('[hero-slides] Erro ao ler config:', error);
    return null;
  }
}

async function writeConfig(cfg: SliderConfig) {
  const { error } = await supabase
    .from('slider_config')
    .upsert({ id: 1, ...cfg }, { onConflict: 'id' });
  
  if (error) throw error;
}

// Slides padrão para fallback
const DEFAULT_SLIDES: HeroSlide[] = [
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
    cta1Style: "primary",
    cta2Text: "Sou jornaleiro",
    cta2Link: "/jornaleiro",
    cta2Style: "outline",
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
    cta1Style: "primary",
    cta2Text: "Bancas próximas",
    cta2Link: "/bancas-perto-de-mim",
    cta2Style: "outline",
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
    cta1Style: "primary",
    cta2Text: "Como funciona",
    cta2Link: "/minha-conta",
    cta2Style: "outline",
    active: true,
    order: 3
  }
];

const DEFAULT_CONFIG: SliderConfig = {
  autoPlayTime: 6000,
  transitionSpeed: 600,
  showArrows: true,
  showDots: true,
  heightDesktop: 520,
  heightMobile: 360
};

// Verificar autenticação admin
function verifyAdminAuth(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || authHeader !== "Bearer admin-token") {
    return false;
  }
  return true;
}

// GET - Buscar slides
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const admin = searchParams.get("admin");

    // Buscar configuração
    if (type === "config") {
      const config = await readConfig() || DEFAULT_CONFIG;
      return NextResponse.json({ success: true, data: config });
    }

    // Buscar slides do banco
    const heroSlides = await readSlides();
    const sliderConfig = await readConfig() || DEFAULT_CONFIG;
    
    // Usar fallback se não houver slides
    const slides = heroSlides.length > 0 ? heroSlides : DEFAULT_SLIDES;

    // Se for admin, retornar todos os slides
    if (admin === "true") {
      return NextResponse.json({ 
        success: true, 
        data: slides, 
        config: sliderConfig 
      });
    }

    // Retornar apenas slides ativos para o frontend público
    const publicSlides = slides.filter(slide => slide.active);

    return NextResponse.json({ 
      success: true, 
      data: publicSlides,
      config: sliderConfig 
    });
  } catch (error) {
    console.error('[hero-slides GET] Erro:', error);
    return NextResponse.json(
      { success: false, error: "Erro ao buscar slides" },
      { status: 500 }
    );
  }
}

// POST - Criar novo slide
export async function POST(request: NextRequest) {
  try {
    if (!verifyAdminAuth(request)) {
      return NextResponse.json(
        { success: false, error: "Não autorizado" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { type, data } = body;

    if (type === "config") {
      await writeConfig(data);
      return NextResponse.json({ success: true, data });
    }

    // Criar novo slide
    const current = await readSlides();
    const newSlide: HeroSlide = {
      ...data,
      id: `slide-${Date.now()}`,
      order: current.length + 1
    };

    await writeSlide(newSlide);
    return NextResponse.json({ success: true, data: newSlide });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Erro ao criar slide" },
      { status: 500 }
    );
  }
}

// PUT - Atualizar slide
export async function PUT(request: NextRequest) {
  try {
    if (!verifyAdminAuth(request)) {
      return NextResponse.json(
        { success: false, error: "Não autorizado" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { type, data } = body;

    if (type === "config") {
      await writeConfig(data);
      return NextResponse.json({ success: true, data });
    }

    if (type === "bulk") {
      // Atualização em lote (reordenação, ativação/desativação)
      for (const slide of data) {
        await writeSlide(slide);
      }
      return NextResponse.json({ success: true, data });
    }

    // Atualizar slide individual
    const heroSlides = await readSlides();
    const existingSlide = heroSlides.find(s => s.id === data.id);
    if (!existingSlide) {
      return NextResponse.json(
        { success: false, error: "Slide não encontrado" },
        { status: 404 }
      );
    }

    const updatedSlide = { ...existingSlide, ...data };
    await writeSlide(updatedSlide);
    return NextResponse.json({ success: true, data: updatedSlide });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Erro ao atualizar slide" },
      { status: 500 }
    );
  }
}

// DELETE - Excluir slide
export async function DELETE(request: NextRequest) {
  try {
    if (!verifyAdminAuth(request)) {
      return NextResponse.json(
        { success: false, error: "Não autorizado" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const slideId = searchParams.get("id");

    if (!slideId) {
      return NextResponse.json(
        { success: false, error: "ID do slide é obrigatório" },
        { status: 400 }
      );
    }

    const heroSlides = await readSlides();
    const existingSlide = heroSlides.find(s => s.id === slideId);
    if (!existingSlide) {
      return NextResponse.json(
        { success: false, error: "Slide não encontrado" },
        { status: 404 }
      );
    }

    await deleteSlide(slideId);
    
    // Reordenar slides restantes
    const remainingSlides = heroSlides.filter(s => s.id !== slideId);
    for (let i = 0; i < remainingSlides.length; i++) {
      remainingSlides[i].order = i + 1;
      await writeSlide(remainingSlides[i]);
    }
    
    return NextResponse.json({ success: true, data: remainingSlides });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Erro ao excluir slide" },
      { status: 500 }
    );
  }
}
