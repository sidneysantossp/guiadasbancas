#!/usr/bin/env node

/**
 * Script para comparar produtos na API Mercos vs Supabase
 * Distribuidores: Bambino e Brancaleone
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente do Supabase não configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fetchMercosProducts(applicationToken, companyToken, baseUrl, distribuidorNome) {
  let allProducts = [];
  let page = 1;
  let hasMore = true;
  const apiUrl = baseUrl || 'https://app.mercos.com/api/v1';
  
  console.log(`\n🔄 Buscando produtos na API Mercos para ${distribuidorNome}...`);
  console.log(`   URL Base: ${apiUrl}`);
  
  while (hasMore) {
    try {
      const url = `${apiUrl}/produtos?pagina=${page}&situacao=A`;
      
      const response = await fetch(url, {
        headers: {
          'ApplicationToken': applicationToken,
          'CompanyToken': companyToken,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          console.log(`   ⚠️  Token inválido ou expirado para ${distribuidorNome}`);
          return { error: 'Token inválido', count: 0 };
        }
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      
      if (Array.isArray(data) && data.length > 0) {
        allProducts = allProducts.concat(data);
        console.log(`   📦 Página ${page}: ${data.length} produtos (total parcial: ${allProducts.length})`);
        page++;
        
        // Verificar header de limitação
        const limitou = response.headers.get('meus-pedidos-limitou') || 
                       response.headers.get('MEUSPEDIDOS_LIMITOU_REGISTROS');
        if (!limitou && data.length < 100) {
          hasMore = false;
        }
      } else {
        hasMore = false;
      }
      
      // Rate limiting - esperar 500ms entre requests
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.log(`   ❌ Erro na página ${page}: ${error.message}`);
      hasMore = false;
    }
  }
  
  return { count: allProducts.length, products: allProducts };
}

async function main() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('   COMPARAÇÃO DE PRODUTOS: MERCOS vs SUPABASE');
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  // 1. Buscar distribuidores no Supabase
  console.log('📋 Buscando distribuidores no Supabase...\n');
  
  const { data: distribuidores, error: distError } = await supabase
    .from('distribuidores')
    .select('id, nome, application_token, company_token, base_url')
    .or('nome.ilike.%bambino%,nome.ilike.%brancaleone%');
  
  if (distError) {
    console.error('❌ Erro ao buscar distribuidores:', distError.message);
    process.exit(1);
  }
  
  if (!distribuidores || distribuidores.length === 0) {
    console.log('⚠️  Nenhum distribuidor encontrado. Buscando todos...');
    
    const { data: allDist, error: allError } = await supabase
      .from('distribuidores')
      .select('id, nome, application_token, company_token, base_url');
    
    if (allError) {
      console.error('❌ Erro:', allError.message);
      process.exit(1);
    }
    
    console.log('\n📋 Distribuidores disponíveis:');
    allDist?.forEach(d => console.log(`   - ${d.nome} (${d.id})`));
    process.exit(0);
  }
  
  console.log(`✅ Encontrados ${distribuidores.length} distribuidor(es)\n`);
  
  // 2. Para cada distribuidor, comparar
  const results = [];
  
  for (const dist of distribuidores) {
    console.log('───────────────────────────────────────────────────────────────');
    console.log(`📦 DISTRIBUIDOR: ${dist.nome}`);
    console.log(`   ID: ${dist.id}`);
    console.log('───────────────────────────────────────────────────────────────');
    
    // Contar produtos no Supabase (total)
    const { count: totalSupabase, error: countError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', dist.id);
    
    // Contar produtos ATIVOS no Supabase
    const { count: ativosSupabase } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', dist.id)
      .eq('active', true);
    
    console.log(`\n📊 SUPABASE (Plataforma):`);
    console.log(`   Total de produtos: ${totalSupabase || 0}`);
    console.log(`   Produtos ativos: ${ativosSupabase || 0}`);
    console.log(`   Produtos inativos: ${(totalSupabase || 0) - (ativosSupabase || 0)}`);
    
    // Buscar na API Mercos
    if (dist.application_token && dist.company_token) {
      const mercosResult = await fetchMercosProducts(
        dist.application_token,
        dist.company_token,
        dist.base_url,
        dist.nome
      );
      
      console.log(`\n📊 MERCOS (API):`);
      if (mercosResult.error) {
        console.log(`   ⚠️  ${mercosResult.error}`);
      } else {
        console.log(`   Produtos ativos na API: ${mercosResult.count}`);
      }
      
      // Comparação
      console.log(`\n📈 COMPARAÇÃO:`);
      const diff = (mercosResult.count || 0) - (ativosSupabase || 0);
      if (diff === 0) {
        console.log(`   ✅ Sincronizado! Mesma quantidade de produtos ativos.`);
      } else if (diff > 0) {
        console.log(`   ⚠️  Faltam ${diff} produtos na plataforma`);
        console.log(`   💡 Execute sincronização para importar produtos faltantes`);
      } else {
        console.log(`   ℹ️  Plataforma tem ${Math.abs(diff)} produtos a mais que a API Mercos`);
        console.log(`   💡 Alguns produtos podem ter sido desativados na Mercos`);
      }
      
      results.push({
        nome: dist.nome,
        supabase_total: totalSupabase || 0,
        supabase_ativos: ativosSupabase || 0,
        mercos: mercosResult.count || 0,
        diferenca: diff
      });
      
    } else {
      console.log(`\n⚠️  Tokens da Mercos não configurados para ${dist.nome}`);
      results.push({
        nome: dist.nome,
        supabase_total: totalSupabase || 0,
        supabase_ativos: ativosSupabase || 0,
        mercos: 'N/A',
        diferenca: 'N/A'
      });
    }
    
    console.log('');
  }
  
  // Resumo final
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('   RESUMO FINAL');
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  console.log('┌─────────────────────┬──────────────┬──────────────┬──────────┬───────────┐');
  console.log('│ Distribuidor        │ Supabase Tot │ Supabase Atv │ Mercos   │ Diferença │');
  console.log('├─────────────────────┼──────────────┼──────────────┼──────────┼───────────┤');
  
  for (const r of results) {
    const nome = r.nome.substring(0, 19).padEnd(19);
    const supTotal = String(r.supabase_total).padStart(12);
    const supAtivo = String(r.supabase_ativos).padStart(12);
    const mercos = String(r.mercos).padStart(8);
    const diff = String(r.diferenca).padStart(9);
    console.log(`│ ${nome} │${supTotal} │${supAtivo} │${mercos} │${diff} │`);
  }
  
  console.log('└─────────────────────┴──────────────┴──────────────┴──────────┴───────────┘\n');
}

main().catch(console.error);
