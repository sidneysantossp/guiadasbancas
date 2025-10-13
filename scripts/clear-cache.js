#!/usr/bin/env node

/**
 * Script para limpar cache do Next.js e forçar rebuild
 * Uso: node scripts/clear-cache.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🧹 Iniciando limpeza de cache...\n');

// Função para remover diretório recursivamente
function removeDir(dirPath) {
  if (fs.existsSync(dirPath)) {
    console.log(`🗑️  Removendo: ${dirPath}`);
    fs.rmSync(dirPath, { recursive: true, force: true });
    console.log(`✅ Removido: ${dirPath}`);
  } else {
    console.log(`⚠️  Não encontrado: ${dirPath}`);
  }
}

// Função para limpar arquivos de cache
function clearCacheFiles() {
  const cacheFiles = [
    '.next',
    'node_modules/.cache',
    '.vercel',
    'dist',
    'build'
  ];

  console.log('📁 Limpando diretórios de cache...');
  cacheFiles.forEach(dir => {
    const fullPath = path.join(process.cwd(), dir);
    removeDir(fullPath);
  });
}

// Função para limpar cache do npm/yarn
function clearPackageCache() {
  console.log('\n📦 Limpando cache de pacotes...');
  
  try {
    console.log('🔄 npm cache clean --force');
    execSync('npm cache clean --force', { stdio: 'inherit' });
    console.log('✅ Cache do npm limpo');
  } catch (error) {
    console.log('⚠️  Erro ao limpar cache do npm:', error.message);
  }

  // Tentar yarn também se existir
  try {
    execSync('which yarn', { stdio: 'ignore' });
    console.log('🔄 yarn cache clean');
    execSync('yarn cache clean', { stdio: 'inherit' });
    console.log('✅ Cache do yarn limpo');
  } catch (error) {
    console.log('ℹ️  Yarn não encontrado, pulando...');
  }
}

// Função para reinstalar dependências
function reinstallDependencies() {
  console.log('\n📥 Reinstalando dependências...');
  
  try {
    console.log('🔄 npm install');
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Dependências reinstaladas');
  } catch (error) {
    console.log('❌ Erro ao reinstalar dependências:', error.message);
  }
}

// Função principal
function main() {
  const args = process.argv.slice(2);
  const fullClean = args.includes('--full') || args.includes('-f');
  const skipInstall = args.includes('--no-install') || args.includes('-n');

  console.log('🎯 Modo:', fullClean ? 'LIMPEZA COMPLETA' : 'LIMPEZA BÁSICA');
  console.log('📋 Argumentos disponíveis:');
  console.log('   --full, -f     : Limpeza completa (inclui cache de pacotes)');
  console.log('   --no-install, -n : Não reinstalar dependências');
  console.log('');

  // Sempre limpar arquivos de cache
  clearCacheFiles();

  // Limpeza completa inclui cache de pacotes
  if (fullClean) {
    clearPackageCache();
    
    if (!skipInstall) {
      reinstallDependencies();
    }
  }

  console.log('\n🎉 Limpeza concluída!');
  console.log('💡 Próximos passos:');
  console.log('   1. Execute: npm run dev');
  console.log('   2. Acesse: http://localhost:3000');
  console.log('   3. Faça hard reload no navegador (Cmd+Shift+R)');
}

// Executar se chamado diretamente
if (require.main === module) {
  main();
}

module.exports = { clearCacheFiles, clearPackageCache, reinstallDependencies };
