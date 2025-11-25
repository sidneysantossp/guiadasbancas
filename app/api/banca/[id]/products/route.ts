import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// Cache de 60 segundos para melhorar performance
export const revalidate = 60;

const CATEGORIA_DISTRIBUIDORES_ID = 'aaaaaaaa-0000-0000-0000-000000000001';
const CATEGORIA_DISTRIBUIDORES_NOME = 'Diversos';
const DEFAULT_PRODUCT_IMAGE = 'https://placehold.co/400x600/e5e7eb/6b7280.png';

// Distribuidores que devem aparecer para TODAS as bancas (cotistas ou não)
const DISTRIBUIDORES_PUBLICOS = [
  '3a989c56-bbd3-4769-b076-a83483e39542', // Bambino
  '1511df09-1f4a-4e68-9f8c-05cd06be6269'  // Brancaleone
];

// Campos mínimos necessários para produtos (reduz payload)
const PRODUCT_FIELDS = `
  id, name, price, images, description, category_id, 
  distribuidor_id, stock_qty, status, codigo_mercos,
  pronta_entrega, sob_encomenda, pre_venda, track_stock, featured,
  categories!category_id(name)
`;

export async function GET(request: NextRequest, context: { params: { id: string } }) {
  try {
    const bancaId = context.params.id;
    if (!bancaId) {
      return NextResponse.json({ error: "ID da banca é obrigatório" }, { status: 400 });
    }

    const supabase = supabaseAdmin;

    // OTIMIZAÇÃO: Executar TODAS as queries em paralelo
    const [
      bancaResult,
      produtosPropriosResult,
      produtosBambinoResult,
      produtosBrancaleoneResult,
      distribuidoresResult
    ] = await Promise.all([
      // Query 1: Verificar se é cotista
      supabase
        .from('bancas')
        .select('is_cotista, cotista_id')
        .eq('id', bancaId)
        .single(),
      
      // Query 2: Produtos próprios da banca
      supabase
        .from('products')
        .select(PRODUCT_FIELDS)
        .eq('banca_id', bancaId)
        .eq('active', true)
        .is('distribuidor_id', null)
        .limit(500),
      
      // Query 3: Produtos Bambino
      supabase
        .from('products')
        .select(PRODUCT_FIELDS)
        .eq('active', true)
        .eq('distribuidor_id', DISTRIBUIDORES_PUBLICOS[0])
        .order('name', { ascending: true })
        .limit(2000),
      
      // Query 4: Produtos Brancaleone
      supabase
        .from('products')
        .select(PRODUCT_FIELDS)
        .eq('active', true)
        .eq('distribuidor_id', DISTRIBUIDORES_PUBLICOS[1])
        .order('name', { ascending: true })
        .limit(3000),
      
      // Query 5: Nomes dos distribuidores (pré-carregar)
      supabase
        .from('distribuidores')
        .select('id, nome')
        .in('id', DISTRIBUIDORES_PUBLICOS)
    ]);

    const banca = bancaResult.data;
    const produtosProprios = produtosPropriosResult.data;
    const isCotista = banca?.is_cotista === true && !!banca?.cotista_id;

    // Montar produtos de distribuidores
    let todosProdutosDistribuidor: any[] = [
      ...(produtosBrancaleoneResult.data || []),
      ...(produtosBambinoResult.data || [])
    ];
    
    // Se for cotista, buscar outros distribuidores em paralelo
    if (isCotista) {
      const { data: outrosDistribuidores } = await supabase
        .from('products')
        .select(PRODUCT_FIELDS)
        .eq('active', true)
        .not('distribuidor_id', 'is', null)
        .not('distribuidor_id', 'in', `(${DISTRIBUIDORES_PUBLICOS.join(',')})`)
        .order('name', { ascending: true })
        .limit(2000);
      
      if (outrosDistribuidores?.length) {
        todosProdutosDistribuidor = [...todosProdutosDistribuidor, ...outrosDistribuidores];
      }
    }
    
    // Buscar distribuidores e customizações em paralelo
    const [distribuidoresExtras, customizacoesResult] = await Promise.all([
      // Query: Nomes dos distribuidores
      (async () => {
        if (todosProdutosDistribuidor.length === 0) return [];
        const distribuidorIds = [...new Set(todosProdutosDistribuidor.map(p => p.distribuidor_id).filter(Boolean))];
        const { data } = await supabase
          .from('distribuidores')
          .select('id, nome')
          .in('id', distribuidorIds);
        return data || [];
      })(),
      
      // Query: Customizações da banca
      supabase
        .from('banca_produtos_distribuidor')
        .select('product_id, enabled, custom_price, custom_description, custom_status, custom_pronta_entrega, custom_sob_encomenda, custom_pre_venda, custom_stock_enabled, custom_stock_qty')
        .eq('banca_id', bancaId)
    ]);
    
    // Criar mapa de distribuidores
    const distribuidorMap = new Map((distribuidoresExtras || []).map((d: any) => [d.id, d.nome]));
    
    // Adicionar nome do distribuidor a cada produto
    todosProdutosDistribuidor = todosProdutosDistribuidor.map(p => ({
      ...p,
      distribuidor_nome: distribuidorMap.get(p.distribuidor_id) || ''
    }));

    let produtosDistribuidor: any[] = [];
    const customizacoes = customizacoesResult.data;

    if (todosProdutosDistribuidor && todosProdutosDistribuidor.length > 0) {

      // Mapear customizações por product_id
      const customMap = new Map(
        (customizacoes || []).map(c => [c.product_id, c])
      );

      // Aplicar customizações e filtrar desabilitados
      produtosDistribuidor = todosProdutosDistribuidor
        .map(produto => {
          const custom = customMap.get(produto.id);
          
          // Garantir que há uma imagem
          let images = produto.images || [];
          if (!Array.isArray(images) || images.length === 0) {
            images = [DEFAULT_PRODUCT_IMAGE];
          }
          
          // Extrair nome da categoria (vem como objeto do join)
          const categoryName = produto.categories?.name || CATEGORIA_DISTRIBUIDORES_NOME;
          
          // Nome do distribuidor já foi adicionado anteriormente
          const distribuidorNome = produto.distribuidor_nome || '';
          
          // Se jornaleiro usa estoque próprio, usar custom_stock_qty
          // Senão, usar stock_qty do distribuidor
          const effectiveStock = custom?.custom_stock_enabled 
            ? (custom?.custom_stock_qty ?? 0)
            : produto.stock_qty;
          
          const customStatus = custom?.custom_status || 'available';
          const { categories, ...produtoLimpo } = produto;
          
          return {
            ...produtoLimpo,
            images,
            category_name: categoryName,
            distribuidor_nome: distribuidorNome,
            price: custom?.custom_price || produto.price,
            stock_qty: effectiveStock, // Usar estoque efetivo (próprio ou distribuidor)
            description: produto.description + (custom?.custom_description ? `\n\n${custom.custom_description}` : ''),
            pronta_entrega: custom?.custom_pronta_entrega ?? produto.pronta_entrega,
            sob_encomenda: custom?.custom_sob_encomenda ?? produto.sob_encomenda,
            pre_venda: custom?.custom_pre_venda ?? produto.pre_venda,
            status: customStatus,
            category_id: CATEGORIA_DISTRIBUIDORES_ID,
            is_distribuidor: true,
            active: true,
            // Metadados para filtro
            _enabled: !custom || custom.enabled !== false,
            _effectiveStock: effectiveStock,
            _customStatus: customStatus,
          };
        })
        .filter(produto => {
          const custom = customMap.get(produto.id);
          
          // 1. Se tem customização e está desabilitado, não mostrar
          if (custom && custom.enabled === false) return false;
          
          // 2. Se NÃO tem customização, SEMPRE mostrar (produtos do distribuidor disponíveis para cotistas)
          if (!custom) {
            return true;
          }
          
          // 3. Se TEM customização:
          //    - Se tem estoque próprio ativado: verificar se qty > 0
          //    - Se NÃO tem estoque próprio: sempre mostrar (usa estoque do distribuidor)
          //    - OU status explicitamente 'available'
          if (custom.custom_stock_enabled) {
            return (custom.custom_stock_qty ?? 0) > 0;
          }
          
          return true; // Mostrar se não tem estoque próprio ativado
        })
        .map(({ _enabled, _effectiveStock, _customStatus, ...produto }) => produto);
    }

    // 3. Combinar produtos: Brancaleone PRIMEIRO, depois próprios, depois outros distribuidores
    // Separar produtos por distribuidor
    const produtosBrancaleoneFilter = produtosDistribuidor.filter(p => 
      p.distribuidor_id === DISTRIBUIDORES_PUBLICOS[1] // Brancaleone
    );
    const produtosBambinoFilter = produtosDistribuidor.filter(p => 
      p.distribuidor_id === DISTRIBUIDORES_PUBLICOS[0] // Bambino
    );
    const produtosOutrosDistribuidores = produtosDistribuidor.filter(p => 
      !DISTRIBUIDORES_PUBLICOS.includes(p.distribuidor_id)
    );
    
    const todosProdutos = [
      // 1. Brancaleone PRIMEIRO
      ...produtosBrancaleoneFilter,
      // 2. Produtos próprios da banca
      ...(produtosProprios || []).map((p: any) => {
        let images = p.images || [];
        if (!Array.isArray(images) || images.length === 0) {
          images = [DEFAULT_PRODUCT_IMAGE];
        }
        // Extrair nome da categoria (vem como objeto do join)
        const categoryName = p.categories?.name || CATEGORIA_DISTRIBUIDORES_NOME;
        
        // Remover objeto categories (nested) para evitar problemas no frontend
        const { categories, ...produtoLimpo } = p;
        
        return { 
          ...produtoLimpo, 
          images, 
          category_name: categoryName,
          is_distribuidor: false, 
          active: true 
        };
      }),
      // 3. Bambino
      ...produtosBambinoFilter,
      // 4. Outros distribuidores (se cotista)
      ...produtosOutrosDistribuidores,
    ];

    return NextResponse.json({
      success: true,
      banca_id: bancaId,
      is_cotista: isCotista,
      total: todosProdutos.length,
      products: todosProdutos,
      stats: {
        proprios: produtosProprios?.length || 0,
        distribuidores: produtosDistribuidor.length,
      },
    });

  } catch (error: any) {
    console.error('Erro ao buscar produtos da banca:', error);
    return NextResponse.json({ 
      success: false, 
      error: "Erro interno do servidor",
      details: error?.message 
    }, { status: 500 });
  }
}
// Force rebuild Sat Nov 15 18:02:32 -03 2025
