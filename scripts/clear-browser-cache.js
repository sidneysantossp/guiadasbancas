/**
 * Script para executar no Console do Navegador
 * Limpa cache, localStorage, sessionStorage e força reload
 * 
 * COMO USAR:
 * 1. Abra DevTools (F12)
 * 2. Vá na aba Console
 * 3. Cole este código e pressione Enter
 */

(function clearBrowserCache() {
  console.log('🧹 Iniciando limpeza completa do cache do navegador...\n');

  // 1. Limpar localStorage
  try {
    const localStorageSize = Object.keys(localStorage).length;
    localStorage.clear();
    console.log(`✅ localStorage limpo (${localStorageSize} itens removidos)`);
  } catch (error) {
    console.log('⚠️  Erro ao limpar localStorage:', error.message);
  }

  // 2. Limpar sessionStorage
  try {
    const sessionStorageSize = Object.keys(sessionStorage).length;
    sessionStorage.clear();
    console.log(`✅ sessionStorage limpo (${sessionStorageSize} itens removidos)`);
  } catch (error) {
    console.log('⚠️  Erro ao limpar sessionStorage:', error.message);
  }

  // 3. Limpar cookies do domínio atual
  try {
    const cookies = document.cookie.split(';');
    let cookieCount = 0;
    
    cookies.forEach(cookie => {
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      if (name) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${window.location.hostname}`;
        cookieCount++;
      }
    });
    
    console.log(`✅ Cookies limpos (${cookieCount} cookies removidos)`);
  } catch (error) {
    console.log('⚠️  Erro ao limpar cookies:', error.message);
  }

  // 4. Limpar cache de imagens e recursos (se suportado)
  if ('caches' in window) {
    caches.keys().then(cacheNames => {
      console.log(`🗂️  Encontrados ${cacheNames.length} caches`);
      
      return Promise.all(
        cacheNames.map(cacheName => {
          console.log(`🗑️  Removendo cache: ${cacheName}`);
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      console.log('✅ Cache de recursos limpo');
    }).catch(error => {
      console.log('⚠️  Erro ao limpar cache de recursos:', error.message);
    });
  }

  // 5. Limpar IndexedDB (se existir)
  if ('indexedDB' in window) {
    try {
      // Não podemos listar todos os bancos, mas podemos tentar alguns comuns
      const commonDBNames = ['keyval-store', 'firebaseLocalStorageDb', 'workbox-precache'];
      
      commonDBNames.forEach(dbName => {
        const deleteReq = indexedDB.deleteDatabase(dbName);
        deleteReq.onsuccess = () => console.log(`✅ IndexedDB removido: ${dbName}`);
        deleteReq.onerror = () => {}; // Silenciar erros para DBs que não existem
      });
    } catch (error) {
      console.log('⚠️  Erro ao limpar IndexedDB:', error.message);
    }
  }

  // 6. Forçar reload sem cache
  console.log('\n🔄 Forçando reload sem cache em 2 segundos...');
  console.log('💡 Ou pressione Cmd+Shift+R (Mac) / Ctrl+Shift+R (Windows/Linux)');
  
  setTimeout(() => {
    // Tentar diferentes métodos de hard reload
    if (window.location.reload) {
      window.location.reload(true); // Parâmetro true força reload sem cache
    } else {
      window.location.href = window.location.href + '?_=' + Date.now();
    }
  }, 2000);

  console.log('\n🎉 Limpeza do navegador concluída!');
  console.log('📋 O que foi limpo:');
  console.log('   ✅ localStorage');
  console.log('   ✅ sessionStorage');
  console.log('   ✅ Cookies');
  console.log('   ✅ Cache de recursos');
  console.log('   ✅ IndexedDB (tentativa)');
  console.log('\n🔄 Página será recarregada automaticamente...');
})();

// Versão minificada para copiar facilmente:
// (function(){console.log('🧹 Limpando cache...');try{localStorage.clear();sessionStorage.clear();document.cookie.split(';').forEach(c=>{const n=c.split('=')[0].trim();if(n){document.cookie=`${n}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`}});if('caches'in window){caches.keys().then(names=>Promise.all(names.map(n=>caches.delete(n))))}console.log('✅ Cache limpo! Recarregando...');setTimeout(()=>location.reload(true),1000)}catch(e){console.error('Erro:',e)}})();
