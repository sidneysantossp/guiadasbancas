#!/usr/bin/env node

/**
 * Divide o SQL em lotes menores para importar no Supabase
 * 
 * USO:
 * node scripts/split-sql-batches.js import-1760723566773.sql 100
 * 
 * Argumentos:
 * - arquivo SQL
 * - tamanho do lote (padrão: 100)
 */

const fs = require('fs');
const path = require('path');

const sqlFile = process.argv[2];
const batchSize = parseInt(process.argv[3]) || 100;

if (!sqlFile) {
  console.error('❌ Erro: Especifique o arquivo SQL');
  console.log('Uso: node scripts/split-sql-batches.js arquivo.sql [tamanho_lote]');
  process.exit(1);
}

console.log('🚀 Dividindo SQL em lotes...\n');

const sqlPath = path.resolve(sqlFile);
const sqlContent = fs.readFileSync(sqlPath, 'utf8');

// Extrair header e distribuidor
const lines = sqlContent.split('\n');
const headerLines = [];
const distributorLines = [];
const productInserts = [];

let inHeader = true;
let inDistributor = false;
let currentInsert = [];

for (const line of lines) {
  if (inHeader) {
    if (line.includes('-- 1. Criar distribuidor')) {
      inHeader = false;
      inDistributor = true;
      headerLines.push(line);
    } else {
      headerLines.push(line);
    }
  } else if (inDistributor) {
    distributorLines.push(line);
    if (line.includes('-- 2. Inserir produtos')) {
      inDistributor = false;
    }
  } else {
    if (line.trim().startsWith('INSERT INTO products')) {
      if (currentInsert.length > 0) {
        productInserts.push(currentInsert.join('\n'));
      }
      currentInsert = [line];
    } else {
      currentInsert.push(line);
      if (line.includes('updated_at = NOW();')) {
        productInserts.push(currentInsert.join('\n'));
        currentInsert = [];
      }
    }
  }
}

console.log(`✅ ${productInserts.length} produtos encontrados`);
console.log(`📦 Dividindo em lotes de ${batchSize} produtos...\n`);

// Criar diretório para os lotes
const batchDir = path.join(path.dirname(sqlPath), 'sql-batches');
if (!fs.existsSync(batchDir)) {
  fs.mkdirSync(batchDir);
}

// Dividir em lotes
const batches = [];
for (let i = 0; i < productInserts.length; i += batchSize) {
  batches.push(productInserts.slice(i, i + batchSize));
}

console.log(`📊 Total de lotes: ${batches.length}\n`);

// Criar arquivos
batches.forEach((batch, index) => {
  const batchNumber = index + 1;
  const fileName = `batch-${String(batchNumber).padStart(3, '0')}-of-${batches.length}.sql`;
  const filePath = path.join(batchDir, fileName);
  
  let content = headerLines.join('\n') + '\n\n';
  
  // Adicionar distribuidor apenas no primeiro lote
  if (index === 0) {
    content += distributorLines.join('\n') + '\n\n';
  } else {
    content += '-- Distribuidor já criado no batch-001\n\n';
  }
  
  content += `-- Lote ${batchNumber} de ${batches.length}\n`;
  content += `-- Produtos: ${index * batchSize + 1} até ${Math.min((index + 1) * batchSize, productInserts.length)}\n\n`;
  content += batch.join('\n\n');
  
  fs.writeFileSync(filePath, content);
  console.log(`💾 ${fileName} - ${batch.length} produtos`);
});

console.log(`\n✅ Lotes criados em: ${batchDir}`);
console.log(`\n📋 Como importar:`);
console.log(`1. Acesse Supabase SQL Editor`);
console.log(`2. Execute os arquivos na ordem (batch-001, batch-002, etc.)`);
console.log(`3. Aguarde cada lote terminar antes de executar o próximo\n`);

// Criar script de importação automática
const importScript = `#!/bin/bash
# Script para importar todos os lotes automaticamente
# Requer Supabase CLI instalado

echo "🚀 Importando ${batches.length} lotes..."

for file in sql-batches/batch-*.sql; do
  echo "📦 Importando \$file..."
  supabase db execute --file "\$file"
  if [ $? -eq 0 ]; then
    echo "✅ \$file importado com sucesso"
  else
    echo "❌ Erro ao importar \$file"
    exit 1
  fi
  sleep 2
done

echo "✅ Importação completa!"
`;

const scriptPath = path.join(batchDir, 'import-all.sh');
fs.writeFileSync(scriptPath, importScript);
fs.chmodSync(scriptPath, '755');

console.log(`💡 Script automático criado: ${path.basename(scriptPath)}`);
console.log(`   Execute: cd sql-batches && ./import-all.sh\n`);
