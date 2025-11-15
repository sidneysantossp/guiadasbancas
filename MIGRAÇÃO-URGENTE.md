# 🚨 MIGRAÇÃO URGENTE - Coluna addressObj

## ⚠️ PROBLEMA
O cadastro de jornaleiros está falhando com erro:
```
Could not find the 'addressObj' column of 'bancas' in the schema cache
```

## ✅ SOLUÇÃO
Execute o SQL abaixo no **Supabase SQL Editor**:

```sql
-- Adicionar coluna addressObj à tabela bancas
ALTER TABLE bancas 
ADD COLUMN IF NOT EXISTS addressObj JSONB;

-- Índice para busca no JSON se necessário
CREATE INDEX IF NOT EXISTS idx_bancas_addressobj ON bancas USING gin (addressObj);

-- Comentário para documentação
COMMENT ON COLUMN bancas.addressObj IS 'Objeto JSON com campos estruturados do endereço: {cep, street, number, complement, neighborhood, city, uf}';
```

## 🔧 COMO EXECUTAR

1. **Acesse o Supabase Dashboard**
2. **Vá em SQL Editor**
3. **Cole o código acima**
4. **Execute**

## 📋 APÓS A MIGRAÇÃO

Depois que a migração for executada, remova os comentários temporários nos arquivos:
- `/Applications/MAMP/htdocs/guiadasbancas/app/jornaleiro/onboarding/page.tsx` (linha 117)
- `/Applications/MAMP/htdocs/guiadasbancas/app/api/jornaleiro/banca/route.ts` (linhas 356-358)

E faça um novo deploy.

## ⚡ STATUS ATUAL
- ✅ Código temporariamente corrigido (addressObj desabilitado)
- ✅ Deploy feito: https://site-bancas-do-bairro-3232iwc4y-sidneysantossps-projects.vercel.app
- ⏳ **Aguardando execução da migração SQL**

## 🎯 PRIORIDADE
**ALTA** - Cadastros de jornaleiros estão bloqueados até a migração ser executada.
