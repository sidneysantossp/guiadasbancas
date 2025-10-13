import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase (hardcoded para garantir funcionamento)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rgqlncxrzwgjreggrjcq.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJncWxuY3hyendnanJlZ2dyamNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTIyMzI5MywiZXhwIjoyMDc0Nzk5MjkzfQ.bdkHUKuaDQ22lZqMmFMT_3P3L0VAK11mGlJ6YkU3d6s';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Configuração padrão (fallback se não houver dados no Supabase)
const defaultBanner = {
  title: "Indique a Plataforma e ganhe benefícios",
  subtitle: "Programa de Indicação",
  description: "Convide amigos e familiares para conhecer as melhores bancas. Você ajuda a comunidade e ainda pode ganhar recompensas.",
  button_text: "Indicar agora",
  button_link: "/indicar",
  image_url: "https://lh3.googleusercontent.com/gg/AAHar4ez4stpNWSyhtcKIAQdeA4bUIFfC_wbg06xK_bhJNwv7-6WCuWHfszyh8YU8B2YPf2h6mzp3OAvwWLIqfBU1PeEfl9jE8T_Gim7uvt8GCiKYXqiVIHK45aO9-NOC90ppaLjsJuWsj19ofzQNniCIW8tGUSgzVO_JX7GZsaNG40LamP77jTiT9B1Bbwbqq5eBqJUPmdWLp8h-gaDYYku0cUfsElkXiYmDoGIn8HV1AXZg1hgG-uhDJ8o4v9vTJ4d2E_yL0DUbct5q6Ka9dIaZyXjbSAa8N2x9OjnOIQO6QFICsKctq6-LxlzhEfdzymQrGE7TXpnjOpZsd6OpOfe_Lxb=s1024-rj?authuser=1",
  background_color: "#1f2937",
  text_color: "#ffffff",
  button_color: "#f97316",
  button_text_color: "#ffffff",
  overlay_opacity: 0.5,
  text_position: "center-left",
  active: true
};

// Sistema de cache robusto
interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number; // Time to live em milliseconds
}

class BannerCache {
  private cache: Map<string, CacheEntry> = new Map();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutos

  set(key: string, data: any, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
    console.log(`🗄️ Cache SET: ${key} (TTL: ${ttl}ms)`);
  }

  get(key: string): any | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      console.log(`🗄️ Cache MISS: ${key}`);
      return null;
    }

    const now = Date.now();
    const isExpired = (now - entry.timestamp) > entry.ttl;

    if (isExpired) {
      console.log(`🗄️ Cache EXPIRED: ${key}`);
      this.cache.delete(key);
      return null;
    }

    console.log(`🗄️ Cache HIT: ${key}`);
    return entry.data;
  }

  clear(): void {
    this.cache.clear();
    console.log('🗄️ Cache CLEARED');
  }

  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

const bannerCache = new BannerCache();

// Armazenamento temporário em memória (fallback para desenvolvimento)
let memoryBanner: any = null;

// Função para debug - mostrar estado atual
function debugMemoryState() {
  console.log('🔍 DEBUG - Estado da memória:', {
    hasMemoryBanner: !!memoryBanner,
    memoryBannerData: memoryBanner ? {
      title: memoryBanner.title,
      image_url: memoryBanner.image_url,
      active: memoryBanner.active
    } : null
  });
}
// Supabase já configurado acima

