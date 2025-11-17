import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * GET /api/admin/test-codigo-mercos
 * Testa se o campo codigo_mercos existe e está preenchido
 */
export async function GET() {
  try {
    const supabase = supabaseAdmin;
    
    // Teste 1: Tentar buscar um produto qualquer com codigo_mercos
    console.log('[TEST] Tentando buscar produtos com codigo_mercos...');
    
    const { data: produtos, error } = await supabase
      .from('products')
      .select('id, name, codigo_mercos, mercos_id, distribuidor_id')
      .limit(10);

    if (error) {
      return NextResponse.json({
        sucesso: false,
        erro: error.message,
        campo_existe: false,
        mensagem: 'O campo codigo_mercos provavelmente não existe na tabela products',
        solucao: 'Execute o SQL no Supabase para criar o campo',
      });
    }

    // Verificar se algum produto tem codigo_mercos preenchido
    const comCodigo = produtos?.filter(p => p.codigo_mercos) || [];
    const semCodigo = produtos?.filter(p => !p.codigo_mercos) || [];

    // Teste 2: Buscar produto específico JP09
    const { data: produtoJP09 } = await supabase
      .from('products')
      .select('id, name, codigo_mercos, mercos_id')
      .eq('codigo_mercos', 'JP09')
      .maybeSingle();

    // Teste 3: Buscar Bambino
    const { data: bambino } = await supabase
      .from('distribuidores')
      .select('id, nome')
      .ilike('nome', '%bambino%')
      .single();

    // Teste 4: Contar produtos da Bambino com e sem código
    let statsBambino = null;
    if (bambino) {
      const { count: totalBambino } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('distribuidor_id', bambino.id)
        .eq('active', true);

      const { count: comCodigoBambino } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('distribuidor_id', bambino.id)
        .eq('active', true)
        .not('codigo_mercos', 'is', null)
        .neq('codigo_mercos', '');

      statsBambino = {
        total: totalBambino || 0,
        com_codigo: comCodigoBambino || 0,
        sem_codigo: (totalBambino || 0) - (comCodigoBambino || 0),
      };
    }

    return NextResponse.json({
      sucesso: true,
      campo_existe: true,
      teste_amostra: {
        total_testados: produtos?.length || 0,
        com_codigo: comCodigo.length,
        sem_codigo: semCodigo.length,
        exemplos_com_codigo: comCodigo.slice(0, 3).map(p => ({
          name: p.name,
          codigo: p.codigo_mercos,
          mercos_id: p.mercos_id,
        })),
        exemplos_sem_codigo: semCodigo.slice(0, 3).map(p => ({
          name: p.name,
          mercos_id: p.mercos_id,
        })),
      },
      teste_jp09: {
        encontrado: !!produtoJP09,
        produto: produtoJP09 || null,
      },
      bambino: bambino ? {
        id: bambino.id,
        nome: bambino.nome,
        stats: statsBambino,
      } : null,
      status: comCodigo.length > 0 
        ? '✅ Campo existe e tem dados!' 
        : '⚠️ Campo existe mas está vazio. Execute a atualização de códigos.',
      proximos_passos: comCodigo.length > 0
        ? 'Tudo OK! O upload deve funcionar.'
        : [
            '1. Acesse /admin/distribuidores/[bambino-id]/atualizar-codigos',
            '2. Clique em "Atualizar Códigos"',
            '3. Aguarde ~2-3 minutos',
            '4. Tente o upload novamente',
          ],
    });

  } catch (error: any) {
    return NextResponse.json({
      sucesso: false,
      erro: error.message,
      campo_existe: false,
      mensagem: 'Erro ao verificar campo codigo_mercos',
      detalhes: error.stack?.split('\n').slice(0, 3).join('\n'),
      solucao: 'Execute o SQL no Supabase Dashboard para criar o campo codigo_mercos',
      sql: `
ALTER TABLE products ADD COLUMN IF NOT EXISTS codigo_mercos TEXT;
CREATE INDEX IF NOT EXISTS idx_products_codigo_mercos ON products(codigo_mercos) WHERE codigo_mercos IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_products_distribuidor_codigo ON products(distribuidor_id, codigo_mercos) WHERE codigo_mercos IS NOT NULL;
      `.trim(),
    }, { status: 500 });
  }
}
