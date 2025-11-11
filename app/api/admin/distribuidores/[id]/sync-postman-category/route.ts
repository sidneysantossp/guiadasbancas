import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

const SANDBOX_APP_TOKEN = 'd39001ac-0b14-11f0-8ed7-6e1485be00f2';
const COMPANY_TOKEN = '4b866744-a086-11f0-ada6-5e65486a6283';

async function fetchWith429Retry(url: string, init: RequestInit, maxAttempts = 6): Promise<Response> {
  let attempt = 1;
  while (true) {
    const res = await fetch(url, init);
    if (res.status !== 429) return res;
    const body = await res.json().catch(() => ({ tempo_ate_permitir_novamente: 5 }));
    const serverWait = (body?.tempo_ate_permitir_novamente ?? 5) * 1000;
    const backoff = Math.min(30000, 1000 * Math.pow(2, attempt - 1));
    const wait = Math.max(serverWait, backoff);
    if (attempt >= maxAttempts) {
      return res; // devolve o 429 após esgotar tentativas
    }
    console.warn(`[SYNC-POSTMAN] 429 recebido. Tentativa ${attempt}/${maxAttempts - 1}. Aguardando ${Math.round(wait/1000)}s...`);
    await new Promise(r => setTimeout(r, wait));
    attempt++;
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const distribuidorId = params.id;
    
    console.log(`[SYNC-POSTMAN] 🔄 Sincronizando categoria do Postman para distribuidor ${distribuidorId}...`);
    
    // 1. BUSCAR CATEGORIA ESPECÍFICA NA API MERCOS (igual ao Postman)
    const timestamp = '2025-11-11 09:51:05';
    const mercosUrl = `https://sandbox.mercos.com/api/v1/categorias?alterado_apos=${encodeURIComponent(timestamp)}`;
    
    console.log(`[SYNC-POSTMAN] 📡 URL: ${mercosUrl}`);
    
    const mercosResponse = await fetchWith429Retry(mercosUrl, {
      headers: {
        'ApplicationToken': SANDBOX_APP_TOKEN,
        'CompanyToken': COMPANY_TOKEN,
        'Content-Type': 'application/json'
      }
    });
    
    if (!mercosResponse.ok) {
      const errText = await mercosResponse.text().catch(() => '');
      throw new Error(`Mercos API error: ${mercosResponse.status} ${errText}`);
    }
    
    const categorias = await mercosResponse.json();
    const categoriasArray = Array.isArray(categorias) ? categorias : [];
    
    console.log(`[SYNC-POSTMAN] 📦 Recebidas ${categoriasArray.length} categorias da Mercos`);
    
    // 2. PROCURAR A CATEGORIA ESPECÍFICA
    const targetCategory = categoriasArray.find(cat => 
      cat.nome && cat.nome.includes('0819565d')
    );
    
    if (!targetCategory) {
      return NextResponse.json({
        success: false,
        message: 'Categoria 0819565d não encontrada na API Mercos',
        total_categorias_mercos: categoriasArray.length,
        categorias_exemplo: categoriasArray.slice(0, 3).map(cat => cat.nome)
      });
    }
    
    console.log(`[SYNC-POSTMAN] 🎯 Categoria encontrada: ${targetCategory.nome}`);
    
    // 3. INSERIR/ATUALIZAR NO BANCO
    const { data: existing } = await supabaseAdmin
      .from('distribuidor_categories')
      .select('id')
      .eq('distribuidor_id', distribuidorId)
      .eq('mercos_id', targetCategory.id)
      .single();
    
    let result;
    
    if (existing) {
      // Atualizar
      const { data: updated, error: updateError } = await supabaseAdmin
        .from('distribuidor_categories')
        .update({
          nome: targetCategory.nome,
          categoria_pai_id: targetCategory.categoria_pai_id,
          ativo: !targetCategory.excluido,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id)
        .select();
      
      if (updateError) {
        throw updateError;
      }
      
      result = { action: 'updated', data: updated[0] };
      console.log(`[SYNC-POSTMAN] ✅ Categoria atualizada`);
    } else {
      // Inserir
      const { data: inserted, error: insertError } = await supabaseAdmin
        .from('distribuidor_categories')
        .insert({
          distribuidor_id: distribuidorId,
          mercos_id: targetCategory.id,
          nome: targetCategory.nome,
          categoria_pai_id: targetCategory.categoria_pai_id,
          ativo: !targetCategory.excluido
        })
        .select();
      
      if (insertError) {
        throw insertError;
      }
      
      result = { action: 'inserted', data: inserted[0] };
      console.log(`[SYNC-POSTMAN] ✅ Categoria inserida`);
    }
    
    // 4. VERIFICAR SE APARECE NA LISTAGEM
    const { data: verification, count } = await supabaseAdmin
      .from('distribuidor_categories')
      .select('*', { count: 'exact' })
      .eq('distribuidor_id', distribuidorId)
      .order('nome', { ascending: true })
      .limit(10);
    
    const foundInList = verification?.find(cat => cat.nome && cat.nome.includes('0819565d'));
    
    return NextResponse.json({
      success: true,
      action: result.action,
      categoria: {
        id_banco: result.data.id,
        mercos_id: result.data.mercos_id,
        nome: result.data.nome,
        ativo: result.data.ativo
      },
      verificacao: {
        total_categorias: count,
        categoria_aparece_na_lista: !!foundInList,
        primeiras_10: verification?.map((cat, idx) => ({
          posicao: idx + 1,
          nome: cat.nome,
          mercos_id: cat.mercos_id
        }))
      }
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    
  } catch (error: any) {
    console.error('[SYNC-POSTMAN] ❌ Erro:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
