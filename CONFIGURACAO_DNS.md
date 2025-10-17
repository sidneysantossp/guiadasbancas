# Configuração DNS - Guia das Bancas

## 📋 Registros DNS necessários

Configure os seguintes registros no seu provedor de DNS (Registro.br, Cloudflare, etc):

### Domínio raiz (sem www)
```
Tipo: A
Nome: @ (ou deixe em branco)
Valor: 216.198.79.1
TTL: 3600 (ou automático)
```

### Subdomínio www
```
Tipo: CNAME
Nome: www
Valor: cname.vercel-dns.com
TTL: 3600 (ou automático)
```

## ⚙️ Configuração na Vercel

1. Acesse o **Dashboard da Vercel**
2. Selecione o projeto **guiadasbancas**
3. Vá em **Settings** → **Domains**
4. Adicione ambos os domínios:
   - `guiadasbancas.com.br`
   - `www.guiadasbancas.com.br`

## 🔄 Redirecionamento

O arquivo `vercel.json` já está configurado para:
- Redirecionar `guiadasbancas.com.br` → `www.guiadasbancas.com.br`
- Redirecionamento permanente (301)
- Preservar todos os paths e parâmetros

## ⏱️ Propagação DNS

Após configurar os registros DNS:
- **Tempo mínimo**: 5-10 minutos
- **Tempo máximo**: 24-48 horas (raro)
- **Média**: 1-2 horas

## ✅ Verificação

Teste se está funcionando:
```bash
# Verificar registro A
dig guiadasbancas.com.br

# Verificar registro CNAME
dig www.guiadasbancas.com.br

# Testar redirecionamento
curl -I https://guiadasbancas.com.br
```

## 📝 Notas

- O IP `216.198.79.1` é o IP da Vercel para domínios apex
- O CNAME `cname.vercel-dns.com` é o padrão da Vercel
- Ambos os domínios terão certificado SSL automático
- O redirecionamento é transparente para o usuário
