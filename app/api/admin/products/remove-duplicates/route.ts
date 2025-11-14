import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    // 1. Buscar todos os produtos de distribuidores
    const { data: products, error } = await supabaseAdmin
      .from('products')
      .select('id, name, distribuidor_id, sku, created_at')
      .not('distribuidor_id', 'is', null)
      .order('name');
    
    if (error) throw error;
    
    // 2. Agrupar por nome + distribuidor_id
    const groups: Record<string, any[]> = {};
    products?.forEach(p => {
      const key = `${p.name}|||${p.distribuidor_id}`;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(p);
    });
    
    // 3. Encontrar duplicatas
    const duplicates = Object.entries(groups)
      .filter(([_, items]) => items.length > 1)
      .map(([key, items]) => {
        const [name, distribuidorId] = key.split('|||');
        return {
          name,
          distribuidorId,
          count: items.length,
          items: items.map(i => ({
            id: i.id,
            sku: i.sku,
            created_at: i.created_at
          }))
        };
      });
    
    const totalDuplicates = duplicates.reduce((sum, d) => sum + (d.count - 1), 0);
    
    return NextResponse.json({
      success: true,
      totalProducts: products?.length || 0,
      duplicateGroups: duplicates.length,
      totalDuplicatesToRemove: totalDuplicates,
      duplicates: duplicates.slice(0, 100) // Limitar a 100 para não sobrecarregar
    });
    
  } catch (error: any) {
    console.error('[REMOVE-DUPLICATES] Erro:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

export async function POST() {
  try {
    console.log('[REMOVE-DUPLICATES] Iniciando remoção de duplicatas...');
    
    // 1. Buscar todos os produtos de distribuidores
    const { data: products, error } = await supabaseAdmin
      .from('products')
      .select('id, name, distribuidor_id, created_at')
      .not('distribuidor_id', 'is', null)
      .order('name');
    
    if (error) throw error;
    
    // 2. Agrupar por nome + distribuidor_id
    const groups: Record<string, any[]> = {};
    products?.forEach(p => {
      const key = `${p.name}|||${p.distribuidor_id}`;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(p);
    });
    
    // 3. Identificar IDs para deletar (mantém o mais antigo)
    const idsToDelete: string[] = [];
    Object.values(groups).forEach(items => {
      if (items.length > 1) {
        // Ordenar por created_at (mais antigo primeiro)
        items.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        
        // Manter o primeiro (mais antigo), deletar o resto
        for (let i = 1; i < items.length; i++) {
          idsToDelete.push(items[i].id);
        }
      }
    });
    
    console.log(`[REMOVE-DUPLICATES] ${idsToDelete.length} produtos duplicados serão removidos`);
    
    // 4. Deletar em lotes de 100
    let deleted = 0;
    for (let i = 0; i < idsToDelete.length; i += 100) {
      const batch = idsToDelete.slice(i, i + 100);
      const { error: deleteError } = await supabaseAdmin
        .from('products')
        .delete()
        .in('id', batch);
      
      if (deleteError) {
        console.error(`[REMOVE-DUPLICATES] Erro ao deletar lote ${i / 100 + 1}:`, deleteError);
        throw deleteError;
      }
      
      deleted += batch.length;
      console.log(`[REMOVE-DUPLICATES] Progresso: ${deleted}/${idsToDelete.length}`);
    }
    
    console.log(`[REMOVE-DUPLICATES] ✅ ${deleted} produtos duplicados removidos com sucesso!`);
    
    return NextResponse.json({
      success: true,
      deleted,
      message: `${deleted} produtos duplicados foram removidos com sucesso!`
    });
    
  } catch (error: any) {
    console.error('[REMOVE-DUPLICATES] Erro:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
