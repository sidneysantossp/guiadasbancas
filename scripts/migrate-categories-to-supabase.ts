import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rgqlncxrzwgjreggrjcq.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJncWxuY3hyendnanJlZ2dyamNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTIyMzI5MywiZXhwIjoyMDc0Nzk5MjkzfQ.bdkHUKuaDQ22lZqMmFMT_3P3L0VAK11mGlJ6YkU3d6s';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface Category {
  id: string;
  name: string;
  image: string;
  link: string;
  active: boolean;
  order: number;
}

async function migrateCategories() {
  console.log('🚀 Iniciando migração de categorias...\n');

  try {
    // 1. Ler arquivo JSON
    const filePath = join(process.cwd(), 'data', 'categories.json');
    const fileContent = readFileSync(filePath, 'utf-8');
    const categories: Category[] = JSON.parse(fileContent);

    console.log(`📂 Encontradas ${categories.length} categorias no arquivo JSON\n`);

    // 2. Verificar categorias existentes no Supabase
    const { data: existing, error: fetchError } = await supabase
      .from('categories')
      .select('id, name');

    if (fetchError) {
      console.error('❌ Erro ao buscar categorias existentes:', fetchError);
      return;
    }

    console.log(`📊 Existem ${existing?.length || 0} categorias no Supabase\n`);

    // 3. Limpar tabela (opcional - comente se quiser manter dados existentes)
    if (existing && existing.length > 0) {
      console.log('🗑️  Limpando categorias existentes...');
      const { error: deleteError } = await supabase
        .from('categories')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

      if (deleteError) {
        console.error('❌ Erro ao limpar categorias:', deleteError);
        return;
      }
      console.log('✅ Categorias antigas removidas\n');
    }

    // 4. Inserir categorias do JSON
    console.log('📥 Inserindo categorias no Supabase...\n');

    let successCount = 0;
    let errorCount = 0;

    for (const category of categories) {
      const { error } = await supabase
        .from('categories')
        .insert([{
          name: category.name,
          image: category.image,
          link: category.link,
          active: category.active,
          order: category.order
        }]);

      if (error) {
        console.error(`❌ Erro ao inserir "${category.name}":`, error.message);
        errorCount++;
      } else {
        console.log(`✅ Inserida: ${category.name} (ordem: ${category.order})`);
        successCount++;
      }
    }

    console.log('\n📊 Resumo da migração:');
    console.log(`   ✅ Sucesso: ${successCount}`);
    console.log(`   ❌ Erros: ${errorCount}`);
    console.log(`   📦 Total: ${categories.length}`);

    // 5. Verificar resultado final
    const { data: final, error: finalError } = await supabase
      .from('categories')
      .select('*')
      .order('order', { ascending: true });

    if (finalError) {
      console.error('\n❌ Erro ao verificar resultado:', finalError);
      return;
    }

    console.log(`\n✅ Migração concluída! ${final?.length || 0} categorias no Supabase`);

  } catch (error) {
    console.error('❌ Erro durante migração:', error);
  }
}

// Executar migração
migrateCategories();
