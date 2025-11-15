import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const CATEGORIA_DISTRIBUIDORES_ID = 'aaaaaaaa-0000-0000-0000-000000000001';
const CATEGORIA_DISTRIBUIDORES_NOME = 'Diversos';
const DEFAULT_PRODUCT_IMAGE = 'https://placehold.co/400x600/e5e7eb/6b7280.png';

export async function GET(request: NextRequest, context: { params: { id: string } }) {
  try {
    const bancaId = context.params.id;
    if (!bancaId) {
      return NextResponse.json({ error: "ID da banca é obrigatório" }, { status: 400 });
    }

    const supabase = supabaseAdmin;

    // 0. Verificar se a banca é cotista
    const { data: banca } = await supabase
      .from('bancas')
      .select('is_cotista, cotista_id')
      .eq('id', bancaId)
      .single();

    const isCotista = banca?.is_cotista === true && !!banca?.cotista_id;
    console.log(`[PRODUCTS] Banca ${bancaId} - É cotista: ${isCotista}`);

    // 1. Buscar produtos próprios da banca
    const { data: produtosProprios } = await supabase
      .from('products')
      .select(`
        *,
        categories!category_id(name)
      `)
      .eq('banca_id', bancaId)
      .eq('active', true)
      .is('distribuidor_id', null);

    // 2. Buscar produtos de distribuidor SOMENTE se for cotista
    let todosProdutosDistribuidor: any[] = [];
    
    if (isCotista) {
      const { data } = await supabase
        .from('products')
        .select(`
          *,
          categories!category_id(name),
          distribuidores!distribuidor_id(nome)
        `)
        .eq('active', true)
        .not('distribuidor_id', 'is', null);
      
      todosProdutosDistribuidor = data || [];
      console.log(`[PRODUCTS] Cotista - ${todosProdutosDistribuidor.length} produtos de distribuidores encontrados`);
    } else {
      console.log(`[PRODUCTS] Não-cotista - produtos de distribuidores NÃO serão exibidos`);
    }

    let produtosDistribuidor: any[] = [];

    if (todosProdutosDistribuidor && todosProdutosDistribuidor.length > 0) {
      // Buscar customizações desta banca (se houver)
      const { data: customizacoes } = await supabase
        .from('banca_produtos_distribuidor')
        .select('product_id, enabled, custom_price, custom_description, custom_status, custom_pronta_entrega, custom_sob_encomenda, custom_pre_venda, custom_stock_enabled, custom_stock_qty')
        .eq('banca_id', bancaId);

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
          
          // Extrair nome do distribuidor (vem como objeto do join)
          const distribuidorNome = produto.distribuidores?.nome || '';
          
          // Se jornaleiro usa estoque próprio, usar custom_stock_qty
          // Senão, usar stock_qty do distribuidor
          const effectiveStock = custom?.custom_stock_enabled 
            ? (custom?.custom_stock_qty ?? 0)
            : produto.stock_qty;
          
          const customStatus = custom?.custom_status || 'available';
          const { categories, distribuidores, ...produtoLimpo } = produto;
          
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

    // 3. Combinar produtos próprios + distribuidor (garantir imagem em todos)
    const todosProdutos = [
      ...(produtosProprios || []).map(p => {
        let images = p.images || [];
        if (!Array.isArray(images) || images.length === 0) {
          images = [DEFAULT_PRODUCT_IMAGE];
        }
        // Extrair nome da categoria (vem como objeto do join)
        const categoryName = p.categories?.name;
        
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
      ...produtosDistribuidor,
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
