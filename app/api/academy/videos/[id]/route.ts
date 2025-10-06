import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

/**
 * GET /api/academy/videos/[id]
 * Buscar vídeo específico
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabase
      .from('academy_videos')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) {
      console.error('[Academy Video API] Erro ao buscar vídeo:', error);
      return NextResponse.json({
        success: false,
        error: 'Vídeo não encontrado'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      video: data
    });
  } catch (error) {
    console.error('[Academy Video API] Erro:', error);
    return NextResponse.json({
      success: false,
      error: 'Erro interno do servidor'
    }, { status: 500 });
  }
}

/**
 * PUT /api/academy/videos/[id]
 * Atualizar vídeo (Admin apenas)
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { title, description, youtube_url, category, order_index, is_active } = body;

    const updateData: any = {};

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (order_index !== undefined) updateData.order_index = order_index;
    if (is_active !== undefined) updateData.is_active = is_active;

    if (youtube_url !== undefined) {
      const youtubeId = extractYouTubeId(youtube_url);
      if (!youtubeId) {
        return NextResponse.json({
          success: false,
          error: 'URL do YouTube inválido'
        }, { status: 400 });
      }
      updateData.youtube_url = youtube_url;
      updateData.youtube_id = youtubeId;
    }

    const { data, error } = await supabase
      .from('academy_videos')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      console.error('[Academy Video API] Erro ao atualizar vídeo:', error);
      return NextResponse.json({
        success: false,
        error: 'Erro ao atualizar vídeo'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      video: data
    });
  } catch (error) {
    console.error('[Academy Video API] Erro:', error);
    return NextResponse.json({
      success: false,
      error: 'Erro interno do servidor'
    }, { status: 500 });
  }
}

/**
 * DELETE /api/academy/videos/[id]
 * Deletar vídeo (Admin apenas)
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await supabase
      .from('academy_videos')
      .delete()
      .eq('id', params.id);

    if (error) {
      console.error('[Academy Video API] Erro ao deletar vídeo:', error);
      return NextResponse.json({
        success: false,
        error: 'Erro ao deletar vídeo'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Vídeo deletado com sucesso'
    });
  } catch (error) {
    console.error('[Academy Video API] Erro:', error);
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
