const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://rgqlncxrzwgjreggrjcq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJncWxuY3hyendnanJlZ2dyamNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTIyMzI5MywiZXhwIjoyMDc0Nzk5MjkzfQ.bdkHUKuaDQ22lZqMmFMT_3P3L0VAK11mGlJ6YkU3d6s',
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function main() {
  const { data, error } = await supabase
    .from('bancas')
    .select('id, name, active, featured, rating, address, created_at, user_id')
    .ilike('name', '%agnaldo%');

  if (error) {
    console.error('Erro:', error.message);
    return;
  }

  if (!data || data.length === 0) {
    console.log('❌ Nenhuma banca encontrada com "agnaldo" no nome.');
    return;
  }

  console.log(`✅ ${data.length} banca(s) encontrada(s):\n`);
  data.forEach(b => {
    console.log(`ID:       ${b.id}`);
    console.log(`Nome:     ${b.name}`);
    console.log(`Ativo:    ${b.active}`);
    console.log(`Destaque: ${b.featured}`);
    console.log(`Rating:   ${b.rating}`);
    console.log(`Endereço: ${b.address}`);
    console.log(`Criado:   ${b.created_at}`);
    console.log(`User ID:  ${b.user_id}`);
    console.log('---');
  });
}

main().catch(console.error);
