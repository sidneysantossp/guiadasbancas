const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function verificarFiltro() {
  console.log('🔍 INVESTIGANDO O FILTRO DA INTERFACE MERCOS\n');
  
  const { data: brancaleone } = await supabase
    .from('distribuidores')
    .select('*')
    .ilike('nome', '%brancaleone%')
    .single();

  const apiUrl = brancaleone.base_url || 'https://app.mercos.com/api/v1';
  const headers = {
    'ApplicationToken': brancaleone.application_token,
    'CompanyToken': brancaleone.company_token,
    'Content-Type': 'application/json'
  };

  try {
    // Buscar 10000 produtos para análise
    console.log('🔍 Coletando produtos para análise...\n');
    
    let produtos = [];
    let afterId = null;
    
    for (let i = 0; i < 50; i++) {
      const url = afterId 
        ? `${apiUrl}/produtos?limit=200&after_id=${afterId}`
        : `${apiUrl}/produtos?limit=200`;

      const response = await fetch(url, { headers });
      if (!response.ok) break;

      const batch = await response.json();
      if (!batch || batch.length === 0) break;

      produtos.push(...batch);
      
      if ((i + 1) % 10 === 0) {
        console.log(`   Coletado: ${produtos.length} produtos...`);
      }
      
      if (batch.length < 200) break;
      afterId = batch[batch.length - 1].id;
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    console.log(`\n📊 Total coletado: ${produtos.length} produtos\n`);
    console.log('='.repeat(80));
    
    // Mostrar todos os campos do primeiro produto para ver o que há disponível
    console.log('\n📋 TODOS OS CAMPOS DISPONÍVEIS:\n');
    
    const primeiroNaoExcluido = produtos.find(p => !p.excluido);
    if (primeiroNaoExcluido) {
      const campos = Object.keys(primeiroNaoExcluido).sort();
      campos.forEach(campo => {
        const valor = primeiroNaoExcluido[campo];
        const preview = String(valor).substring(0, 50);
        console.log(`   ${campo.padEnd(30)}: ${preview}`);
      });
    }
    
    console.log('\n' + '='.repeat(80));
    
    // Analisar campo ultima_alteracao
    console.log('\n📅 ANÁLISE DE DATAS (ultima_alteracao):\n');
    
    const produtosComData = produtos
      .filter(p => !p.excluido && p.ultima_alteracao)
      .map(p => ({
        ...p,
        data: new Date(p.ultima_alteracao)
      }))
      .sort((a, b) => b.data - a.data);
    
    if (produtosComData.length > 0) {
      const maisRecente = produtosComData[0];
      const maisAntigo = produtosComData[produtosComData.length - 1];
      
      console.log(`   Mais recente: ${maisRecente.ultima_alteracao}`);
      console.log(`   Mais antigo:  ${maisAntigo.ultima_alteracao}\n`);
      
      // Testar filtros por data
      const hoje = new Date();
      const umAnoAtras = new Date(hoje.getFullYear() - 1, hoje.getMonth(), hoje.getDate());
      const doisAnosAtras = new Date(hoje.getFullYear() - 2, hoje.getMonth(), hoje.getDate());
      const tresAnosAtras = new Date(hoje.getFullYear() - 3, hoje.getMonth(), hoje.getDate());
      
      const naoExcluidos = produtos.filter(p => !p.excluido);
      const ultimos1Ano = naoExcluidos.filter(p => p.ultima_alteracao && new Date(p.ultima_alteracao) > umAnoAtras);
      const ultimos2Anos = naoExcluidos.filter(p => p.ultima_alteracao && new Date(p.ultima_alteracao) > doisAnosAtras);
      const ultimos3Anos = naoExcluidos.filter(p => p.ultima_alteracao && new Date(p.ultima_alteracao) > tresAnosAtras);
      
      console.log('📊 PRODUTOS POR PERÍODO DE ATUALIZAÇÃO:\n');
      console.log(`   Não excluídos total:     ${naoExcluidos.length}`);
      console.log(`   Últimos 1 ano:           ${ultimos1Ano.length}`);
      console.log(`   Últimos 2 anos:          ${ultimos2Anos.length}`);
      console.log(`   Últimos 3 anos:          ${ultimos3Anos.length}\n`);
      
      // Projeções
      const projecao1Ano = Math.round((ultimos1Ano.length / naoExcluidos.length) * 95400);
      const projecao2Anos = Math.round((ultimos2Anos.length / naoExcluidos.length) * 95400);
      const projecao3Anos = Math.round((ultimos3Anos.length / naoExcluidos.length) * 95400);
      
      console.log('📊 PROJEÇÃO PARA 95.400 PRODUTOS:\n');
      console.log(`   Últimos 1 ano:  ~${projecao1Ano.toLocaleString('pt-BR')} produtos`);
      console.log(`   Últimos 2 anos: ~${projecao2Anos.toLocaleString('pt-BR')} produtos`);
      console.log(`   Últimos 3 anos: ~${projecao3Anos.toLocaleString('pt-BR')} produtos\n`);
      
      if (projecao1Ano > 3300 && projecao1Ano < 3600) {
        console.log(`🎉 MATCH! Produtos atualizados no último ano: ~${projecao1Ano}\n`);
      } else if (projecao2Anos > 3300 && projecao2Anos < 3600) {
        console.log(`🎉 MATCH! Produtos atualizados nos últimos 2 anos: ~${projecao2Anos}\n`);
      } else if (projecao3Anos > 3300 && projecao3Anos < 3600) {
        console.log(`🎉 MATCH! Produtos atualizados nos últimos 3 anos: ~${projecao3Anos}\n`);
      }
    }
    
    console.log('='.repeat(80));
    
    // Verificar se há outro campo numérico que possa ser ~3439
    console.log('\n🔍 BUSCANDO PADRÃO DE ~3.439:\n');
    
    // Tentar diferentes combinações
    const combos = [
      {
        nome: 'Código não vazio',
        filter: p => !p.excluido && p.codigo && p.codigo.trim() !== '',
        count: produtos.filter(p => !p.excluido && p.codigo && p.codigo.trim() !== '').length
      },
      {
        nome: 'Código com letras',
        filter: p => !p.excluido && p.codigo && /[A-Z]/.test(p.codigo),
        count: produtos.filter(p => !p.excluido && p.codigo && /[A-Z]/.test(p.codigo)).length
      },
      {
        nome: 'Nome não vazio',
        filter: p => !p.excluido && p.nome && p.nome.trim() !== '',
        count: produtos.filter(p => !p.excluido && p.nome && p.nome.trim() !== '').length
      },
      {
        nome: 'Preço > 0',
        filter: p => !p.excluido && p.preco_tabela && p.preco_tabela > 0,
        count: produtos.filter(p => !p.excluido && p.preco_tabela && p.preco_tabela > 0).length
      },
    ];
    
    combos.forEach(combo => {
      const projecao = Math.round((combo.count / produtos.length) * 100000);
      const projecaoNaoExc = Math.round((combo.count / produtos.filter(p => !p.excluido).length) * 95400);
      const diff = Math.abs(projecaoNaoExc - 3439);
      const match = diff < 500 ? ' ✅ POSSÍVEL MATCH!' : '';
      
      console.log(`   ${combo.nome.padEnd(30)}: ${combo.count} / ${produtos.filter(p => !p.excluido).length} → ~${projecaoNaoExc}${match}`);
    });

  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

verificarFiltro().then(() => process.exit(0)).catch(err => {
  console.error('💥 Erro:', err);
  process.exit(1);
});
