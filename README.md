# 📰 Guia das Bancas

**Plataforma digital para conectar jornaleiros e clientes**

Uma solução completa para modernizar o negócio de bancas de jornal, oferecendo:
- 🏪 **Catálogo online** de produtos
- 📱 **Sistema de pedidos** via WhatsApp
- 👥 **Painel administrativo** para jornaleiros
- 🚚 **Gestão de entregas** e status
- 💰 **Controle financeiro** integrado

## 🚀 Tecnologias

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Notificações**: Evolution API (WhatsApp)
- **Deploy**: Vercel
- **Banco**: Simulação em memória (pronto para PostgreSQL/MongoDB)

## 🛠️ Instalação

```bash
# Clone o repositório
git clone https://github.com/sidneysantossp/guiadasbancas.git

# Instale as dependências
npm install

# Execute em desenvolvimento
npm run dev
```

## ⚙️ Configuração

### Variáveis de Ambiente

```env
# Evolution API (WhatsApp)
EVOLUTION_API_URL=https://api.auditseo.com.br
EVOLUTION_API_KEY=sua-api-key
EVOLUTION_INSTANCE_NAME=SDR_AUDITSEO

# Configurações da aplicação
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 📱 Funcionalidades

### Para Clientes
- ✅ Catálogo de produtos online
- ✅ Sistema de pedidos simplificado
- ✅ Notificações automáticas via WhatsApp
- ✅ Acompanhamento de status do pedido

### Para Jornaleiros
- ✅ Painel administrativo completo
- ✅ Gestão de produtos e estoque
- ✅ Controle de pedidos e entregas
- ✅ Configuração de WhatsApp
- ✅ Relatórios e analytics

### Para Administradores
- ✅ Gestão centralizada de bancas
- ✅ Configuração da Evolution API
- ✅ Monitoramento do sistema
- ✅ Controle de usuários

## 🏗️ Arquitetura

```
guiadasbancas/
├── app/                    # Next.js App Router
│   ├── admin/             # Painel administrativo
│   ├── jornaleiro/        # Painel do jornaleiro
│   ├── api/               # API Routes
│   └── (public)/          # Páginas públicas
├── components/            # Componentes React
├── lib/                   # Utilitários e serviços
│   ├── whatsapp.ts       # Serviço WhatsApp
│   └── whatsapp-config.ts # Configuração centralizada
└── docs/                  # Documentação
```

## 🔧 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório GitHub à Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Outras Plataformas

```bash
# Build para produção
npm run build

# Iniciar em produção
npm start
```

## 📚 Documentação

- [Configuração WhatsApp](./docs/whatsapp-config.md)
- [Teste WhatsApp](./TESTE_WHATSAPP.md)

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 👨‍💻 Autor

**Sidney Santos**
- GitHub: [@sidneysantossp](https://github.com/sidneysantossp)

---

**Guia das Bancas** - Modernizando o tradicional negócio de bancas de jornal 📰✨
