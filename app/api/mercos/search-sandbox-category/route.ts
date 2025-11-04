import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const { searchTerm, companyToken } = await request.json();
    
    console.log('==================================================');
    console.log('[SANDBOX-SEARCH] 🔍 Buscando categoria NO SANDBOX');
    console.log('[SANDBOX-SEARCH] Termo de busca:', searchTerm);

    const SANDBOX_APP_TOKEN = 'd39001ac-0b14-11f0-8ed7-6e1485be00f2';
    
    if (!companyToken) {
      return NextResponse.json({
        success: false,
        error: 'Company Token do SANDBOX é obrigatório',
        info: 'Acesse https://sandbox.mercos.com e pegue o Company Token em: Minha Conta → Sistema → Integração'
      }, { status: 400 });
    }

    console.log('[SANDBOX-SEARCH] Application Token (Sandbox):', SANDBOX_APP_TOKEN.substring(0, 15) + '...');
    console.log('[SANDBOX-SEARCH] Company Token:', companyToken.substring(0, 15) + '...');

    // Buscar TODAS as categorias do SANDBOX
    let allCategorias: any[] = [];
    let dataInicial = '2000-01-01T00:00:00';
    let hasMore = true;
    let pageCount = 0;

    while (hasMore && pageCount < 100) {
      pageCount++;
      const endpoint = `/categorias?alterado_apos=${dataInicial}`;
      
      console.log(`[SANDBOX-SEARCH] 📄 Página ${pageCount}: ${endpoint}`);
      
      const url = `https://sandbox.mercos.com/api/v1${endpoint}`;
      const headers = {
        'ApplicationToken': SANDBOX_APP_TOKEN,
        'CompanyToken': companyToken,
        'Content-Type': 'application/json',
      };

      const response = await fetch(url, { headers });

      console.log(`[SANDBOX-SEARCH] Response status: ${response.status}`);

      if (response.status === 429) {
        const throttleError = await response.json();
        const waitTime = throttleError.tempo_ate_permitir_novamente * 1000;
        console.log(`[SANDBOX-SEARCH] ⏳ Throttling: aguardando ${throttleError.tempo_ate_permitir_novamente}s...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[SANDBOX-SEARCH] ❌ Erro:', errorText);
        
        if (response.status === 401) {
          return NextResponse.json({
            success: false,
            error: 'Company Token inválido ou não autorizado',
            details: errorText,
            info: 'Verifique se o Company Token é do ambiente SANDBOX'
          }, { status: 401 });
        }
        
        throw new Error(`Erro Mercos API: ${response.status} - ${errorText}`);
      }

      const categorias = await response.json();
      const categoriasArray = Array.isArray(categorias) ? categorias : [];
      
      console.log(`[SANDBOX-SEARCH] ✅ Recebidas ${categoriasArray.length} categorias`);
      
      allCategorias = [...allCategorias, ...categoriasArray];

      // Verificar se há mais páginas
      const limitouRegistros = response.headers.get('MEUSPEDIDOS_LIMITOU_REGISTROS');
      
      if (limitouRegistros === '1' && categoriasArray.length > 0) {
        const ultimaCategoria = categoriasArray[categoriasArray.length - 1];
        dataInicial = ultimaCategoria.ultima_alteracao;
        console.log(`[SANDBOX-SEARCH] ➡️ Próxima página a partir de: ${dataInicial}`);
      } else {
        hasMore = false;
        console.log(`[SANDBOX-SEARCH] ✅ Todas as páginas buscadas!`);
      }
    }

    console.log(`[SANDBOX-SEARCH] 📊 Total de categorias: ${allCategorias.length}`);

    // Buscar categoria específica
    const categoriaEncontrada = allCategorias.find(cat => 
      cat.nome && cat.nome.toLowerCase().startsWith(searchTerm.toLowerCase())
    );

    if (categoriaEncontrada) {
      console.log('[SANDBOX-SEARCH] 🎯 CATEGORIA ENCONTRADA!');
      console.log('[SANDBOX-SEARCH] Nome completo:', categoriaEncontrada.nome);
      console.log('[SANDBOX-SEARCH] ID:', categoriaEncontrada.id);
      
      return NextResponse.json({
        success: true,
        encontrada: true,
        categoria: {
          id: categoriaEncontrada.id,
          nome: categoriaEncontrada.nome,
          nome_completo: categoriaEncontrada.nome,
          categoria_pai_id: categoriaEncontrada.categoria_pai_id,
          ultima_alteracao: categoriaEncontrada.ultima_alteracao
        },
        total_categorias: allCategorias.length,
        instrucoes: 'Cole o valor do campo "nome" na tela de homologação da Mercos'
      });
    } else {
      console.log('[SANDBOX-SEARCH] ❌ Categoria não encontrada');
      
      // Retornar as 20 primeiras para análise
      const primeiras20 = allCategorias.slice(0, 20).map(cat => ({
        id: cat.id,
        nome: cat.nome,
        inicio: cat.nome?.substring(0, 10)
      }));
      
      return NextResponse.json({
        success: true,
        encontrada: false,
        total_categorias: allCategorias.length,
        primeiras_20_categorias: primeiras20,
        message: `Categoria iniciando com '${searchTerm}' não encontrada`,
        dica: 'Verifique se o termo de busca está correto ou se há categorias no sandbox'
      });
    }

  } catch (error: any) {
    console.error('[SANDBOX-SEARCH] ❌ ERRO FATAL:', error);
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
