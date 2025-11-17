import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { MercosAPI } from '@/lib/mercos-api';

/**
 * GET /api/admin/distribuidores/[id]/produto-mercos?mercos_id=231829527
 * Busca um produto específico na API Mercos e retorna TODOS os campos
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const url = new URL(request.url);
    const mercosId = url.searchParams.get('mercos_id');
    const nome = url.searchParams.get('nome');
    
    if (!mercosId && !nome) {
      return NextResponse.json({ error: 'Parâmetro "mercos_id" ou "nome" é obrigatório' }, { status: 400 });
    }

    const supabase = supabaseAdmin;
    const distribuidorId = params.id;
    
    // Buscar dados do distribuidor
    const { data: distribuidor, error: distError } = await supabase
      .from('distribuidores')
      .select('*')
      .eq('id', distribuidorId)
      .single();

    if (distError || !distribuidor) {
      return NextResponse.json({ error: 'Distribuidor não encontrado' }, { status: 404 });
    }

    // Inicializar API Mercos
    const mercosApi = new MercosAPI({
      applicationToken: distribuidor.application_token,
      companyToken: distribuidor.company_token,
      baseUrl: distribuidor.base_url || 'https://app.mercos.com/api/v1',
    });

    console.log(`[PRODUTO-MERCOS] Buscando produto na API Mercos...`);

    let produtoEncontrado: any = null;

    if (mercosId) {
      // Buscar por ID específico
      console.log(`[PRODUTO-MERCOS] Buscando por Mercos ID: ${mercosId}`);
      
      const produtos = await mercosApi.getBatchProdutos({ limit: 200 });
      produtoEncontrado = produtos.find(p => p.id.toString() === mercosId);
      
      // Se não encontrou, buscar em mais lotes
      if (!produtoEncontrado) {
        let offset: number | null = produtos[produtos.length - 1]?.id || null;
        let tentativas = 0;
        const maxTentativas = 10;
        
        while (!produtoEncontrado && tentativas < maxTentativas && offset) {
          const maisProds = await mercosApi.getBatchProdutos({ limit: 200, afterId: offset });
          if (maisProds.length === 0) break;
          
          produtoEncontrado = maisProds.find(p => p.id.toString() === mercosId);
          offset = maisProds[maisProds.length - 1]?.id || null;
          tentativas++;
        }
      }
    } else if (nome) {
      // Buscar por nome
      console.log(`[PRODUTO-MERCOS] Buscando por nome: ${nome}`);
      
      let offset: number | null = null;
      let tentativas = 0;
      const maxTentativas = 5;
      
      while (!produtoEncontrado && tentativas < maxTentativas) {
        const produtos = await mercosApi.getBatchProdutos({ limit: 200, afterId: offset });
        if (produtos.length === 0) break;
        
        produtoEncontrado = produtos.find(p => 
          p.nome?.toLowerCase().includes(nome.toLowerCase())
        );
        
        offset = produtos[produtos.length - 1]?.id || null;
        tentativas++;
      }
    }

    if (!produtoEncontrado) {
      return NextResponse.json({
        success: false,
        error: 'Produto não encontrado na API Mercos',
        distribuidor: {
          id: distribuidor.id,
          nome: distribuidor.nome,
        },
      }, { status: 404 });
    }

    console.log(`[PRODUTO-MERCOS] Produto encontrado!`);
    console.log(`[PRODUTO-MERCOS] Campos disponíveis: ${Object.keys(produtoEncontrado).join(', ')}`);

    // Listar TODOS os campos e seus tipos
    const camposDetalhados: any = {};
    for (const [key, value] of Object.entries(produtoEncontrado)) {
      camposDetalhados[key] = {
        tipo: Array.isArray(value) ? 'array' : typeof value,
        valor: value,
        preenchido: value !== null && value !== undefined && value !== '',
      };
    }

    // Verificar no nosso banco
    const { data: produtoNoBanco } = await supabase
      .from('products')
      .select('*')
      .eq('distribuidor_id', distribuidorId)
      .eq('mercos_id', produtoEncontrado.id)
      .single();

    return NextResponse.json({
      success: true,
      distribuidor: {
        id: distribuidor.id,
        nome: distribuidor.nome,
      },
      mercos: {
        produto_completo: produtoEncontrado,
        campos_detalhados: camposDetalhados,
        total_campos: Object.keys(produtoEncontrado).length,
        campos_preenchidos: Object.values(camposDetalhados).filter((c: any) => c.preenchido).length,
        campos_vazios: Object.values(camposDetalhados).filter((c: any) => !c.preenchido).length,
      },
      nosso_banco: produtoNoBanco ? {
        existe: true,
        produto: produtoNoBanco,
      } : {
        existe: false,
      },
    });
  } catch (error: any) {
    console.error('[PRODUTO-MERCOS] Erro:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
