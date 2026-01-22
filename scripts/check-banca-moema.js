require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔍 VERIFICANDO BANCA MOEMA\n');

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkBancaMoema() {
  try {
    // Buscar BANCA MOEMA
    const { data: banca, error } = await supabase
      .from('bancas')
      .select('*')
      .ilike('name', '%MOEMA%')
      .single();
    
    if (error) {
      console.error('❌ Erro ao buscar BANCA MOEMA:', error);
      return;
    }

    if (!banca) {
      console.log('❌ BANCA MOEMA não encontrada');
      return;
    }

    console.log('✅ BANCA MOEMA encontrada:\n');
    console.log('ID:', banca.id);
    console.log('Nome:', banca.name);
    console.log('Ativa:', banca.active);
    console.log('Featured:', banca.featured);
    console.log('\n📸 IMAGENS:');
    console.log('Cover Image:', banca.cover_image || '❌ Não definida');
    console.log('Profile Image:', banca.profile_image || '❌ Não definida');

    // Testar se as URLs das imagens são válidas
    if (banca.cover_image) {
      console.log('\n🔗 Testando URL da Cover Image...');
      console.log('URL:', banca.cover_image);
      
      // Verificar se é URL do Supabase Storage
      if (banca.cover_image.includes('supabase.co/storage')) {
        console.log('✅ URL do Supabase Storage');
        
        // Extrair caminho do arquivo
        const match = banca.cover_image.match(/\/storage\/v1\/object\/public\/([^\/]+)\/(.+)/);
        if (match) {
          const bucket = match[1];
          const path = match[2];
          console.log('Bucket:', bucket);
          console.log('Path:', path);
          
          // Verificar se arquivo existe
          const { data: fileData, error: fileError } = await supabase.storage
            .from(bucket)
            .list(path.split('/').slice(0, -1).join('/'), {
              search: path.split('/').pop()
            });
          
          if (fileError) {
            console.log('❌ Erro ao verificar arquivo:', fileError.message);
          } else if (fileData && fileData.length > 0) {
            console.log('✅ Arquivo existe no Storage');
            console.log('Tamanho:', fileData[0].metadata?.size || 'desconhecido');
          } else {
            console.log('❌ Arquivo NÃO existe no Storage');
          }
        }
      } else {
        console.log('⚠️  URL externa (não é do Supabase Storage)');
      }
    }

    if (banca.profile_image) {
      console.log('\n🔗 Testando URL da Profile Image...');
      console.log('URL:', banca.profile_image);
      
      if (banca.profile_image.includes('supabase.co/storage')) {
        console.log('✅ URL do Supabase Storage');
        
        const match = banca.profile_image.match(/\/storage\/v1\/object\/public\/([^\/]+)\/(.+)/);
        if (match) {
          const bucket = match[1];
          const path = match[2];
          console.log('Bucket:', bucket);
          console.log('Path:', path);
          
          const { data: fileData, error: fileError } = await supabase.storage
            .from(bucket)
            .list(path.split('/').slice(0, -1).join('/'), {
              search: path.split('/').pop()
            });
          
          if (fileError) {
            console.log('❌ Erro ao verificar arquivo:', fileError.message);
          } else if (fileData && fileData.length > 0) {
            console.log('✅ Arquivo existe no Storage');
            console.log('Tamanho:', fileData[0].metadata?.size || 'desconhecido');
          } else {
            console.log('❌ Arquivo NÃO existe no Storage');
          }
        }
      } else {
        console.log('⚠️  URL externa (não é do Supabase Storage)');
      }
    }

    // Verificar outras bancas para comparação
    console.log('\n\n📊 COMPARAÇÃO COM OUTRAS BANCAS:');
    const { data: outrasBancas } = await supabase
      .from('bancas')
      .select('name, cover_image, profile_image')
      .eq('active', true)
      .limit(5);
    
    if (outrasBancas) {
      outrasBancas.forEach(b => {
        console.log(`\n${b.name}:`);
        console.log('  Cover:', b.cover_image ? '✅' : '❌');
        console.log('  Profile:', b.profile_image ? '✅' : '❌');
      });
    }

  } catch (error) {
    console.error('💥 Erro:', error);
  }
}

checkBancaMoema();