export async function GET() {
  try {
    console.log('📖 GET /api/admin/referral-banner - CHAMADA RECEBIDA');
    console.log('🗄️ Cache stats:', bannerCache.getStats());
    
    // Cache limpo para garantir dados atualizados
    bannerCache.clear();
    
    // Verificar cache primeiro
    const cachedBanner = bannerCache.get('active_banner');
    if (cachedBanner) {
      console.log('📖 ✅ RETORNANDO DADOS DO CACHE:', JSON.stringify(cachedBanner, null, 2));
      return NextResponse.json({ success: true, data: cachedBanner });
    }
    
    // Tentar buscar do Supabase
    try {
      const { data: banners, error } = await supabase
        .from('referral_banners')
        .select('*')
        .eq('active', true)
        .order('updated_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('📖 Erro no Supabase:', error);
        throw error;
      }

      if (banners && banners.length > 0) {
        const banner = banners[0];
        // Cachear por 2 minutos para GET requests
        bannerCache.set('active_banner', banner, 2 * 60 * 1000);
        console.log('📖 ✅ RETORNANDO DADOS DO SUPABASE (cached):', JSON.stringify(banner, null, 2));
        return NextResponse.json({ success: true, data: banner });
      }
    } catch (supabaseError) {
      console.error('📖 Erro ao acessar Supabase, tentando memória:', supabaseError);
    }
    
    // Fallback para memória se Supabase falhar
    if (memoryBanner) {
      bannerCache.set('active_banner', memoryBanner, 1 * 60 * 1000); // Cache por 1 minuto
      console.log('📖 ✅ RETORNANDO DADOS DA MEMÓRIA (cached):', JSON.stringify(memoryBanner, null, 2));
      return NextResponse.json({ success: true, data: memoryBanner });
    }
    
    console.log('📖 ⚠️ Nenhum dado encontrado, retornando padrão');
    return NextResponse.json({ success: true, data: defaultBanner });
  } catch (error) {
    console.error('📖 Erro interno:', error);
    return NextResponse.json({ success: true, data: defaultBanner });
  }
}

export async function PUT(request: NextRequest) {
  console.log('🔄 PUT /api/admin/referral-banner iniciado');
  
  try {
    const body = await request.json();
    console.log('📝 Dados recebidos COMPLETOS:', JSON.stringify(body, null, 2));
    
    // Preparar dados para salvar
    const bannerData = {
      title: body.title || defaultBanner.title,
      subtitle: body.subtitle || defaultBanner.subtitle,
      description: body.description || defaultBanner.description,
      button_text: body.button_text || defaultBanner.button_text,
      button_link: body.button_link || defaultBanner.button_link,
      image_url: body.image_url || '',
      background_color: body.background_color || defaultBanner.background_color,
      text_color: body.text_color || defaultBanner.text_color,
      button_color: body.button_color || defaultBanner.button_color,
      button_text_color: body.button_text_color || defaultBanner.button_text_color,
      overlay_opacity: body.overlay_opacity || defaultBanner.overlay_opacity,
      text_position: body.text_position || defaultBanner.text_position,
      active: body.active !== undefined ? body.active : true
    };

    let savedBanner = null;

    // Tentar salvar no Supabase
    try {
      // Primeiro, desativar todos os banners existentes se este for ativo
      if (bannerData.active) {
        await supabase
          .from('referral_banners')
          .update({ active: false })
          .eq('active', true);
      }

      // Inserir novo banner
      const { data, error } = await supabase
        .from('referral_banners')
        .insert([bannerData])
        .select()
        .single();

      if (error) {
        console.error('💾 Erro ao salvar no Supabase:', error);
        throw error;
      }

      savedBanner = data;
      
      // Limpar cache e adicionar novo dados
      bannerCache.clear();
      bannerCache.set('active_banner', savedBanner, 5 * 60 * 1000); // Cache por 5 minutos
      
      console.log('💾 ✅ Banner salvo no Supabase e cache atualizado:', JSON.stringify(savedBanner, null, 2));

      } catch (supabaseError) {
        console.error('💾 Erro no Supabase, salvando na memória:', supabaseError);
        
        // Fallback para memória
        savedBanner = {
          ...bannerData,
          id: `temp-${Date.now()}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        memoryBanner = savedBanner;
        console.log('💾 ✅ Banner salvo na memória (fallback):', JSON.stringify(savedBanner, null, 2));
      }
    
      const responseData = {
        success: true,
        data: savedBanner,
        message: savedBanner.id.startsWith('temp-') 
          ? 'Banner salvo na memória (Supabase indisponível)' 
          : 'Banner salvo no Supabase com sucesso!'
      };
      
      console.log('📤 Enviando resposta:', JSON.stringify(responseData, null, 2));
      const response = NextResponse.json(responseData);
      
      // Headers CORS
      response.headers.set('Access-Control-Allow-Origin', '*');
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      
      return response;
    } catch (error: any) {
    console.error('❌ Erro interno:', error);
    return NextResponse.json({ 
      success: false, 
      error: `Erro interno: ${error.message}` 
    }, { status: 500 });
  }
}
