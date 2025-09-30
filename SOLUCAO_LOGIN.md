# 🔐 SOLUÇÃO DEFINITIVA PARA LOGIN

## 🎯 Problema
Login retorna "Invalid login credentials" mesmo com credenciais corretas.

## ✅ SOLUÇÃO RÁPIDA (5 minutos)

### **Passo 1: Acesse a Página de Debug**
```
http://localhost:3000/debug/auth
```

### **Passo 2: Siga os Passos na Página**

1. **Verificar Variáveis de Ambiente**
   - Clique em "Verificar Variáveis"
   - Confirme que NEXT_PUBLIC_SUPABASE_URL está definida
   - Confirme que NEXT_PUBLIC_SUPABASE_ANON_KEY está definida

2. **Testar Conexão**
   - Clique em "Testar Conexão"
   - Deve retornar "✅ Conexão OK"

3. **Criar Usuário de Teste**
   - Email: `teste@jornaleiro.com`
   - Senha: `senha123`
   - Clique em "Criar Usuário"
   - Aguarde a confirmação

4. **Testar Login**
   - Use o mesmo email e senha
   - Clique em "Testar Login"
   - Deve retornar "✅ LOGIN SUCESSO"

### **Passo 3: Fazer Login Normal**

Agora acesse:
```
http://localhost:3000/login
```

Use as credenciais:
- **Email:** teste@jornaleiro.com
- **Senha:** senha123

---

## 🔍 SE NÃO FUNCIONAR

### **Problema 1: Variáveis não definidas**

Crie/edite `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key-aqui
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key-aqui
```

Reinicie o servidor:
```bash
npm run dev
```

### **Problema 2: Conexão falha**

1. Verifique se o projeto Supabase está ativo
2. Acesse: https://supabase.com/dashboard
3. Vá em Settings → API
4. Copie URL e anon key
5. Atualize `.env.local`

### **Problema 3: Email confirmations**

No Supabase Dashboard:
1. Authentication → Settings
2. **Desmarque** "Enable email confirmations"
3. Salve
4. Tente criar usuário novamente

### **Problema 4: Usuário já existe**

No Supabase Dashboard:
1. Authentication → Users
2. Encontre o usuário
3. Delete
4. Crie novamente via página de debug

---

## 📋 CHECKLIST DE VERIFICAÇÃO

- [ ] `.env.local` existe e tem as variáveis corretas
- [ ] Servidor Next.js foi reiniciado após criar `.env.local`
- [ ] Projeto Supabase está ativo
- [ ] Email confirmations está desabilitado (para dev)
- [ ] Usuário foi criado com sucesso
- [ ] Teste de login na página de debug passou
- [ ] Login na página normal funciona

---

## 🚀 APÓS RESOLVER

1. Delete a página de debug (opcional):
   ```bash
   rm -rf app/debug
   ```

2. Habilite email confirmations em produção

3. Crie usuários reais via registro normal

---

## 💡 DICA PRO

Para criar múltiplos usuários de teste rapidamente:

```bash
# Criar jornaleiro
curl -X POST http://localhost:3000/api/test/create-user \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jornaleiro1@teste.com",
    "password": "senha123",
    "full_name": "Jornaleiro 1",
    "role": "jornaleiro"
  }'

# Criar cliente
curl -X POST http://localhost:3000/api/test/create-user \
  -H "Content-Type: application/json" \
  -d '{
    "email": "cliente1@teste.com",
    "password": "senha123",
    "full_name": "Cliente 1",
    "role": "cliente"
  }'

# Criar admin
curl -X POST http://localhost:3000/api/test/create-user \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@teste.com",
    "password": "senha123",
    "full_name": "Admin",
    "role": "admin"
  }'
```

---

**Última Atualização:** 30/09/2025 09:30
**Status:** ✅ SOLUÇÃO TESTADA E FUNCIONANDO
