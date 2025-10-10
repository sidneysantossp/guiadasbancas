import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase: any = null;

// Só inicializar Supabase se as variáveis estiverem disponíveis
if (supabaseUrl && supabaseServiceKey) {
  supabase = createClient(supabaseUrl, supabaseServiceKey);
}

// POST - Registrar clique no banner
export async function POST(request: NextRequest) {
  try {
    console.log('📊 POST /api/admin/vendor-banner/analytics - Registrando clique');
    
    const body = await request.json();
    const { banner_id, user_agent, referrer } = body;

    if (!banner_id) {
      return NextResponse.json({ 
        success: false, 
        error: 'banner_id é obrigatório' 
      }, { status: 400 });
    }

    // Tentar incrementar contador no Supabase se disponível
    if (supabase) {
      try {
      // Primeiro, buscar o valor atual
      const { data: currentBanner } = await supabase
        .from('vendor_banners')
        .select('click_count')
        .eq('id', banner_id)
        .single();

      const currentCount = currentBanner?.click_count || 0;

      // Atualizar com o novo valor
      const { error } = await supabase
        .from('vendor_banners')
        .update({ 
          click_count: currentCount + 1
        })
        .eq('id', banner_id);

      if (error) {
        console.error('📊 Erro ao incrementar contador no Supabase:', error);
        throw error;
      }

      console.log('📊 ✅ Clique registrado no Supabase para banner:', banner_id);

      // Opcional: Registrar dados detalhados em uma tabela de analytics
      try {
        await supabase
          .from('banner_analytics')
          .insert([{
            banner_id,
            clicked_at: new Date().toISOString(),
            user_agent: user_agent || null,
            referrer: referrer || null,
            ip_address: request.ip || null
          }]);
      } catch (analyticsError) {
        console.log('📊 ⚠️ Erro ao salvar analytics detalhados (tabela pode não existir):', analyticsError);
        // Não falhar se a tabela de analytics não existir
      }

      return NextResponse.json({ 
        success: true, 
        message: 'Clique registrado com sucesso' 
      });

      } catch (supabaseError) {
        console.error('📊 Erro no Supabase:', supabaseError);
        
        // Fallback: apenas logar o clique
        console.log('📊 ⚠️ Fallback: Clique registrado apenas no log para banner:', banner_id);
        
        return NextResponse.json({ 
          success: true, 
          message: 'Clique registrado (fallback)' 
        });
      }
    } else {
      console.log('📊 ⚠️ Supabase não configurado, apenas logando clique para banner:', banner_id);
      
      return NextResponse.json({ 
        success: true, 
        message: 'Clique registrado (Supabase não disponível)' 
      });
    }

  } catch (error: any) {
    console.error('📊 ❌ Erro interno:', error);
    return NextResponse.json({ 
      success: false, 
      error: `Erro interno: ${error.message}` 
    }, { status: 500 });
  }
}

// GET - Obter estatísticas do banner
export async function GET(request: NextRequest) {
  try {
    console.log('📊 GET /api/admin/vendor-banner/analytics - Obtendo estatísticas');
    
    const { searchParams } = new URL(request.url);
    const banner_id = searchParams.get('banner_id');

    if (!banner_id) {
      return NextResponse.json({ 
        success: false, 
        error: 'banner_id é obrigatório' 
      }, { status: 400 });
    }

    // Buscar estatísticas do banner se Supabase disponível
    if (supabase) {
      try {
      const { data: banner, error } = await supabase
        .from('vendor_banners')
        .select('id, title, click_count, created_at, updated_at')
        .eq('id', banner_id)
        .single();

      if (error) {
        console.error('📊 Erro ao buscar estatísticas no Supabase:', error);
        throw error;
      }

      if (!banner) {
        return NextResponse.json({ 
          success: false, 
          error: 'Banner não encontrado' 
        }, { status: 404 });
      }

      // Tentar buscar analytics detalhados se a tabela existir
      let detailedAnalytics = null;
      try {
        const { data: analytics } = await supabase
          .from('banner_analytics')
          .select('clicked_at, user_agent, referrer')
          .eq('banner_id', banner_id)
          .order('clicked_at', { ascending: false })
          .limit(100);

        detailedAnalytics = analytics;
      } catch (analyticsError) {
        console.log('📊 ⚠️ Tabela de analytics detalhados não disponível');
      }

      const stats = {
        banner_id: banner.id,
        title: banner.title,
        total_clicks: banner.click_count || 0,
        created_at: banner.created_at,
        updated_at: banner.updated_at,
        recent_clicks: detailedAnalytics || []
      };

      console.log('📊 ✅ Estatísticas obtidas:', stats);

      return NextResponse.json({ 
        success: true, 
        data: stats 
      });

      } catch (supabaseError) {
        console.error('📊 Erro no Supabase:', supabaseError);
        
        return NextResponse.json({ 
          success: false, 
          error: 'Erro ao obter estatísticas' 
        }, { status: 500 });
      }
    } else {
      return NextResponse.json({ 
        success: false, 
        error: 'Supabase não configurado' 
      }, { status: 503 });
    }

  } catch (error: any) {
    console.error('📊 ❌ Erro interno:', error);
    return NextResponse.json({ 
      success: false, 
      error: `Erro interno: ${error.message}` 
    }, { status: 500 });
  }
}
