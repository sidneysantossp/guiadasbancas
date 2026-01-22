# 🔧 Instruções para Remover Constraint de Unicidade do CPF

## ❌ Problema
A tabela `cotistas` tem uma constraint que impede cadastrar múltiplas cotas com o mesmo CPF.

**Erro:** `duplicate key value violates unique constraint "cotistas_cnpj_cpf_key"`

## ✅ Solução

### Opção 1: SQL Editor (Recomendado)

1. Acesse o Supabase Dashboard:
   - URL: https://rgqlncxrzwgjreggrjcq.supabase.co/project/_/sql

2. Cole e execute este SQL (tente uma linha por vez):

```sql
ALTER TABLE cotistas DROP CONSTRAINT cotistas_cnpj_cpf_key;
```

Se der erro, tente:

```sql
ALTER TABLE cotistas DROP CONSTRAINT IF EXISTS cotistas_cnpj_cpf_key;
```

3. Depois execute:

```sql
CREATE INDEX IF NOT EXISTS idx_cotistas_cnpj_cpf ON cotistas(cnpj_cpf);
```

---

### Opção 2: Interface Visual (Mais Fácil)

1. No Supabase Dashboard, vá em **Table Editor** (menu lateral)

2. Clique na tabela **cotistas**

3. Clique na aba **Constraints** ou **Indexes** (no topo)

4. Procure por `cotistas_cnpj_cpf_key`

5. Clique no ícone de **lixeira** ou **delete** ao lado da constraint

6. Confirme a remoção

---

### Opção 3: Via API (Se as outras não funcionarem)

Execute este comando no terminal:

```bash
cd /Applications/MAMP/htdocs/guiadasbancas
node scripts/remove-constraint-via-api.js
```

---

## 🎯 Após Remover a Constraint

1. Acesse `/admin/cotistas`
2. Cadastre a cota **2031**:
   - Código: `2031`
   - CPF/CNPJ: `87181290800`
   - Razão Social: `2031 - ANSELMO JUOCIUNAS`
   - Outros dados conforme necessário

3. Agora você poderá ter múltiplas cotas com o mesmo CPF!

---

## 📊 Verificar se Funcionou

Após remover a constraint, execute:

```bash
node scripts/check-and-fix-cotistas-constraint.js
```

Deve mostrar: ✅ "Inserção bem-sucedida!"
