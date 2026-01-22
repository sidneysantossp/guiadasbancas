require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔍 ANÁLISE DETALHADA DO SUPABASE STORAGE\n');

const supabase = createClient(supabaseUrl, supabaseKey);

async function analyzeStorage() {
  try {
    // 1. Listar todos os buckets
    console.log('📦 PASSO 1: Listando buckets...\n');
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('❌ Erro ao listar buckets:', bucketsError);
      return;
    }

    console.log(`Total de buckets: ${buckets.length}\n`);

    let totalFiles = 0;
    let totalSize = 0;
    const bucketDetails = [];

    // 2. Analisar cada bucket
    for (const bucket of buckets) {
      console.log(`\n📁 Analisando bucket: ${bucket.name}`);
      console.log(`   ID: ${bucket.id}`);
      console.log(`   Público: ${bucket.public ? 'Sim' : 'Não'}`);
      console.log(`   Criado em: ${bucket.created_at}`);
      
      // Listar arquivos recursivamente
      const files = await listAllFilesInBucket(bucket.name);
      
      let bucketSize = 0;
      const filesByFolder = {};
      const largeFiles = [];

      files.forEach(file => {
        const size = file.metadata?.size || 0;
        bucketSize += size;
        
        // Agrupar por pasta
        const folder = file.name.split('/')[0] || 'root';
        if (!filesByFolder[folder]) {
          filesByFolder[folder] = { count: 0, size: 0 };
        }
        filesByFolder[folder].count++;
        filesByFolder[folder].size += size;

        // Identificar arquivos grandes (> 10MB)
        if (size > 10 * 1024 * 1024) {
          largeFiles.push({
            name: file.name,
            size: size,
            sizeFormatted: formatBytes(size)
          });
        }
      });

      console.log(`   Total de arquivos: ${files.length}`);
      console.log(`   Tamanho total: ${formatBytes(bucketSize)}`);

      // Mostrar distribuição por pasta
      console.log(`\n   📂 Distribuição por pasta:`);
      Object.entries(filesByFolder)
        .sort((a, b) => b[1].size - a[1].size)
        .forEach(([folder, stats]) => {
          console.log(`      ${folder}: ${stats.count} arquivos (${formatBytes(stats.size)})`);
        });

      // Mostrar arquivos grandes
      if (largeFiles.length > 0) {
        console.log(`\n   ⚠️  Arquivos grandes (> 10MB):`);
        largeFiles
          .sort((a, b) => b.size - a.size)
          .slice(0, 10)
          .forEach(file => {
            console.log(`      ${file.sizeFormatted} - ${file.name}`);
          });
      }

      totalFiles += files.length;
      totalSize += bucketSize;

      bucketDetails.push({
        name: bucket.name,
        files: files.length,
        size: bucketSize,
        folders: filesByFolder,
        largeFiles: largeFiles.length
      });
    }

    // 3. Resumo geral
    console.log(`\n\n📊 RESUMO GERAL:`);
    console.log(`   Total de buckets: ${buckets.length}`);
    console.log(`   Total de arquivos: ${totalFiles}`);
    console.log(`   Tamanho total (arquivos): ${formatBytes(totalSize)}`);
    console.log(`   Tamanho em GB: ${(totalSize / 1024 / 1024 / 1024).toFixed(2)} GB`);

    // 4. Análise da discrepância
    const reportedSize = 11.103; // GB do painel
    const actualSizeGB = totalSize / 1024 / 1024 / 1024;
    const difference = reportedSize - actualSizeGB;

    console.log(`\n\n🔍 ANÁLISE DA DISCREPÂNCIA:`);
    console.log(`   Tamanho reportado no painel: ${reportedSize.toFixed(2)} GB`);
    console.log(`   Tamanho real dos arquivos: ${actualSizeGB.toFixed(2)} GB`);
    console.log(`   Diferença: ${difference.toFixed(2)} GB`);
    console.log(`   Percentual da diferença: ${((difference / reportedSize) * 100).toFixed(1)}%`);

    if (difference > 1) {
      console.log(`\n   ⚠️  POSSÍVEIS CAUSAS DA DIFERENÇA:`);
      console.log(`   1. Backups automáticos do Supabase`);
      console.log(`   2. Versões antigas de arquivos (versionamento)`);
      console.log(`   3. Arquivos deletados mas não liberados (garbage collection)`);
      console.log(`   4. Dados do banco de dados contando no Storage`);
      console.log(`   5. Logs e dados temporários do sistema`);
    }

    // 5. Recomendações
    console.log(`\n\n💡 RECOMENDAÇÕES:`);
    
    if (actualSizeGB < 0.5) {
      console.log(`   ✅ Você tem apenas ${actualSizeGB.toFixed(2)} GB de arquivos reais`);
      console.log(`   ✅ Isso cabe tranquilamente no plano FREE (1GB)`);
      console.log(`   ⚡ AÇÃO: Limpar backups/versões antigas no painel do Supabase`);
      console.log(`   💰 Você pode cancelar o upgrade e economizar $25/mês`);
    } else if (actualSizeGB < 1) {
      console.log(`   ⚠️  Você está próximo do limite FREE (1GB)`);
      console.log(`   💡 OPÇÃO 1: Limpar arquivos desnecessários`);
      console.log(`   💡 OPÇÃO 2: Migrar para VPS (grátis)`);
    } else {
      console.log(`   ❌ Você ultrapassou o limite FREE (${actualSizeGB.toFixed(2)} GB)`);
      console.log(`   💡 OPÇÃO 1: Manter Pro Plan ($25/mês)`);
      console.log(`   💡 OPÇÃO 2: Migrar para VPS (grátis)`);
    }

    console.log(`\n\n📋 PRÓXIMOS PASSOS:`);
    console.log(`   1. Acessar: https://supabase.com/dashboard/project/${supabaseUrl.split('.')[0].split('//')[1]}/settings/storage`);
    console.log(`   2. Verificar configurações de backup e versionamento`);
    console.log(`   3. Desabilitar backups automáticos se não precisar`);
    console.log(`   4. Executar garbage collection manual`);
    console.log(`   5. Aguardar algumas horas e verificar se o uso diminui`);

  } catch (error) {
    console.error('💥 Erro:', error);
  }
}

async function listAllFilesInBucket(bucketName, folder = '', allFiles = []) {
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
        await listAllFilesInBucket(bucketName, itemPath, allFiles);
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

analyzeStorage();
