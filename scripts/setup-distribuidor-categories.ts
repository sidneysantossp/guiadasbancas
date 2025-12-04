/**
 * Script para configurar categorias dos distribuidores
 * Mapeia os categoria_id da Mercos para nomes legíveis
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// IDs dos distribuidores
const BAMBINO_ID = '3a989c56-bbd3-4769-b076-a83483e39542';
const BRANCALEONE_ID = '1511df09-1f4a-4e68-9f8c-05cd06be6269';

// Mapeamento de categorias da Bambino (Tabacaria/Produtos)
const BAMBINO_CATEGORIES: Record<number, string> = {
  2459864: 'Tabaco e Seda',
  2480519: 'Seda OCB',
  2480521: 'Trituradores',
  2480523: 'Filtros',
  2480525: 'Tabacos Importados',
  2480575: 'Eletrônicos KD',
  2480576: 'Eletrônicos KD',
  2480577: 'Eletrônicos KD',
  2480579: 'Eletrônicos KD',
  2480719: 'Fones de Ouvido',
  2490613: 'Cigarros',
  2490614: 'Isqueiros',
  2490615: 'Palheiros',
  2494574: 'Boladores',
  2511451: 'Piteiras',
  2513001: 'Utilidades',
  2551564: 'Pelúcias',
  2568984: 'Porta Cigarros',
  2581678: 'Caixas de Som',
  2581939: 'Pilhas',
  2619661: 'Incensos',
  2620904: 'Essências',
  2625368: 'Balas e Drops',
  2625369: 'Chicletes',
  2625370: 'Chocolates',
  2656078: 'Baralhos e Cards',
  2656079: 'Baralhos',
  2656081: 'Jogos de Cartas',
  2721065: 'Carvão Narguile',
  2745753: 'Bebidas',
  2745754: 'Energéticos',
  2857893: 'Acessórios Celular',
  2892362: 'Cards Colecionáveis',
  2917787: 'Adesivos Times',
  2946455: 'Cigarros L&M',
  3077684: 'Salgadinhos',
  3226386: 'Acessórios',
  3315522: 'Brinquedos',
  3425270: 'Livros Infantis',
  3459046: 'Doces',
  3459047: 'Capinhas Celular',
};

// Mapeamento de categorias da Brancaleone (HQs/Gibis)
const BRANCALEONE_CATEGORIES: Record<number, string> = {
  3584473: 'DC Comics',
  3584474: 'Disney',
  3584475: 'Marvel',
  3584476: 'Turma da Mônica',
  3584478: 'Independentes',
  3584480: 'Conan',
  3584481: 'Mangás',
  3599981: 'Colecionáveis',
};

async function setupCategories() {
  console.log('🚀 Iniciando configuração de categorias...\n');

  // 1. Limpar categorias existentes
  console.log('🗑️  Limpando categorias antigas...');
  await supabase.from('distribuidor_categories').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  // 2. Inserir categorias da Bambino
  console.log('\n📦 Inserindo categorias da Bambino...');
  const bambinoCategories = Object.entries(BAMBINO_CATEGORIES).map(([mercosId, nome]) => ({
    distribuidor_id: BAMBINO_ID,
    mercos_id: parseInt(mercosId),
    nome,
    ativo: true,
  }));

  const { error: bambinoError } = await supabase
    .from('distribuidor_categories')
    .upsert(bambinoCategories, { onConflict: 'distribuidor_id,mercos_id' });

  if (bambinoError) {
    console.error('❌ Erro ao inserir categorias Bambino:', bambinoError);
  } else {
    console.log(`✅ ${bambinoCategories.length} categorias da Bambino inseridas`);
  }

  // 3. Inserir categorias da Brancaleone
  console.log('\n📚 Inserindo categorias da Brancaleone...');
  const brancaleoneCategories = Object.entries(BRANCALEONE_CATEGORIES).map(([mercosId, nome]) => ({
    distribuidor_id: BRANCALEONE_ID,
    mercos_id: parseInt(mercosId),
    nome,
    ativo: true,
  }));

  const { error: brancaleoneError } = await supabase
    .from('distribuidor_categories')
    .upsert(brancaleoneCategories, { onConflict: 'distribuidor_id,mercos_id' });

  if (brancaleoneError) {
    console.error('❌ Erro ao inserir categorias Brancaleone:', brancaleoneError);
  } else {
    console.log(`✅ ${brancaleoneCategories.length} categorias da Brancaleone inseridas`);
  }

  // 4. Verificar resultado
  console.log('\n📊 Verificando categorias inseridas...');
  const { data: allCategories, count } = await supabase
    .from('distribuidor_categories')
    .select('*', { count: 'exact' });

  console.log(`\n✅ Total de categorias no banco: ${count}`);
  
  // Agrupar por distribuidor
  const byDistribuidor = (allCategories || []).reduce((acc, cat) => {
    acc[cat.distribuidor_id] = (acc[cat.distribuidor_id] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  console.log('\n📈 Categorias por distribuidor:');
  console.log(`   - Bambino: ${byDistribuidor[BAMBINO_ID] || 0}`);
  console.log(`   - Brancaleone: ${byDistribuidor[BRANCALEONE_ID] || 0}`);

  console.log('\n✅ Configuração concluída!');
}

setupCategories().catch(console.error);
