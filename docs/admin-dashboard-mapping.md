# Guia das Bancas - Mapeamento Completo dos Painéis Admin e Jornaleiro

## Índice

1. [Análise do Painel do Usuário (Atual)](#análise-do-painel-do-usuário-atual)
2. [Mapeamento Completo - Painel Admin](#mapeamento-completo---painel-admin)
3. [Mapeamento Completo - Painel Jornaleiro](#mapeamento-completo---painel-jornaleiro)
4. [Mapeamento Detalhado das Seções da Home Page](#mapeamento-detalhado-das-seções-da-home-page)
5. [Checklist Completo de Desenvolvimento](#checklist-completo-de-desenvolvimento)

---

## Análise do Painel do Usuário (Atual)

### Funcionalidades Implementadas:
✅ **Autenticação mock** - Login/registro temporário  
✅ **Perfil do usuário** - Edição de dados pessoais, avatar, telefone  
✅ **Gestão de pedidos** - Visualização em abas (andamento, anteriores, assinaturas)  
✅ **Sistema de cupons** - Listagem e aplicação de descontos  
✅ **Lista de favoritos** - Produtos salvos pelo usuário  
✅ **Endereços** - Integração com ViaCEP  
✅ **Métricas pessoais** - Pedidos, saldo, pontos, favoritos  
✅ **Navegação lateral** - Menu com ícones e estados ativos  

### Pontos de Melhoria Identificados:
- Sistema de pontos de fidelidade não funcional
- Caixa de entrada placeholder
- Código de indicação não implementado
- Assinaturas sem funcionalidade

---

## Mapeamento Completo - Painel Admin

### 1. SEO & Configurações Globais

```
🔍 SEO ON-PAGE
- Meta Title global e por página
- Meta Description global e por página
- Palavras-chave foco
- Open Graph (Facebook/WhatsApp)
- Twitter Cards
- Schema.org/JSON-LD
- Robots.txt
- Sitemap XML automático
- Google Analytics/Tag Manager
- Pixel do Facebook
- Canonical URLs

🌐 CONFIGURAÇÕES GERAIS
- Nome da plataforma
- Tagline/slogan
- Favicon upload
- Cores da marca (primária, secundária)
- Fontes personalizadas
- Idioma padrão
- Fuso horário
- Moeda padrão
```

### 2. Header & Navegação

```
🎨 LOGO E BRANDING
- Upload do logo (versões: normal, mobile, footer)
- Dimensões automáticas
- Logo alternativo (modo escuro)
- Posicionamento do logo

📱 MENU PRINCIPAL
- Criação/edição de itens do menu
- Hierarquia (menu > submenu)
- Links internos/externos
- Ícones para cada item
- Ordem de exibição
- Visibilidade (desktop/mobile)

🏷️ CATEGORIAS DO MENU
- CRUD completo de categorias
- Ícones das categorias
- Cores personalizadas
- Imagens de destaque
- Descrições SEO
- Slugs personalizados
- Hierarquia pai/filho
- Status (ativo/inativo)

⚙️ CONFIGURAÇÕES DO HEADER
- Estilo do header (fixo, transparente)
- Altura do header
- Cor de fundo
- Mostrar/ocultar elementos:
  - Barra de localização
  - Campo de busca
  - Carrinho
  - Login/Conta
  - Telefone de contato
```

### 3. Dashboard Principal

```
📊 MÉTRICAS GERAIS
- Total de bancas cadastradas
- Total de jornaleiros ativos
- Pedidos processados (hoje/mês)
- Receita total da plataforma
- Usuários registrados
- Produtos mais vendidos

📈 GRÁFICOS E RELATÓRIOS
- Vendas por região/estado
- Performance das bancas
- Crescimento de usuários
- Análise de categorias mais populares
```

### 4. Gestão de Bancas

```
🏪 LISTAGEM DE BANCAS
- Filtros: Estado, cidade, status, categoria
- Busca por nome/endereço
- Status: Ativa, Pendente, Suspensa
- Ações: Aprovar, Editar, Suspender, Excluir

📝 DETALHES DA BANCA
- Informações do jornaleiro responsável
- Endereço e geolocalização
- Produtos cadastrados
- Histórico de vendas
- Avaliações dos clientes
- Documentos enviados
```

### 5. Gestão de Jornaleiros

```
👥 LISTAGEM DE JORNALEIROS
- Dados pessoais (nome, CPF, telefone)
- Bancas associadas
- Status da conta
- Data de cadastro
- Última atividade

✅ APROVAÇÃO DE CADASTROS
- Validação de documentos
- Verificação de dados
- Aprovação/rejeição com motivos
- Comunicação automática por email/SMS
```

### 6. Gestão de Produtos

```
📦 CATÁLOGO MESTRE
- Categorias de produtos
- Produtos padrão da plataforma
- Preços sugeridos
- Imagens e descrições
- Controle de estoque global

🏷️ CATEGORIAS E TAGS
- Criação/edição de categorias
- Hierarquia de subcategorias
- Tags para filtros
- Ícones e cores das categorias
```

### 7. Gestão de Usuários

```
👤 USUÁRIOS FINAIS
- Lista de todos os usuários
- Histórico de compras
- Endereços cadastrados
- Status da conta (ativo/bloqueado)
- Suporte ao cliente

🎫 SISTEMA DE CUPONS
- Criação de cupons promocionais
- Regras de aplicação
- Validade e limites de uso
- Relatórios de utilização
```

### 8. Configurações da Plataforma

```
⚙️ CONFIGURAÇÕES GERAIS
- Taxas da plataforma
- Configurações de frete
- Métodos de pagamento
- Políticas de devolução
- Termos de uso

📧 COMUNICAÇÃO
- Templates de email
- Notificações push
- SMS automáticos
- Newsletter
```

### 9. Relatórios e Analytics

```
📊 RELATÓRIOS FINANCEIROS
- Comissões por banca
- Receita da plataforma
- Relatórios fiscais
- Análise de inadimplência

📈 ANALYTICS
- Comportamento dos usuários
- Produtos mais buscados
- Conversão de vendas
- Abandono de carrinho
```

---

## Mapeamento Completo - Painel Jornaleiro

### 1. Dashboard do Jornaleiro

```
📊 MÉTRICAS PESSOAIS
- Vendas do dia/mês
- Produtos mais vendidos
- Avaliação média da banca
- Pedidos pendentes
- Receita total

📈 GRÁFICOS
- Vendas por período
- Produtos por categoria
- Horários de maior movimento
- Comparativo mensal
```

### 2. Gestão de Bancas

```
🏪 MINHAS BANCAS
- Lista de bancas cadastradas
- Status de cada banca
- Endereços e horários
- Fotos da banca
- Informações de contato

➕ CADASTRAR NOVA BANCA
- Dados da banca (nome, endereço)
- Upload de fotos
- Horário de funcionamento
- Categorias de produtos
- Integração com ViaCEP
```

### 3. Catálogo de Produtos

```
📦 PRODUTOS DA BANCA
- Lista de produtos disponíveis
- Preços personalizados
- Controle de estoque
- Status (disponível/esgotado)
- Produtos em destaque

🛒 CATÁLOGO MESTRE
- Produtos disponíveis na plataforma
- Adicionar à minha banca
- Definir preços locais
- Configurar disponibilidade
```

### 4. Gestão de Pedidos

```
📋 PEDIDOS RECEBIDOS
- Novos pedidos (notificação)
- Em preparação
- Prontos para retirada/entrega
- Concluídos
- Cancelados

✅ PROCESSAMENTO
- Aceitar/rejeitar pedidos
- Atualizar status
- Comunicação com cliente
- Controle de tempo de preparo
```

### 5. Financeiro

```
💰 RECEITAS
- Vendas por período
- Comissões da plataforma
- Relatórios de pagamento
- Histórico financeiro

🧾 RELATÓRIOS
- Vendas por produto
- Análise de performance
- Comparativo de períodos
- Exportação de dados
```

### 6. Comunicação

```
💬 CHAT COM CLIENTES
- Mensagens dos pedidos
- Suporte ao cliente
- Notificações automáticas

📱 WHATSAPP INTEGRATION
- Link direto para WhatsApp
- Templates de mensagens
- Histórico de conversas
```

### 7. Configurações

```
⚙️ CONFIGURAÇÕES DA BANCA
- Horários de funcionamento
- Métodos de entrega
- Raio de entrega
- Taxas de entrega
- Formas de pagamento aceitas

👤 PERFIL DO JORNALEIRO
- Dados pessoais
- Documentos
- Informações bancárias
- Configurações de notificação
```

---

## Mapeamento Detalhado das Seções da Home Page

### 1. SEÇÃO: FULL BANNER (Hero Slider)

**Como está implementado:**
- Slider rotativo com 3 slides
- Cada slide tem: título (com quebras de linha), descrição, 2 botões CTA, imagem de fundo, gradiente overlay
- Controles: setas laterais, dots indicadores
- Auto-play de 6 segundos
- Transição suave de 600ms

**Painel Admin necessário:**
```
🎠 GERENCIADOR DE SLIDES
┌─ Slide 1 ─────────────────────────────────┐
│ ✅ Ativo  📷 Upload Imagem  🗑️ Excluir     │
│                                           │
│ 📝 Título: [Sua banca favorita\nagora...] │
│ 📄 Descrição: [Jornais, revistas...]     │
│ 🎨 Gradiente: [Seletor de cores]         │
│                                           │
│ 🔗 Botão 1:                              │
│   Texto: [Peça agora]                    │
│   Link: [/bancas-perto-de-mim]           │
│   Estilo: ⚪ Primário ⚫ Outline          │
│                                           │
│ 🔗 Botão 2:                              │
│   Texto: [Sou jornaleiro]                │
│   Link: [/jornaleiro]                    │
│   Estilo: ⚫ Primário ⚪ Outline          │
└───────────────────────────────────────────┘

⚙️ CONFIGURAÇÕES GLOBAIS:
- Tempo de auto-play: [6] segundos
- Velocidade transição: [600] ms
- Mostrar setas: ✅
- Mostrar dots: ✅
- Altura desktop: [520] px
- Altura mobile: [360] px
```

### 2. SEÇÃO: MINI CATEGORY BAR (Sticky)

**Como está implementado:**
- Barra fixa que aparece ao rolar
- 10 categorias com ícones circulares
- Cada item: cor de fundo específica, imagem central, nome embaixo
- Scroll horizontal no mobile

**Painel Admin necessário:**
```
📱 BARRA DE CATEGORIAS STICKY
┌─ Categoria: Revistas ─────────────────────┐
│ ✅ Ativo  🔄 Reordenar  🗑️ Excluir        │
│                                           │
│ 📝 Nome: [Revistas]                      │
│ 🔗 Link: [/departamentos?cat=revistas]   │
│ 🎨 Cor fundo: [#BFA1FF] 🎨              │
│ 📷 Ícone: [Upload/URL]                   │
│ 📏 Tamanho ícone: [28x28] px            │
└───────────────────────────────────────────┘

⚙️ CONFIGURAÇÕES:
- Ativar barra sticky: ✅
- Trigger scroll: [60] px
- Transparência fundo: [85]%
- Blur backdrop: ✅
```

### 3. SEÇÃO: CATEGORY CAROUSEL (Compre por categoria)

**Como está implementado:**
- Título "Compre por categoria" + link "Explorar mais"
- Carousel com 12 categorias
- Cards circulares: cor de fundo + círculo branco + imagem + nome
- Auto-slide a cada 4.5s, avança 1 item por vez
- Responsivo: 2/4/8 itens por view

**Painel Admin necessário:**
```
🎠 CARROSSEL DE CATEGORIAS
┌─ Seção ───────────────────────────────────┐
│ ✅ Ativa                                  │
│ 📝 Título: [Compre por categoria]        │
│ 🔗 Link "Ver mais": [/categorias]        │
└───────────────────────────────────────────┘

┌─ Categoria: Revistas ─────────────────────┐
│ ✅ Ativa  🔄 Ordem: [1]  🗑️ Excluir      │
│                                           │
│ 📝 Nome: [Revistas]                      │
│ 🔗 Slug: [revistas]                      │
│ 🎨 Cor fundo: [#93c3e9] 🎨              │
│ 📷 Imagem: [Upload/URL]                  │
│ 📊 Contador: [24] produtos              │
│ 🎯 Ícone SVG: [Editor de ícone]         │
└───────────────────────────────────────────┘

⚙️ CONFIGURAÇÕES DO CAROUSEL:
- Auto-play: ✅ Tempo: [4.5] segundos
- Itens por view (mobile): [2]
- Itens por view (tablet): [4] 
- Itens por view (desktop): [8]
- Velocidade transição: [600] ms
- Loop infinito: ✅
```

### 4. SEÇÃO: FEATURED BANCAS (Bancas perto de você)

**Como está implementado:**
- Título + subtítulo + link "Ver todas"
- Cards de bancas com: imagem, rating com estrelas, nome, descrição, categorias com ícones
- Carousel responsivo: 1/2/4 por view
- Ordenação por distância do usuário
- Auto-slide a cada 5s

**Painel Admin necessário:**
```
🏪 BANCAS EM DESTAQUE
┌─ Seção ───────────────────────────────────┐
│ ✅ Ativa                                  │
│ 📝 Título: [Bancas perto de você]        │
│ 📝 Subtítulo: [Recomendações perto...]   │
│ 🔗 Link "Ver todas": [/bancas-perto...]  │
└───────────────────────────────────────────┘

┌─ Critérios de Seleção ────────────────────┐
│ 🎯 Modo: ⚪ Manual ⚪ Automático          │
│                                           │
│ Se Manual:                                │
│ 📋 Bancas selecionadas: [Lista]          │
│                                           │
│ Se Automático:                            │
│ 📊 Por rating: ✅ Mínimo [4.5]           │
│ 📍 Por proximidade: ✅                   │
│ 📈 Por vendas: ✅                        │
│ 🔢 Quantidade máxima: [12]               │
└───────────────────────────────────────────┘

┌─ Configuração de Card ────────────────────┐
│ 📏 Altura do card: [288] px              │
│ 📷 Altura da imagem: [160] px            │
│ ⭐ Mostrar rating: ✅                     │
│ 📝 Mostrar descrição: ✅                 │
│ 🏷️ Máx. categorias: [3]                  │
│ 🗺️ Mostrar "Ver no Mapa": ✅             │
└───────────────────────────────────────────┘

⚙️ CONFIGURAÇÕES DO CAROUSEL:
- Auto-play: ✅ Tempo: [5] segundos
- Itens por view (mobile): [1]
- Itens por view (tablet): [2]
- Itens por view (desktop): [4]
- Gap entre cards: [16] px
```

### 5. SEÇÕES DE PRODUTOS (Padrão para todas)

**Seções existentes:**
- MostSearchedProducts
- AdsHighlights  
- TrendingProducts
- FavoritePicks
- TopReviewed
- NewArrivals

**Painel Admin necessário (template para todas):**
```
📦 SEÇÃO DE PRODUTOS: [Nome da Seção]
┌─ Configurações Gerais ────────────────────┐
│ ✅ Ativa                                  │
│ 📝 Título: [Produtos mais buscados]      │
│ 📝 Subtítulo: [Opcional]                 │
│ 🔗 Link "Ver mais": [URL]                │
│ 📍 Posição na home: [6]                  │
└───────────────────────────────────────────┘

┌─ Critérios de Seleção ────────────────────┐
│ 🎯 Modo: ⚪ Manual ⚪ Automático          │
│                                           │
│ Se Manual:                                │
│ 📋 Produtos selecionados: [Lista]        │
│                                           │
│ Se Automático:                            │
│ 📊 Por vendas: ✅                        │
│ 👁️ Por visualizações: ✅                 │
│ ⭐ Por rating: ✅ Mínimo [4.0]           │
│ 📅 Período: [Últimos 30 dias]            │
│ 🔢 Quantidade: [12] produtos             │
│ 🏷️ Categorias: [Todas/Específicas]       │
└───────────────────────────────────────────┘

┌─ Layout e Exibição ───────────────────────┐
│ 📱 Tipo: ⚪ Grid ⚪ Carousel              │
│ 📏 Itens por linha (desktop): [4]        │
│ 📏 Itens por linha (tablet): [3]         │
│ 📏 Itens por linha (mobile): [2]         │
│ 🎨 Estilo do card: [Padrão/Compacto]     │
│ 💰 Mostrar preço: ✅                     │
│ ⭐ Mostrar rating: ✅                     │
│ 🛒 Botão "Adicionar": ✅                 │
└───────────────────────────────────────────┘
```

### 6. SEÇÃO: MINI BANNERS

**Como está implementado:**
- Grid de banners promocionais menores
- Cada banner: imagem, título, CTA

**Painel Admin necessário:**
```
🖼️ MINI BANNERS
┌─ Seção ───────────────────────────────────┐
│ ✅ Ativa                                  │
│ 📍 Posição na home: [8]                  │
│ 📐 Layout: ⚪ 2 colunas ⚪ 3 colunas      │
└───────────────────────────────────────────┘

┌─ Banner 1 ────────────────────────────────┐
│ ✅ Ativo  🔄 Ordem: [1]  🗑️ Excluir      │
│                                           │
│ 📷 Imagem: [Upload]                      │
│ 📝 Título: [Promoção especial]          │
│ 📝 Subtítulo: [Opcional]                │
│ 🔗 Link: [/promocoes]                   │
│ 🎨 Cor do texto: [#ffffff]              │
│ 📏 Altura: [200] px                     │
│ 🎯 Posição texto: [Centro/Esquerda...]  │
└───────────────────────────────────────────┘

⚙️ CONFIGURAÇÕES:
- Gap entre banners: [16] px
- Border radius: [12] px
- Hover effect: ✅
```

### 7. SEÇÃO: NEWSLETTER

**Como está implementado:**
- Formulário de inscrição
- Título, descrição, campo email, botão

**Painel Admin necessário:**
```
📧 NEWSLETTER
┌─ Configurações ───────────────────────────┐
│ ✅ Ativa                                  │
│ 📝 Título: [Fique por dentro]           │
│ 📝 Descrição: [Receba novidades...]     │
│ 📝 Placeholder: [Seu melhor e-mail]     │
│ 📝 Botão: [Inscrever-se]                │
│ 🎨 Cor de fundo: [#f8f9fa]              │
│ 📍 Posição na home: [Final]             │
└───────────────────────────────────────────┘

┌─ Integração ──────────────────────────────┐
│ 📮 Provedor: [Mailchimp/SendGrid...]    │
│ 🔑 API Key: [Configurar]                │
│ 📋 Lista: [Newsletter Geral]            │
│ ✉️ Email confirmação: ✅                 │
│ 📊 Analytics: ✅                        │
└───────────────────────────────────────────┘
```

### 8. SISTEMA DE ORDENAÇÃO DAS SEÇÕES

```
🔄 CONSTRUTOR DE HOME PAGE
┌─ Seções Disponíveis ──────────────────────┐
│ [1] ✅ Full Banner (Hero)                │
│ [2] ✅ Mini Category Bar                 │
│ [3] ✅ Category Carousel                 │
│ [4] ✅ Featured Bancas                   │
│ [5] ✅ Most Searched Products            │
│ [6] ✅ Ads Highlights                    │
│ [7] ✅ Trending Products                 │
│ [8] ✅ Mini Banners                      │
│ [9] ✅ Favorite Picks                    │
│ [10] ✅ Top Reviewed                     │
│ [11] ✅ New Arrivals                     │
│ [12] ✅ Newsletter                       │
└───────────────────────────────────────────┘

🎛️ CONTROLES:
- Drag & Drop para reordenar
- Toggle ✅/❌ para ativar/desativar
- 👁️ Preview em tempo real
- 📱 Preview mobile/desktop
- 💾 Salvar alterações
- 🔄 Restaurar padrão
```

---

## Checklist Completo de Desenvolvimento

### FASE 1: INFRAESTRUTURA E AUTENTICAÇÃO
- [ ] Sistema de autenticação real (JWT)
- [ ] Middleware de autorização por roles
- [ ] Banco de dados real (PostgreSQL/MongoDB)
- [ ] APIs RESTful completas
- [ ] Sistema de upload de arquivos
- [ ] Validação de documentos (CPF, CNPJ)

### FASE 2: PAINEL ADMIN - CMS
- [ ] Sistema de upload de arquivos (imagens/documentos)
- [ ] Editor WYSIWYG para conteúdo
- [ ] Gestão de SEO global e por página
- [ ] Upload e configuração de logos
- [ ] Paleta de cores personalizável
- [ ] Configurações de tipografia

### FASE 3: HEADER E NAVEGAÇÃO
- [ ] CRUD de categorias com ícones
- [ ] Construtor de menu drag-and-drop
- [ ] Configurações visuais do header
- [ ] Sistema de mega menu
- [ ] Responsividade do menu mobile

### FASE 4: HERO E BANNERS
- [ ] Sistema de slider com múltiplas imagens
- [ ] Editor de CTAs por slide
- [ ] Agendamento de banners
- [ ] Sistema de mini banners
- [ ] Preview em tempo real

### FASE 5: SEÇÕES DA HOME
- [ ] Construtor de seções drag-and-drop
- [ ] Configuração de produtos em destaque
- [ ] Seleção de bancas destacadas
- [ ] Personalização de títulos e layouts
- [ ] Sistema de preview

### FASE 6: FOOTER E PÁGINAS
- [ ] Configurador completo do footer
- [ ] Editor de páginas estáticas
- [ ] Sistema de FAQ dinâmico
- [ ] Gestão de links úteis
- [ ] Integração com redes sociais

### FASE 7: PAINEL ADMIN - NEGÓCIO
- [ ] Layout responsivo do dashboard admin
- [ ] Métricas e gráficos em tempo real
- [ ] CRUD completo de bancas
- [ ] CRUD completo de jornaleiros
- [ ] Sistema de aprovação de cadastros
- [ ] Gestão do catálogo mestre
- [ ] Sistema de cupons avançado
- [ ] Relatórios financeiros
- [ ] Configurações da plataforma

### FASE 8: PAINEL JORNALEIRO
- [ ] Dashboard com métricas pessoais
- [ ] Cadastro e gestão de bancas
- [ ] Catálogo personalizado por banca
- [ ] Sistema de pedidos em tempo real
- [ ] Notificações push/email
- [ ] Integração WhatsApp
- [ ] Relatórios de vendas
- [ ] Configurações de entrega

### FASE 9: MELHORIAS NO PAINEL USUÁRIO
- [ ] Sistema de pontos de fidelidade funcional
- [ ] Programa de indicação
- [ ] Caixa de entrada com notificações
- [ ] Sistema de assinaturas
- [ ] Avaliações e reviews
- [ ] Histórico detalhado de pedidos
- [ ] Suporte ao cliente integrado

### FASE 10: FUNCIONALIDADES AVANÇADAS
- [ ] Sistema de pagamento real
- [ ] Rastreamento de pedidos
- [ ] Geolocalização em tempo real
- [ ] Analytics avançado
- [ ] Sistema de reviews e avaliações
- [ ] Programa de fidelidade
- [ ] Integração com redes sociais
- [ ] PWA (Progressive Web App)

### FASE 11: CONFIGURAÇÕES AVANÇADAS
- [ ] Tema builder (cores, fontes, espaçamentos)
- [ ] Sistema de notificações personalizáveis
- [ ] Configurações de formulários
- [ ] Integrações com APIs externas
- [ ] Sistema de backup de configurações

### FASE 12: OTIMIZAÇÕES E SEGURANÇA
- [ ] Testes automatizados
- [ ] Monitoramento de performance
- [ ] Backup automático
- [ ] Logs de auditoria
- [ ] Compliance LGPD
- [ ] Rate limiting nas APIs
- [ ] Criptografia de dados sensíveis

---

## Considerações Técnicas

### Tecnologias Recomendadas
- **Frontend Admin**: React + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express/Fastify + Prisma/TypeORM
- **Banco de Dados**: PostgreSQL + Redis (cache)
- **Upload**: AWS S3 ou Cloudinary
- **Email**: SendGrid ou Mailgun
- **Analytics**: Google Analytics + Mixpanel
- **Monitoramento**: Sentry + LogRocket

### Arquitetura Sugerida
- **Microserviços** para escalabilidade
- **API Gateway** para roteamento
- **CDN** para assets estáticos
- **Load Balancer** para distribuição
- **Docker** para containerização
- **CI/CD** para deploy automatizado

---

## Estrutura de URLs dos Painéis

### **PAINEL ADMIN**

#### **Autenticação**
- `/admin/login` - Login do administrador ✅ (já existe)
- `/admin/logout` - Logout (redirect)
- `/admin/forgot-password` - Recuperação de senha

#### **Dashboard Principal**
- `/admin/dashboard` - Dashboard principal ✅ (já existe)

#### **CMS - Gestão de Conteúdo**
- `/admin/cms/seo` - Configurações de SEO
- `/admin/cms/branding` - Logo e identidade visual
- `/admin/cms/header` - Configurações do header
- `/admin/cms/footer` - Configurações do footer
- `/admin/cms/home` - Construtor da home page
- `/admin/cms/pages` - Páginas estáticas
- `/admin/cms/menus` - Gestão de menus

#### **Gestão de Negócio**
- `/admin/bancas` - Listagem de bancas
- `/admin/bancas/[id]` - Detalhes da banca
- `/admin/bancas/pending` - Bancas pendentes de aprovação
- `/admin/jornaleiros` - Listagem de jornaleiros
- `/admin/jornaleiros/[id]` - Detalhes do jornaleiro
- `/admin/jornaleiros/pending` - Jornaleiros pendentes
- `/admin/users` - Usuários finais
- `/admin/users/[id]` - Detalhes do usuário

#### **Catálogo**
- `/admin/products` - Catálogo mestre
- `/admin/products/create` - Criar produto
- `/admin/products/[id]` - Editar produto
- `/admin/categories` - Gestão de categorias
- `/admin/categories/create` - Criar categoria
- `/admin/categories/[id]` - Editar categoria

#### **Marketing**
- `/admin/coupons` - Sistema de cupons
- `/admin/coupons/create` - Criar cupom
- `/admin/coupons/[id]` - Editar cupom
- `/admin/banners` - Gestão de banners
- `/admin/banners/hero` - Slider principal
- `/admin/banners/mini` - Mini banners
- `/admin/newsletter` - Newsletter

#### **Pedidos e Financeiro**
- `/admin/orders` - Todos os pedidos
- `/admin/orders/[id]` - Detalhes do pedido
- `/admin/financial` - Relatórios financeiros
- `/admin/financial/commissions` - Comissões
- `/admin/financial/reports` - Relatórios

#### **Configurações**
- `/admin/settings` - Configurações gerais
- `/admin/settings/platform` - Configurações da plataforma
- `/admin/settings/shipping` - Configurações de frete
- `/admin/settings/payments` - Métodos de pagamento
- `/admin/settings/notifications` - Templates de comunicação

#### **Analytics**
- `/admin/analytics` - Dashboard de analytics
- `/admin/analytics/users` - Comportamento dos usuários
- `/admin/analytics/sales` - Análise de vendas
- `/admin/analytics/products` - Performance de produtos

### **PAINEL JORNALEIRO**

#### **Autenticação**
- `/jornaleiro` - Landing page ✅ (já existe)
- `/jornaleiro/login` - Login
- `/jornaleiro/registrar` - Cadastro ✅ (já existe)
- `/jornaleiro/forgot-password` - Recuperação de senha

#### **Dashboard**
- `/jornaleiro/dashboard` - Dashboard principal ✅ (já existe)

#### **Gestão de Bancas**
- `/jornaleiro/bancas` - Minhas bancas
- `/jornaleiro/bancas/create` - Cadastrar nova banca
- `/jornaleiro/bancas/[id]` - Editar banca
- `/jornaleiro/bancas/[id]/photos` - Fotos da banca
- `/jornaleiro/bancas/[id]/hours` - Horários de funcionamento

#### **Catálogo**
- `/jornaleiro/produtos` - Meus produtos
- `/jornaleiro/produtos/catalog` - Catálogo mestre
- `/jornaleiro/produtos/[id]` - Editar produto
- `/jornaleiro/produtos/add` - Adicionar produto à banca
- `/jornaleiro/estoque` - Controle de estoque

#### **Pedidos**
- `/jornaleiro/pedidos` - Todos os pedidos
- `/jornaleiro/pedidos/novos` - Novos pedidos
- `/jornaleiro/pedidos/preparacao` - Em preparação
- `/jornaleiro/pedidos/prontos` - Prontos para retirada
- `/jornaleiro/pedidos/[id]` - Detalhes do pedido

#### **Financeiro**
- `/jornaleiro/financeiro` - Dashboard financeiro
- `/jornaleiro/financeiro/vendas` - Relatório de vendas
- `/jornaleiro/financeiro/comissoes` - Comissões da plataforma
- `/jornaleiro/financeiro/pagamentos` - Histórico de pagamentos

#### **Comunicação**
- `/jornaleiro/chat` - Chat com clientes
- `/jornaleiro/whatsapp` - Configurações WhatsApp
- `/jornaleiro/notifications` - Central de notificações

#### **Configurações**
- `/jornaleiro/perfil` - Meu perfil
- `/jornaleiro/configuracoes` - Configurações gerais
- `/jornaleiro/configuracoes/entrega` - Configurações de entrega
- `/jornaleiro/configuracoes/pagamentos` - Formas de pagamento
- `/jornaleiro/configuracoes/notifications` - Preferências de notificação

### **Estrutura de Pastas Sugerida**

```
app/
├── admin/
│   ├── layout.tsx (layout específico do admin)
│   ├── login/page.tsx ✅
│   ├── dashboard/page.tsx ✅
│   ├── cms/
│   │   ├── seo/page.tsx
│   │   ├── branding/page.tsx
│   │   ├── header/page.tsx
│   │   ├── footer/page.tsx
│   │   ├── home/page.tsx
│   │   ├── pages/page.tsx
│   │   └── menus/page.tsx
│   ├── bancas/
│   │   ├── page.tsx
│   │   ├── [id]/page.tsx
│   │   └── pending/page.tsx
│   ├── jornaleiros/
│   │   ├── page.tsx
│   │   ├── [id]/page.tsx
│   │   └── pending/page.tsx
│   ├── products/
│   │   ├── page.tsx
│   │   ├── create/page.tsx
│   │   └── [id]/page.tsx
│   ├── categories/
│   │   ├── page.tsx
│   │   ├── create/page.tsx
│   │   └── [id]/page.tsx
│   ├── coupons/
│   │   ├── page.tsx
│   │   ├── create/page.tsx
│   │   └── [id]/page.tsx
│   ├── banners/
│   │   ├── hero/page.tsx
│   │   └── mini/page.tsx
│   ├── orders/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── financial/
│   │   ├── page.tsx
│   │   ├── commissions/page.tsx
│   │   └── reports/page.tsx
│   ├── settings/
│   │   ├── page.tsx
│   │   ├── platform/page.tsx
│   │   ├── shipping/page.tsx
│   │   ├── payments/page.tsx
│   │   └── notifications/page.tsx
│   └── analytics/
│       ├── page.tsx
│       ├── users/page.tsx
│       ├── sales/page.tsx
│       └── products/page.tsx
│
└── jornaleiro/
    ├── layout.tsx (layout específico do jornaleiro)
    ├── page.tsx ✅
    ├── login/page.tsx
    ├── registrar/page.tsx ✅
    ├── dashboard/page.tsx ✅
    ├── bancas/
    │   ├── page.tsx
    │   ├── create/page.tsx
    │   └── [id]/
    │       ├── page.tsx
    │       ├── photos/page.tsx
    │       └── hours/page.tsx
    ├── produtos/
    │   ├── page.tsx
    │   ├── catalog/page.tsx
    │   ├── add/page.tsx
    │   └── [id]/page.tsx
    ├── estoque/page.tsx
    ├── pedidos/
    │   ├── page.tsx
    │   ├── novos/page.tsx
    │   ├── preparacao/page.tsx
    │   ├── prontos/page.tsx
    │   └── [id]/page.tsx
    ├── financeiro/
    │   ├── page.tsx
    │   ├── vendas/page.tsx
    │   ├── comissoes/page.tsx
    │   └── pagamentos/page.tsx
    ├── chat/page.tsx
    ├── whatsapp/page.tsx
    ├── notifications/page.tsx
    ├── perfil/page.tsx
    └── configuracoes/
        ├── page.tsx
        ├── entrega/page.tsx
        ├── pagamentos/page.tsx
        └── notifications/page.tsx
```

---

*Documento criado em: 25/09/2025*  
*Versão: 1.1*  
*Projeto: Guia das Bancas*
