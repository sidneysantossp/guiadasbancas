# 🚀 Como Testar o Login com MySQL

**Status:** ✅ Configuração completa  
**Última atualização:** 30/09/2025 11:50

---

## ⚡ PASSO A PASSO RÁPIDO

### **1. Reinicie o servidor de desenvolvimento**
```bash
# Pare o servidor atual (Ctrl+C)
# Depois inicie novamente:
npm run dev
```

### **2. Teste a conexão MySQL**
Abra no navegador ou curl:
```bash
curl http://localhost:3000/api/db/ping
```

**Esperado:**
```json
{
  "status": "ok",
  "result": {
    "ok": 1,
    "current_user": "canticosccb_guiadasbancas@...",
    "db": "canticosccb_guiadasbancas"
  }
}
```

### **3. Teste o login**
1. Acesse: `http://localhost:3000/jornaleiro`
2. Email: `maria@jornaleiro.com`
3. Senha: `senha123`
4. Clique em "Entrar"
5. Deve redirecionar para: `/jornaleiro/dashboard`

---

## 🔐 CREDENCIAIS DISPONÍVEIS

### **Jornaleiro 1 (Maria):**
- Email: `maria@jornaleiro.com`
- Senha: `senha123`
- Banca: Banca São Jorge
- Role: `jornaleiro`

### **Jornaleiro 2 (Teste):**
- Email: `teste@jornaleiro.com`
- Senha: `senha123`
- Banca: Banca Teste
- Role: `jornaleiro`

### **Admin:**
- Email: `admin@guiadasbancas.com`
- Senha: `admin123`
- Role: `admin`

---

## 🐛 SE DER ERRO

### **Erro: "Missing env var DATABASE_USER"**
**Causa:** Variáveis de ambiente não carregadas  
**Solução:**
1. Verifique se o arquivo `.env.local` existe na raiz do projeto
2. Reinicie o servidor: `npm run dev`

### **Erro: "Server error" ou página `/api/auth/error`**
**Causa:** NextAuth não conseguiu inicializar  
**Solução:**
1. Verifique se `NEXTAUTH_SECRET` está definido no `.env.local`
2. Gere um novo secret:
   ```bash
   openssl rand -base64 32
   ```
3. Adicione ao `.env.local`:
   ```
   NEXTAUTH_SECRET=o-valor-gerado-acima
   ```
4. Reinicie o servidor

### **Erro: "Access denied" no MySQL**
**Causa:** Credenciais incorretas  
**Solução:**
1. Verifique as credenciais no `.env.local`
2. Teste a conexão:
   ```bash
   curl http://localhost:3000/api/db/ping
   ```

### **Erro: "Email ou senha inválidos"**
**Causa:** Usuário não existe ou senha errada  
**Solução:**
1. Verifique se o seed foi executado:
   ```bash
   DATABASE_HOST=203.161.46.119 \
   DATABASE_USER=canticosccb_guiadasbancas \
   DATABASE_PASSWORD='KmSs147258!' \
   DATABASE_NAME=canticosccb_guiadasbancas \
   node scripts/mysql-seed-initial.js
   ```
2. Use as credenciais exatas listadas acima

---

## 📊 VERIFICAR LOGS

### **Console do navegador (F12):**
Procure por mensagens:
- `🔐 Tentando login jornaleiro: ...`
- `✅ Login bem-sucedido, redirecionando...`
- `❌ Email ou senha inválidos`

### **Terminal do servidor:**
Procure por mensagens:
- `✅ Login bem-sucedido: ... | Role: jornaleiro`
- `❌ Usuário não encontrado: ...`
- `❌ Senha inválida para: ...`

---

## ✅ CHECKLIST DE VALIDAÇÃO

- [ ] Arquivo `.env.local` criado com credenciais
- [ ] Servidor reiniciado após criar `.env.local`
- [ ] `/api/db/ping` retorna `status: "ok"`
- [ ] Página `/jornaleiro` carrega sem erros
- [ ] Login com `maria@jornaleiro.com` funciona
- [ ] Redireciona para `/jornaleiro/dashboard`
- [ ] Console mostra "✅ Login bem-sucedido"

---

## 🎯 PRÓXIMOS PASSOS (APÓS LOGIN FUNCIONAR)

1. Atualizar Navbar para usar NextAuth (`useSession`)
2. Proteger rotas do dashboard
3. Implementar logout
4. Implementar registro de jornaleiro
5. Upload de imagens de produtos

---

## 📞 SUPORTE

Se ainda tiver problemas:
1. Copie a mensagem de erro completa
2. Copie os logs do terminal
3. Tire screenshot da página de erro
4. Me envie para análise

---

**Última verificação:** 30/09/2025 11:50  
**Status:** ⏳ Aguardando teste
