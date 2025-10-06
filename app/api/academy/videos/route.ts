import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

/**
 * GET /api/academy/videos
 * Lista todos os vídeos da Academy (ativos)
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const includeInactive = searchParams.get('all') === 'true';

    let query = supabase
      .from('academy_videos')
      .select('*')
      .order('order_index', { ascending: true });

    if (!includeInactive) {
      query = query.eq('is_active', true);
    }

    const { data, error } = await query;

    if (error) {
      console.error('[Academy Videos API] Erro ao buscar vídeos:', error);
      return NextResponse.json({ 
        success: false, 
        error: 'Erro ao buscar vídeos' 
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      videos: data || []
    });
  } catch (error) {
    console.error('[Academy Videos API] Erro:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}

/**
 * POST /api/academy/videos
 * Criar novo vídeo (Admin apenas)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, youtube_url, category, order_index } = body;

    if (!title || !youtube_url) {
      return NextResponse.json({
        success: false,
        error: 'Título e URL do YouTube são obrigatórios'
      }, { status: 400 });
    }

    // Extrair ID do YouTube do URL
    const youtubeId = extractYouTubeId(youtube_url);
    if (!youtubeId) {
      return NextResponse.json({
        success: false,
        error: 'URL do YouTube inválido'
      }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('academy_videos')
      .insert({
        title,
        description: description || null,
        youtube_url,
        youtube_id: youtubeId,
        category: category || null,
        order_index: order_index || 0
      })
      .select()
      .single();

    if (error) {
      console.error('[Academy Videos API] Erro ao criar vídeo:', error);
      return NextResponse.json({
        success: false,
        error: 'Erro ao criar vídeo'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      video: data
    });
  } catch (error) {
    console.error('[Academy Videos API] Erro:', error);
    return NextResponse.json({
      success: false,
      error: 'Erro interno do servidor'
    }, { status: 500 });
  }
}

/**
 * Extrair ID do vídeo do YouTube do URL
 */
function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/ // ID direto
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}
