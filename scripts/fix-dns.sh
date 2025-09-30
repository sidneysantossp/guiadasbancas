#!/bin/bash

echo "🔧 Script para corrigir problemas de DNS no macOS"
echo ""

echo "1. Limpando cache DNS..."
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder

echo ""
echo "2. Testando conectividade com Supabase..."
curl -I https://bybeujemisiywgmtnkh.supabase.co

echo ""
echo "3. Testando resolução DNS..."
nslookup bybeujemisiywgmtnkh.supabase.co

echo ""
echo "✅ Script concluído!"
echo ""
echo "📋 Próximos passos:"
echo "1. Se o curl ainda falhar, configure DNS manualmente:"
echo "   - System Settings → Network → Wi-Fi → Details → DNS"
echo "   - Adicione: 1.1.1.1 e 8.8.8.8"
echo "2. Reinicie o servidor: npm run dev"
echo "3. Teste: http://localhost:3000/api/test-supabase"
