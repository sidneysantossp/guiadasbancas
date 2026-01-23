# 🔧 Remover Constraint que Impede Múltiplas Bancas

## ❌ Problema
Erro ao cadastrar segunda banca:
```
duplicate key value violates unique constraint "unique_bancas_user_id"
```

## 🎯 Causa
Existe uma constraint no banco de dados que impede que um mesmo `user_id` tenha mais de uma banca.

## ✅ Solução

### Passo 1: Acessar Supabase Dashboard
1. Acesse: https://rgqlncxrzwgjreggrjcq.supabase.co/project/_/sql
2. Faça login se necessário

### Passo 2: Executar SQL
1. Clique em **"New query"** ou **"+ New"**
2. Cole o seguinte SQL:

```sql
ALTER TABLE bancas DROP CONSTRAINT IF EXISTS unique_bancas_user_id;
```

3. Clique em **"Run"** ou pressione `Ctrl+Enter`

### Passo 3: Verificar
Você deve ver uma mensagem de sucesso:
```
Success. No rows returned
```

### Passo 4: Testar
1. Volte para: https://guiadasbancas.com.br/jornaleiro/bancas/nova
2. Tente cadastrar a nova banca novamente
3. Deve funcionar sem erro!

## 📋 O que essa constraint fazia?
- **Antes:** Impedia que um jornaleiro tivesse mais de uma banca
- **Depois:** Permite que um jornaleiro tenha múltiplas bancas (correto!)

## 💡 Por que remover?
Um jornaleiro pode ter várias bancas em locais diferentes. A constraint estava impedindo esse cenário válido de negócio.
