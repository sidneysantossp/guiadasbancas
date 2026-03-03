const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function sincronizarCategoriasGlobal() {
  try {
    console.log('🔄 Iniciando sincronização global de categorias...\n');

    // 1. Buscar todas as categorias de distribuidor_categories
    const { data: distCategorias, error: distError } = await supabase
      .from('distribuidor_categories')
      .select('*')
      .eq('ativo', true);

    if (distError) {
      console.error('❌ Erro ao buscar categorias do distribuidor:', distError);
      return;
    }

    console.log(`📊 Encontradas ${distCategorias?.length || 0} categorias ativas\n`);

    if (!distCategorias || distCategorias.length === 0) {
      console.log('⚠️ Nenhuma categoria para sincronizar');
      return;
    }

    // 2. Agrupar por mercos_id (categorias únicas)
    const categoriasUnicas = new Map();
    distCategorias.forEach(cat => {
      if (cat.mercos_id && !categoriasUnicas.has(cat.mercos_id)) {
        categoriasUnicas.set(cat.mercos_id, cat);
      }
    });

    console.log(`🔍 ${categoriasUnicas.size} categorias únicas (por mercos_id)\n`);

    let processadas = 0;
    let criadas = 0;
    let atualizadas = 0;
    let erros = 0;

    // 3. Processar cada categoria única
    for (const [mercosId, distCat] of categoriasUnicas) {
      try {
        console.log(`📝 Processando: ${distCat.nome} (Mercos ID: ${mercosId})`);

        // Verificar se já existe na tabela categories
        const { data: existente, error: checkError } = await supabase
          .from('categories')
          .select('id, name, mercos_id')
          .eq('mercos_id', mercosId)
          .single();

        if (checkError && checkError.code !== 'PGRST116') {
          console.error(`   ❌ Erro ao verificar categoria: ${checkError.message}`);
          erros++;
          continue;
        }

        const agora = new Date().toISOString();
        
        // Gerar slug/link a partir do nome
        const slug = distCat.nome
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '') // Remove acentos
          .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
          .trim()
          .replace(/\s+/g, '-') // Substitui espaços por hífens
          .replace(/-+/g, '-'); // Remove hífens duplicados
        
        const link = `/categorias/${slug}`;

        if (existente) {
          // Atualizar categoria existente
          const { error: updateError } = await supabase
            .from('categories')
            .update({
              name: distCat.nome,
              ultima_sincronizacao: agora,
              active: true
            })
            .eq('id', existente.id);

          if (updateError) {
            console.error(`   ❌ Erro ao atualizar: ${updateError.message}`);
            erros++;
          } else {
            console.log(`   ✅ Atualizada`);
            atualizadas++;
          }
        } else {
          // Criar nova categoria
          const { error: insertError } = await supabase
            .from('categories')
            .insert({
              name: distCat.nome,
              link: link,
              mercos_id: mercosId,
              active: true,
              visible: true,
              order: 0,
              ultima_sincronizacao: agora
            });

          if (insertError) {
            console.error(`   ❌ Erro ao criar: ${insertError.message}`);
            erros++;
          } else {
            console.log(`   ✅ Criada (link: ${link})`);
            criadas++;
          }
        }

        processadas++;

      } catch (error) {
        console.error(`   ❌ Erro ao processar categoria:`, error);
        erros++;
      }
    }

    // 4. Resumo
    console.log('\n' + '═'.repeat(60));
    console.log('📊 RESUMO DA SINCRONIZAÇÃO');
    console.log('═'.repeat(60));
    console.log(`Total processadas: ${processadas}`);
    console.log(`Categorias criadas: ${criadas}`);
    console.log(`Categorias atualizadas: ${atualizadas}`);
    console.log(`Erros: ${erros}`);
    console.log('═'.repeat(60));

    // 5. Verificar resultado final
    const { data: finalCategorias, error: finalError } = await supabase
      .from('categories')
      .select('id, name, mercos_id, ultima_sincronizacao')
      .not('mercos_id', 'is', null)
      .order('name');

    if (!finalError && finalCategorias) {
      console.log(`\n✅ Total de categorias sincronizadas na tabela global: ${finalCategorias.length}\n`);
      
      console.log('Categorias na tabela global:');
      console.log('─'.repeat(60));
      finalCategorias.forEach((cat, idx) => {
        console.log(`${idx + 1}. ${cat.name} (Mercos ID: ${cat.mercos_id})`);
      });
    }

  } catch (error) {
    console.error('❌ Erro na sincronização:', error);
  }
}

sincronizarCategoriasGlobal();
