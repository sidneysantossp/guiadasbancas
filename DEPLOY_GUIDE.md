# 🚀 Guia de Deploy - Vercel

## 📋 Pré-requisitos

- ✅ Código no GitHub: `https://github.com/sidneysantossp/guiadasbancas`
- ✅ Conta na Vercel: `https://vercel.com`
- ✅ Evolution API configurada: `https://api.auditseo.com.br`

## 🔧 Passo a Passo

### 1. **Conectar Repositório à Vercel**

1. Acesse: `https://vercel.com/dashboard`
2. Clique em **"New Project"**
3. Selecione **"Import Git Repository"**
4. Conecte sua conta GitHub
5. Selecione: `sidneysantossp/guiadasbancas`
6. Clique **"Import"**

### 2. **Configurar Projeto**

**Framework Preset**: Next.js (detectado automaticamente)
**Root Directory**: `./` (padrão)
**Build Command**: `npm run build` (padrão)
**Output Directory**: `.next` (padrão)
**Install Command**: `npm install` (padrão)

### 3. **Configurar Variáveis de Ambiente**

Na seção **"Environment Variables"**, adicione:

```env
EVOLUTION_API_URL=https://api.auditseo.com.br
EVOLUTION_API_KEY=43F2839534E2-4231-9BA7-C8193BD064DF
EVOLUTION_INSTANCE_NAME=SDR_AUDITSEO
NEXT_PUBLIC_APP_URL=https://seu-dominio.vercel.app
```

### 4. **Deploy**

1. Clique **"Deploy"**
2. Aguarde o build (2-3 minutos)
3. ✅ **Deploy concluído!**

## 🌐 URLs Importantes

### **Produção**
- **Site**: `https://guiadasbancas.vercel.app`
- **Admin**: `https://guiadasbancas.vercel.app/admin/login`
- **Jornaleiro**: `https://guiadasbancas.vercel.app/jornaleiro`

### **Credenciais de Teste**
```
Admin:
- Email: admin@guiadasbancas.com
- Senha: admin123

Jornaleiro:
- Email: jornaleiro@banca.com
- Senha: jornaleiro123
```

## ⚙️ Configurações Pós-Deploy

### **1. Configurar WhatsApp**
1. Acesse: `/admin/configuracoes/whatsapp`
2. Verifique se as configurações estão corretas
3. Teste o status da conexão
4. Envie mensagem de teste

### **2. Configurar Domínio (Opcional)**
1. No painel Vercel → **"Settings"** → **"Domains"**
2. Adicione seu domínio personalizado
3. Configure DNS conforme instruções
4. Atualize `NEXT_PUBLIC_APP_URL`

### **3. Monitoramento**
- **Analytics**: Vercel Analytics (automático)
- **Logs**: Vercel Functions → View Logs
- **Performance**: Vercel Speed Insights

## 🔄 Deploy Automático

**Configurado automaticamente:**
- ✅ Push na branch `main` → Deploy automático
- ✅ Pull Request → Preview deploy
- ✅ Rollback automático em caso de erro

## 🐛 Troubleshooting

### **Build Errors**
```bash
# Testar build local
npm run build

# Verificar logs
vercel logs [deployment-url]
```

### **Environment Variables**
- Certifique-se que todas as variáveis estão configuradas
- Redeploy após alterar variáveis
- Use `NEXT_PUBLIC_` para variáveis do cliente

### **WhatsApp Issues**
1. Verifique se a Evolution API está online
2. Teste a API Key no painel admin
3. Confirme se a instância `SDR_AUDITSEO` existe

## 📊 Monitoramento

### **Métricas Importantes**
- **Build Time**: ~2-3 minutos
- **Cold Start**: ~1-2 segundos
- **Response Time**: ~100-300ms
- **Uptime**: 99.9%+

### **Logs Úteis**
```bash
# Ver logs em tempo real
vercel logs --follow

# Logs de uma função específica
vercel logs /api/orders

# Logs de erro
vercel logs --level error
```

## 🎯 Próximos Passos

1. **✅ Deploy realizado**
2. **⏳ Configurar domínio personalizado**
3. **⏳ Implementar banco de dados (PostgreSQL)**
4. **⏳ Configurar email transacional**
5. **⏳ Implementar analytics avançado**
6. **⏳ Configurar CDN para imagens**

## 🆘 Suporte

- **Vercel Docs**: `https://vercel.com/docs`
- **Next.js Docs**: `https://nextjs.org/docs`
- **Evolution API**: `https://doc.evolution-api.com`

---

**🎉 Parabéns! Seu Guia das Bancas está no ar!** 🚀
