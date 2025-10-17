#!/bin/bash
# Script para importar todos os lotes automaticamente
# Requer Supabase CLI instalado

echo "🚀 Importando 68 lotes..."

for file in sql-batches/batch-*.sql; do
  echo "📦 Importando $file..."
  supabase db execute --file "$file"
  if [ $? -eq 0 ]; then
    echo "✅ $file importado com sucesso"
  else
    echo "❌ Erro ao importar $file"
    exit 1
  fi
  sleep 2
done

echo "✅ Importação completa!"
