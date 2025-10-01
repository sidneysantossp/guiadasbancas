import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

// POST - Incrementar cliques na campanha
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Primeiro buscar o valor atual
    const { data: campaign } = await supabaseAdmin
      .from('campaigns')
      .select('clicks')
      .eq('id', params.id)
      .eq('status', 'active')
      .single();

    if (!campaign) {
      return NextResponse.json({ success: false }, { status: 404 });
    }

    // Incrementar o valor
    const { error } = await supabaseAdmin
      .from('campaigns')
      .update({ 
        clicks: (campaign.clicks || 0) + 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .eq('status', 'active');

    if (error) {
      console.error('Click tracking error:', error);
      return NextResponse.json({ success: false }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Click tracking API error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
