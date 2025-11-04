import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { MercosAPI } from '@/lib/mercos-api';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchTerm } = await request.json();
    
    console.log('==================================================');
    console.log('[SEARCH-CATEGORY] 🔍 Buscando categoria');
    console.log('[SEARCH-CATEGORY] Distribuidor ID:', params.id);
    console.log('[SEARCH-CATEGORY] Termo de busca:', searchTerm);

    // Buscar distribuidor
    const { data: distribuidor, error: distError } = await supabaseAdmin
      .from('distribuidores')
      .select('*')
      .eq('id', params.id)
      .single();

    if (distError || !distribuidor) {
      return NextResponse.json(
        { success: false, error: 'Distribuidor não encontrado' },
        { status: 404 }
      );
    }

    console.log('[SEARCH-CATEGORY] ✅ Distribuidor:', distribuidor.nome);
    console.log('[SEARCH-CATEGORY] Application Token:', distribuidor.mercos_application_token?.substring(0, 10) + '...');
    console.log('[SEARCH-CATEGORY] Company Token:', distribuidor.mercos_company_token?.substring(0, 10) + '...');

    // Conectar à API Mercos
    const mercosApi = new MercosAPI({
      applicationToken: distribuidor.mercos_application_token,
      companyToken: distribuidor.mercos_company_token,
    });

    console.log('[SEARCH-CATEGORY] 🔌 Buscando TODAS as categorias da Mercos...');

    // Buscar TODAS as categorias (sem filtro de data)
    let allCategorias: any[] = [];
    let dataInicial = '2000-01-01T00:00:00'; // Data bem antiga para pegar tudo
    let hasMore = true;
    let pageCount = 0;

    while (hasMore && pageCount < 100) { // Limite de segurança
      pageCount++;
      const endpoint = `/categorias?alterado_apos=${dataInicial}`;
      
      console.log(`[SEARCH-CATEGORY] 📄 Página ${pageCount}: ${endpoint}`);
      
      const url = `https://app.mercos.com/api/v1${endpoint}`;
      const headers = {
        'ApplicationToken': distribuidor.mercos_application_token,
        'CompanyToken': distribuidor.mercos_company_token,
        'Content-Type': 'application/json',
      };

      const response = await fetch(url, { headers });

      if (response.status === 429) {
        const throttleError = await response.json();
        const waitTime = throttleError.tempo_ate_permitir_novamente * 1000;
        console.log(`[SEARCH-CATEGORY] ⏳ Throttling: aguardando ${throttleError.tempo_ate_permitir_novamente}s...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[SEARCH-CATEGORY] ❌ Erro:', errorText);
        throw new Error(`Erro Mercos API: ${response.status} - ${errorText}`);
      }

      const categorias = await response.json();
      const categoriasArray = Array.isArray(categorias) ? categorias : [];
      
      console.log(`[SEARCH-CATEGORY] ✅ Recebidas ${categoriasArray.length} categorias`);
      
      allCategorias = [...allCategorias, ...categoriasArray];

      // Verificar se há mais páginas
      const limitouRegistros = response.headers.get('MEUSPEDIDOS_LIMITOU_REGISTROS');
      
      if (limitouRegistros === '1' && categoriasArray.length > 0) {
        const ultimaCategoria = categoriasArray[categoriasArray.length - 1];
        dataInicial = ultimaCategoria.ultima_alteracao;
        console.log(`[SEARCH-CATEGORY] ➡️ Próxima página a partir de: ${dataInicial}`);
      } else {
        hasMore = false;
        console.log(`[SEARCH-CATEGORY] ✅ Todas as páginas buscadas!`);
      }
    }

    console.log(`[SEARCH-CATEGORY] 📊 Total de categorias: ${allCategorias.length}`);

    // Buscar categoria específica
    const categoriaEncontrada = allCategorias.find(cat => 
      cat.nome && cat.nome.toLowerCase().startsWith(searchTerm.toLowerCase())
    );

    if (categoriaEncontrada) {
      console.log('[SEARCH-CATEGORY] 🎯 CATEGORIA ENCONTRADA!');
      console.log('[SEARCH-CATEGORY] Nome:', categoriaEncontrada.nome);
      console.log('[SEARCH-CATEGORY] ID:', categoriaEncontrada.id);
      
      return NextResponse.json({
        success: true,
        encontrada: true,
        categoria: categoriaEncontrada,
        total_categorias: allCategorias.length
      });
    } else {
      console.log('[SEARCH-CATEGORY] ❌ Categoria não encontrada');
      
      // Retornar as 10 primeiras para debug
      const primeiras10 = allCategorias.slice(0, 10).map(cat => ({
        id: cat.id,
        nome: cat.nome,
        nome_inicio: cat.nome?.substring(0, 20)
      }));
      
      return NextResponse.json({
        success: true,
        encontrada: false,
        total_categorias: allCategorias.length,
        primeiras_10_categorias: primeiras10,
        message: `Categoria iniciando com '${searchTerm}' não encontrada`
      });
    }

  } catch (error: any) {
    console.error('[SEARCH-CATEGORY] ❌ ERRO FATAL:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Erro desconhecido',
        details: error.stack
      },
      { status: 500 }
    );
  }
}
