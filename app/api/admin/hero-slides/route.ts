import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from 'fs';
import path from 'path';

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

// Simulação de banco de dados em memória (em produção seria um banco real)
const SLIDES_PATH = path.join(process.cwd(), 'data', 'hero-slides.json');
const CONFIG_PATH = path.join(process.cwd(), 'data', 'slider-config.json');

async function readSlides(): Promise<HeroSlide[]> {
  try {
    const raw = await fs.readFile(SLIDES_PATH, 'utf-8');
    const parsed = JSON.parse(raw || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeSlides(items: HeroSlide[]) {
  await fs.mkdir(path.dirname(SLIDES_PATH), { recursive: true });
  await fs.writeFile(SLIDES_PATH, JSON.stringify(items, null, 2), 'utf-8');
}

async function readConfig(): Promise<SliderConfig | null> {
  try {
    const raw = await fs.readFile(CONFIG_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function writeConfig(cfg: SliderConfig) {
  await fs.mkdir(path.dirname(CONFIG_PATH), { recursive: true });
  await fs.writeFile(CONFIG_PATH, JSON.stringify(cfg, null, 2), 'utf-8');
}

let heroSlides: HeroSlide[] = [
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

let sliderConfig: SliderConfig = {
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
    // Sempre tentar carregar do disco
    const diskSlides = await readSlides();
    if (diskSlides.length > 0) heroSlides = diskSlides as HeroSlide[];
    const diskCfg = await readConfig();
    if (diskCfg) sliderConfig = diskCfg;

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const admin = searchParams.get("admin");

    if (type === "config") {
      return NextResponse.json({ success: true, data: sliderConfig });
    }

    // Se for admin, retornar todos os slides
    if (admin === "true") {
      const allSlides = [...heroSlides].sort((a, b) => a.order - b.order);
      return NextResponse.json({ success: true, data: allSlides, config: sliderConfig });
    }

    // Retornar apenas slides ativos para o frontend público
    const publicSlides = heroSlides
      .filter(slide => slide.active)
      .sort((a, b) => a.order - b.order);

    return NextResponse.json({ 
      success: true, 
      data: publicSlides,
      config: sliderConfig 
    });
  } catch (error) {
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
      sliderConfig = { ...sliderConfig, ...data };
      await writeConfig(sliderConfig);
      return NextResponse.json({ success: true, data: sliderConfig });
    }

    // Criar novo slide
    const newSlide: HeroSlide = {
      ...data,
      id: `slide-${Date.now()}`,
      order: heroSlides.length + 1
    };

    const current = await readSlides();
    const updated = [...current, newSlide];
    heroSlides = updated;
    await writeSlides(updated);
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
      sliderConfig = { ...sliderConfig, ...data };
      await writeConfig(sliderConfig);
      return NextResponse.json({ success: true, data: sliderConfig });
    }

    if (type === "bulk") {
      // Atualização em lote (reordenação, ativação/desativação)
      heroSlides = data;
      await writeSlides(heroSlides);
      return NextResponse.json({ success: true, data: heroSlides });
    }

    // Atualizar slide individual
    const slideIndex = heroSlides.findIndex(s => s.id === data.id);
    if (slideIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Slide não encontrado" },
        { status: 404 }
      );
    }

    heroSlides[slideIndex] = { ...heroSlides[slideIndex], ...data };
    await writeSlides(heroSlides);
    return NextResponse.json({ success: true, data: heroSlides[slideIndex] });
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

    const slideIndex = heroSlides.findIndex(s => s.id === slideId);
    if (slideIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Slide não encontrado" },
        { status: 404 }
      );
    }

    heroSlides.splice(slideIndex, 1);
    // Reordenar slides restantes
    heroSlides.forEach((slide, index) => { slide.order = index + 1; });
    await writeSlides(heroSlides);
    return NextResponse.json({ success: true, data: heroSlides });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Erro ao excluir slide" },
      { status: 500 }
    );
  }
}
