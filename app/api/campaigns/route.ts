import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

// GET - Buscar campanhas ativas para exibir na home
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Buscar campanhas ativas com dados do produto e banca
    const { data, error } = await supabaseAdmin
      .from('campaigns')
      .select(`
        id,
        title,
        description,
        start_date,
        end_date,
        impressions,
        clicks,
        banca_id,
        products (
          id,
          banca_id,
          name,
          description,
          price,
          price_original,
          discount_percent,
          images,
          rating_avg,
          reviews_count,
          pronta_entrega,
          sob_encomenda,
          pre_venda,
          bancas (
            id,
            name,
            cover_image
          )
        )
      `)
      .eq('status', 'active')
      .gte('end_date', new Date().toISOString())
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Campaigns error:', error);
      return NextResponse.json({ success: false, error: 'Erro ao buscar campanhas' }, { status: 500 });
    }

    let enrichedData = data || [];

    // Garantir que todas as campanhas possuam dados de banca
    if (enrichedData.length > 0) {
      const missingBancaIds = Array.from(new Set(
        enrichedData
          .map((campaign) => {
            // products é um array, não um objeto
            const product = Array.isArray(campaign?.products) ? campaign.products[0] : campaign?.products;
            const productBancaId = product?.banca_id as string | null | undefined;
            return product?.bancas ? null : (productBancaId || (campaign?.banca_id as string | null | undefined) || null);
          })
          .filter((id): id is string => Boolean(id))
      ));

      if (missingBancaIds.length > 0) {
        const { data: bancasData, error: bancasError } = await supabaseAdmin
          .from('bancas')
          .select('id, name, cover_image, avatar')
          .in('id', missingBancaIds);

        if (!bancasError && bancasData) {
          const bancaMap = new Map<string, { id: string; name: string; cover_image?: string | null; avatar?: string | null }>();
          for (const banca of bancasData) {
            if (banca?.id) {
              bancaMap.set(banca.id, banca);
            }
          }

          enrichedData = enrichedData.map((campaign) => {
            if (!campaign?.products || campaign.products.bancas) return campaign;

            const productBancaId = campaign.products.banca_id as string | undefined | null;
            const fallbackBancaId = productBancaId || (campaign?.banca_id as string | undefined | null);

            if (!fallbackBancaId) return campaign;

            const bancaInfo = bancaMap.get(fallbackBancaId);
            if (!bancaInfo) return campaign;

            return {
              ...campaign,
              products: {
                ...campaign.products,
                bancas: {
                  id: bancaInfo.id,
                  name: bancaInfo.name,
                  cover_image: bancaInfo.cover_image ?? bancaInfo.avatar ?? null,
                },
              },
            };
          });
        } else if (bancasError) {
          console.error('Erro ao buscar dados das bancas:', bancasError);
        }
      }
    }

    // Incrementar impressões (fazemos isso de forma assíncrona para não afetar a performance)
    if (enrichedData.length > 0) {
      const campaignIds = enrichedData.map(c => c.id);
      // Executar em background sem aguardar
      (async () => {
        try {
          const { data: campaigns } = await supabaseAdmin
            .from('campaigns')
            .select('id, impressions')
            .in('id', campaignIds);
          
          if (campaigns) {
            for (const campaign of campaigns) {
              try {
                await supabaseAdmin
                  .from('campaigns')
                  .update({ 
                    impressions: (campaign.impressions || 0) + 1,
                    updated_at: new Date().toISOString()
                  })
                  .eq('id', campaign.id);
              } catch (error) {
                // Ignorar erros de impressão
              }
            }
          }
        } catch (error) {
          // Ignorar erros de impressão
        }
      })();
    }

    return NextResponse.json({
      success: true,
      data: enrichedData,
      total: enrichedData.length
    });
  } catch (error) {
    console.error('Campaigns API error:', error);
    return NextResponse.json({ success: false, error: 'Erro interno' }, { status: 500 });
  }
}
