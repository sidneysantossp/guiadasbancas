#!/usr/bin/env node

/**
 * Gera SQL a partir do JSON extraído
 * 
 * USO:
 * node scripts/generate-sql-from-json.js brancaleone-products-1760721795284.json
 */

const fs = require('fs');
const path = require('path');

const jsonFile = process.argv[2];

if (!jsonFile) {
  console.error('❌ Erro: Especifique o arquivo JSON');
  console.log('Uso: node scripts/generate-sql-from-json.js arquivo.json');
  process.exit(1);
}

console.log('🚀 Gerando SQL a partir do JSON...\n');

const jsonPath = path.resolve(jsonFile);
const products = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

console.log(`✅ ${products.length} produtos carregados\n`);

let sql = `-- SQL para importar produtos Brancaleone
-- Gerado em: ${new Date().toISOString()}
-- Total de produtos: ${products.length}
-- Fonte: ${path.basename(jsonFile)}

-- 1. Criar distribuidor (se não existir)
INSERT INTO distribuidores (name, active, created_at)
VALUES ('Brancaleone Publicações', true, NOW())
ON CONFLICT (name) DO NOTHING;

-- 2. Inserir produtos
`;

products.forEach((p, index) => {
  const title = (p.title || '').replace(/'/g, "''");
  const description = (p.description || '').replace(/'/g, "''");
  const code = p.code || `BRANC-${String(index + 1).padStart(5, '0')}`;
  const image = p.image || '';
  
  sql += `
INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  '${code}',
  '${title}',
  '${description}',
  0.00,
  '["${image}"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();
`;
});

const sqlPath = path.join(path.dirname(jsonPath), `import-${Date.now()}.sql`);
fs.writeFileSync(sqlPath, sql);

console.log(`💾 SQL gerado: ${path.basename(sqlPath)}`);
console.log(`\n✅ Pronto para importar no Supabase!`);
console.log(`\nPróximos passos:`);
console.log(`1. Abra o Supabase SQL Editor`);
console.log(`2. Cole o conteúdo do arquivo ${path.basename(sqlPath)}`);
console.log(`3. Execute o SQL`);
console.log(`4. Verifique os ${products.length} produtos importados\n`);
