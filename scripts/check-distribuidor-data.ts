import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hsjhjcgjejfyfkphoymp.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY não definida');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkData() {
  console.log('🔍 Verificando dados dos distribuidores...\n');

  // 1. Listar todos os distribuidores
  const { data: distribuidores, error: errDist } = await supabase
    .from('distribuidores')
    .select('id, nome, email, ativo');

  if (errDist) {
    console.error('❌ Erro ao buscar distribuidores:', errDist);
    return;
  }

  console.log('📦 DISTRIBUIDORES:');
  console.log('==================');
  for (const d of distribuidores || []) {
    console.log(`\n  ID: ${d.id}`);
    console.log(`  Nome: ${d.nome}`);
    console.log(`  Email: ${d.email || 'N/A'}`);
    console.log(`  Ativo: ${d.ativo}`);

    // Contar produtos deste distribuidor
    const { count: totalProdutos } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', d.id);

    const { count: produtosAtivos } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', d.id)
      .eq('active', true);

    console.log(`  Produtos Total: ${totalProdutos || 0}`);
    console.log(`  Produtos Ativos: ${produtosAtivos || 0}`);
  }

  // 2. Contar bancas cotistas
  const { count: bancasCotistas } = await supabase
    .from('bancas')
    .select('*', { count: 'exact', head: true })
    .eq('active', true)
    .or('is_cotista.eq.true,cotista_id.not.is.null');

  const { count: todasBancas } = await supabase
    .from('bancas')
    .select('*', { count: 'exact', head: true })
    .eq('active', true);

  console.log('\n\n🏪 BANCAS:');
  console.log('==========');
  console.log(`  Total Ativas: ${todasBancas || 0}`);
  console.log(`  Cotistas: ${bancasCotistas || 0}`);

  console.log('\n✅ Verificação concluída!');
}

checkData().catch(console.error);
