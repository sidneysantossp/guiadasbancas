const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function importarImagensMercos() {
  console.log('\n📸 IMPORTAÇÃO EM MASSA DE IMAGENS - BRANCALEONE\n');
  console.log('='.repeat(80) + '\n');
  
  try {
    // Buscar distribuidor
    const { data: dist } = await supabase
      .from('distribuidores')
      .select('*')
      .ilike('nome', '%brancaleone%')
      .single();
    
    if (!dist) {
      console.log('❌ Distribuidor não encontrado\n');
      return;
    }
    
    console.log(`🏢 Distribuidor: ${dist.nome}\n`);
    console.log('='.repeat(80) + '\n');
    
    const apiUrl = dist.base_url || 'https://app.mercos.com/api/v1';
    const headers = {
      'ApplicationToken': dist.application_token,
      'CompanyToken': dist.company_token,
      'Content-Type': 'application/json'
    };
    
    // Buscar produtos do banco que estão ativos
    const { data: produtos } = await supabase
      .from('products')
      .select('id, mercos_id, name, images')
      .eq('distribuidor_id', dist.id)
      .eq('active', true);
    
    console.log(`📦 Produtos ativos no banco: ${produtos.length}\n`);
    console.log('🔍 Buscando imagens na API Mercos...\n');
    
    let imagensImportadas = 0;
    let produtosSemImagem = 0;
    let produtosComImagemJa = 0;
    let erros = 0;
    
    for (let i = 0; i < produtos.length; i++) {
      const produto = produtos[i];
      
      // Verificar se já tem imagens
      if (produto.images && produto.images.length > 0) {
        produtosComImagemJa++;
        if (i % 100 === 0 && i > 0) {
          console.log(`   Processados ${i}/${produtos.length} produtos...`);
        }
        continue;
      }
      
      try {
        // Buscar imagens do produto na Mercos
        const response = await fetch(
          `${apiUrl}/imagens_produto?produto_id=${produto.mercos_id}`,
          { headers }
        );
        
        if (!response.ok) {
          erros++;
          continue;
        }
        
        const imagens = await response.json();
        
        if (!imagens || imagens.length === 0) {
          produtosSemImagem++;
          if (i % 100 === 0 && i > 0) {
            console.log(`   Processados ${i}/${produtos.length} produtos...`);
          }
          continue;
        }
        
        // Ordenar por ordem e pegar as URLs
        const imagensOrdenadas = imagens
          .sort((a, b) => (a.ordem || 0) - (b.ordem || 0))
          .map(img => img.imagem_url)
          .filter(url => url && url.trim() !== '');
        
        if (imagensOrdenadas.length > 0) {
          // Atualizar produto com as imagens
          const { error } = await supabase
            .from('products')
            .update({ 
              images: imagensOrdenadas,
              updated_at: new Date().toISOString()
            })
            .eq('id', produto.id);
          
          if (!error) {
            imagensImportadas++;
            if (imagensImportadas % 10 === 0) {
              console.log(`   ✅ ${imagensImportadas} produtos com imagens importadas...`);
            }
          } else {
            erros++;
          }
        } else {
          produtosSemImagem++;
        }
        
      } catch (error) {
        erros++;
      }
      
      if (i % 100 === 0 && i > 0) {
        console.log(`   Processados ${i}/${produtos.length} produtos...`);
      }
      
      // Rate limiting
      if (i % 50 === 0 && i > 0) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    console.log('\n' + '='.repeat(80) + '\n');
    console.log('✨ IMPORTAÇÃO CONCLUÍDA!\n');
    console.log('📊 RESULTADO:\n');
    console.log(`   ✅ Imagens importadas: ${imagensImportadas} produtos`);
    console.log(`   ✔️  Já tinham imagens: ${produtosComImagemJa} produtos`);
    console.log(`   ⚠️  Sem imagem na Mercos: ${produtosSemImagem} produtos`);
    console.log(`   ❌ Erros: ${erros}\n`);
    console.log('='.repeat(80));
    
  } catch (error) {
    console.error('💥 Erro:', error.message);
  }
}

importarImagensMercos().then(() => process.exit(0)).catch(err => {
  console.error('💥 Erro fatal:', err);
  process.exit(1);
});
