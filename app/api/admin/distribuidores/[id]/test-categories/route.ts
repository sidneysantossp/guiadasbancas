import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { MercosAPI } from "@/lib/mercos-api";

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

/**
 * Teste simples de sincronização de categorias
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const distribuidorId = params.id;

    console.log('='.repeat(50));
    console.log('[TEST-CATEGORIES] 🧪 Iniciando teste de categorias');
    console.log('[TEST-CATEGORIES] Distribuidor ID:', distribuidorId);

    // Buscar distribuidor
    const { data: distribuidor, error: distribuidorError } = await supabaseAdmin
      .from('distribuidores')
      .select('*')
      .eq('id', distribuidorId)
      .single();

    if (distribuidorError || !distribuidor) {
      console.error('[TEST-CATEGORIES] ❌ Distribuidor não encontrado:', distribuidorError);
      return NextResponse.json({
        success: false,
        error: 'Distribuidor não encontrado',
      }, { status: 404 });
    }

    console.log('[TEST-CATEGORIES] ✅ Distribuidor:', distribuidor.nome);
    console.log('[TEST-CATEGORIES] Application Token:', distribuidor.mercos_application_token?.substring(0, 10) + '...');
    console.log('[TEST-CATEGORIES] Company Token:', distribuidor.mercos_company_token?.substring(0, 10) + '...');

    // Criar instância da API Mercos
    const mercosApi = new MercosAPI({
      applicationToken: distribuidor.mercos_application_token,
      companyToken: distribuidor.mercos_company_token,
    });

    // Testar conexão
    console.log('[TEST-CATEGORIES] 🔌 Testando conexão com Mercos...');
    const connectionTest = await mercosApi.testConnection();
    
    if (!connectionTest.success) {
      console.error('[TEST-CATEGORIES] ❌ Falha na conexão:', connectionTest.error);
      return NextResponse.json({
        success: false,
        error: `Falha ao conectar: ${connectionTest.error}`,
      }, { status: 400 });
    }

    console.log('[TEST-CATEGORIES] ✅ Conexão OK!');

    // Buscar categorias da Mercos
    console.log('[TEST-CATEGORIES] 📂 Buscando categorias da Mercos...');
    const categorias = await mercosApi.getAllCategorias();
    
    console.log('[TEST-CATEGORIES] ✅ Categorias recebidas:', categorias.length);

    if (categorias.length > 0) {
      console.log('[TEST-CATEGORIES] 📋 Exemplo da primeira categoria:', {
        id: categorias[0].id,
        nome: categorias[0].nome,
        excluido: categorias[0].excluido,
        categoria_pai_id: categorias[0].categoria_pai_id
      });
    }

    // Tentar inserir no banco
    console.log('[TEST-CATEGORIES] 💾 Tentando inserir categorias no banco...');
    let inseridas = 0;
    let erros = 0;

    for (const cat of categorias.slice(0, 5)) { // Apenas as primeiras 5 para teste
      if (cat.excluido) {
        console.log(`[TEST-CATEGORIES] ⏭️  Pulando categoria excluída: ${cat.nome}`);
        continue;
      }

      console.log(`[TEST-CATEGORIES] Inserindo: ${cat.nome} (Mercos ID: ${cat.id})`);

      const { error: upsertError } = await supabaseAdmin
        .from('distribuidor_categories')
        .upsert({
          distribuidor_id: distribuidorId,
          mercos_id: cat.id,
          nome: cat.nome,
          categoria_pai_id: cat.categoria_pai_id,
          ativo: !cat.excluido,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'distribuidor_id,mercos_id',
        });

      if (upsertError) {
        console.error(`[TEST-CATEGORIES] ❌ Erro ao inserir "${cat.nome}":`, upsertError);
        erros++;
      } else {
        console.log(`[TEST-CATEGORIES] ✅ Inserida: ${cat.nome}`);
        inseridas++;
      }
    }

    // Verificar quantas foram salvas
    const { data: categoriasDb, error: countError } = await supabaseAdmin
      .from('distribuidor_categories')
      .select('id, mercos_id, nome')
      .eq('distribuidor_id', distribuidorId);

    console.log('[TEST-CATEGORIES] 📊 Categorias no banco:', categoriasDb?.length || 0);

    if (categoriasDb && categoriasDb.length > 0) {
      console.log('[TEST-CATEGORIES] Primeiras 3 no banco:', categoriasDb.slice(0, 3));
    }

    console.log('='.repeat(50));

    return NextResponse.json({
      success: true,
      resultado: {
        categorias_mercos: categorias.length,
        inseridas_teste: inseridas,
        erros_teste: erros,
        total_no_banco: categoriasDb?.length || 0,
        primeiras_5_mercos: categorias.slice(0, 5).map(c => ({ id: c.id, nome: c.nome, excluido: c.excluido })),
        primeiras_3_banco: categoriasDb?.slice(0, 3) || []
      }
    });

  } catch (error: any) {
    console.error('[TEST-CATEGORIES] ❌ ERRO FATAL:', {
      message: error?.message,
      stack: error?.stack,
      error: error
    });
    
    return NextResponse.json({
      success: false,
      error: error?.message || 'Erro desconhecido',
      details: error?.stack
    }, { status: 500 });
  }
}
