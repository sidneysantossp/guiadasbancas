import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Buscar IDs das categorias
    const { data: categories } = await supabaseAdmin
      .from('categories')
      .select('id, name')
      .in('name', ['Bebidas', 'HQs e Comics', 'Colecionáveis', 'Figurinhas', 'Acessórios']);

    const bebidasId = categories?.find(c => c.name === 'Bebidas')?.id;
    const hqsId = categories?.find(c => c.name === 'HQs e Comics')?.id;
    const colecionaveisId = categories?.find(c => c.name === 'Colecionáveis')?.id;
    const figurinhasId = categories?.find(c => c.name === 'Figurinhas')?.id;
    const acessoriosId = categories?.find(c => c.name === 'Acessórios')?.id;

    if (!bebidasId) {
        return NextResponse.json({ 
            error: "Categoria 'Bebidas' não encontrada no banco.", 
            foundCategories: categories 
        });
    }

    const results = [];

    // --- MOVIMENTO 1: HQs e Comics ---
    if (hqsId) {
      // 2. Definir padrões de nome para identificar os gibis
      // Baseado nos screenshots enviados
      const patterns = [
          'CHAIN SAW MAN', 
          'CHAINSAW MAN',
          'CHAOS GAME',
          'HOMEM-BORRACHA',
          'MIERUKO-CHAN',
          'MICKEY MOUSE',
          'MUSHOKU TENSEI',
          'A ORDEM MAGICA'
      ];

      // Construir filtro OR para o Supabase
      const orFilter = patterns.map(p => `name.ilike.%${p}%`).join(',');

      // 3. Buscar produtos que estão em Bebidas OU Colecionáveis e correspondem aos padrões
      // Para isso, precisamos de um filtro OR complexo ou duas queries. Vamos usar category_id IN (...)
      const sourceCategoryIds = [];
      if (bebidasId) sourceCategoryIds.push(bebidasId);
      if (colecionaveisId) sourceCategoryIds.push(colecionaveisId);

      if (sourceCategoryIds.length > 0) {
          const { data: productsToMove } = await supabaseAdmin
              .from('products')
              .select('id, name')
              .in('category_id', sourceCategoryIds)
              .or(orFilter);

          if (productsToMove && productsToMove.length > 0) {
              // 4. Atualizar a categoria desses produtos
              const idsToUpdate = productsToMove.map(p => p.id);
              
              await supabaseAdmin
                  .from('products')
                  .update({ category_id: hqsId })
                  .in('id', idsToUpdate);

              results.push({
                  category: 'HQs e Comics',
                  source: 'Bebidas + Colecionáveis',
                  count: productsToMove.length,
                  products: productsToMove.map(p => p.name)
              });
          }
      }
    }

    // --- MOVIMENTO 2: Colecionáveis ---
    if (colecionaveisId) {
        const patternsColecionaveis = [
            'Fichário Para Cards',
            'Miniatura Fusca'
        ];

        const orFilterColecionaveis = patternsColecionaveis.map(p => `name.ilike.%${p}%`).join(',');

        const { data: productsToMoveColecionaveis } = await supabaseAdmin
            .from('products')
            .select('id, name')
            .eq('category_id', bebidasId)
            .or(orFilterColecionaveis);

        if (productsToMoveColecionaveis && productsToMoveColecionaveis.length > 0) {
            const idsToUpdateCol = productsToMoveColecionaveis.map(p => p.id);
            
            await supabaseAdmin
                .from('products')
                .update({ category_id: colecionaveisId })
                .in('id', idsToUpdateCol);

            results.push({
                category: 'Colecionáveis',
                count: productsToMoveColecionaveis.length,
                products: productsToMoveColecionaveis.map(p => p.name)
            });
        }
    }

    // --- MOVIMENTO 3: Acessórios ---
    if (figurinhasId && acessoriosId) {
        const patternsAcessorios = [
            'Bateria'
        ];

        const orFilterAcessorios = patternsAcessorios.map(p => `name.ilike.%${p}%`).join(',');

        const { data: productsToMoveAcessorios } = await supabaseAdmin
            .from('products')
            .select('id, name')
            .eq('category_id', figurinhasId)
            .or(orFilterAcessorios);

        if (productsToMoveAcessorios && productsToMoveAcessorios.length > 0) {
            const idsToUpdateAcessorios = productsToMoveAcessorios.map(p => p.id);
            
            await supabaseAdmin
                .from('products')
                .update({ category_id: acessoriosId })
                .in('id', idsToUpdateAcessorios);

            results.push({
                category: 'Acessórios',
                source: 'Figurinhas',
                count: productsToMoveAcessorios.length,
                products: productsToMoveAcessorios.map(p => p.name)
            });
        }
    }

    return NextResponse.json({
        success: true,
        results
    });

  } catch (error: any) {
    console.error("Erro ao corrigir categorias:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
