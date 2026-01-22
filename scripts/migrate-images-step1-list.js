require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔍 PASSO 1: Listando todas as imagens no Supabase Storage...\n');

const supabase = createClient(supabaseUrl, supabaseKey);

async function listAllFiles() {
  try {
    // Listar todos os buckets
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('❌ Erro ao listar buckets:', bucketsError);
      return;
    }

    console.log(`📦 Buckets encontrados: ${buckets.length}\n`);

    const allFiles = [];
    let totalSize = 0;

    for (const bucket of buckets) {
      console.log(`\n📁 Bucket: ${bucket.name}`);
      console.log(`   ID: ${bucket.id}`);
      console.log(`   Público: ${bucket.public ? 'Sim' : 'Não'}`);
      
      // Listar arquivos do bucket recursivamente
      const files = await listBucketFiles(bucket.name);
      
      console.log(`   Arquivos: ${files.length}`);
      
      let bucketSize = 0;
      files.forEach(file => {
        bucketSize += file.metadata?.size || 0;
        allFiles.push({
          bucket: bucket.name,
          path: file.name,
          size: file.metadata?.size || 0,
          url: supabase.storage.from(bucket.name).getPublicUrl(file.name).data.publicUrl
        });
      });
      
      console.log(`   Tamanho: ${formatBytes(bucketSize)}`);
      totalSize += bucketSize;
    }

    console.log(`\n📊 RESUMO:`);
    console.log(`   Total de arquivos: ${allFiles.length}`);
    console.log(`   Tamanho total: ${formatBytes(totalSize)}`);
    console.log(`   Tamanho em GB: ${(totalSize / 1024 / 1024 / 1024).toFixed(2)} GB`);

    // Salvar lista em JSON
    const outputPath = path.join(__dirname, 'supabase-files-list.json');
    fs.writeFileSync(outputPath, JSON.stringify(allFiles, null, 2));
    console.log(`\n✅ Lista salva em: ${outputPath}`);

    // Salvar resumo por tipo de arquivo
    const byExtension = {};
    allFiles.forEach(file => {
      const ext = path.extname(file.path).toLowerCase() || 'sem-extensao';
      if (!byExtension[ext]) {
        byExtension[ext] = { count: 0, size: 0 };
      }
      byExtension[ext].count++;
      byExtension[ext].size += file.size;
    });

    console.log(`\n📋 Por tipo de arquivo:`);
    Object.entries(byExtension)
      .sort((a, b) => b[1].size - a[1].size)
      .forEach(([ext, stats]) => {
        console.log(`   ${ext}: ${stats.count} arquivos (${formatBytes(stats.size)})`);
      });

  } catch (error) {
    console.error('💥 Erro:', error);
  }
}

async function listBucketFiles(bucketName, folder = '') {
  const allFiles = [];
  
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .list(folder, {
        limit: 1000,
        sortBy: { column: 'name', order: 'asc' }
      });

    if (error) {
      console.error(`   ❌ Erro ao listar pasta ${folder}:`, error.message);
      return allFiles;
    }

    for (const item of data) {
      const itemPath = folder ? `${folder}/${item.name}` : item.name;
      
      if (item.id === null) {
        // É uma pasta, listar recursivamente
        const subFiles = await listBucketFiles(bucketName, itemPath);
        allFiles.push(...subFiles);
      } else {
        // É um arquivo
        allFiles.push({
          name: itemPath,
          metadata: item.metadata
        });
      }
    }
  } catch (error) {
    console.error(`   ❌ Erro ao processar ${folder}:`, error.message);
  }

  return allFiles;
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

listAllFiles();
