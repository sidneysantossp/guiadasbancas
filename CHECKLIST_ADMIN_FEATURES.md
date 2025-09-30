# 📋 Checklist Completo de Recursos Gerenciáveis - Guia das Bancas

## 🎯 Objetivo
Mapear todas as seções do frontend e identificar quais recursos precisam ser gerenciáveis pelo:
- **Admin Geral** (Administrador da plataforma)
- **Jornaleiro** (Dono da banca)

---

## 🏠 PÁGINA INICIAL (Homepage)

### 1. **NAVBAR (Barra de Navegação)**
#### Elementos Gerenciáveis:

**Logo e Branding:**
- ✅ **Logo** - Admin Geral
  - Status: ✅ IMPLEMENTADO (`/admin/cms/branding`)
  - Permite upload de logo customizada
  
- ✅ **Nome do Site** - Admin Geral
  - Status: ✅ IMPLEMENTADO (`/admin/cms/branding`)
  
- ✅ **Cores Primária/Secundária** - Admin Geral
  - Status: ✅ IMPLEMENTADO (`/admin/cms/branding`)

**Menu Principal:**
- ❌ **Itens do Menu** - Admin Geral
  - Status: ❌ NÃO IMPLEMENTADO
  - Necessário: CRUD de itens de menu
  - Campos: Nome, Link, Ordem, Ativo/Inativo
  
- ❌ **Mega Menu (Departamentos)** - Admin Geral
  - Status: ❌ NÃO IMPLEMENTADO (hardcoded em `DepartmentsMegaMenu.tsx`)
  - Necessário: Gerenciar categorias e subcategorias
  - Campos: Categoria Pai, Subcategorias, Ícones, Ordem

**Busca:**
- ⚠️ **Barra de Busca** - Funcional mas sem configuração
  - Status: ⚠️ PARCIAL (funciona mas não é configurável)
  - Necessário: Configurar placeholder, sugestões, filtros

**Localização:**
- ⚠️ **Seletor de Localização** - Funcional
  - Status: ⚠️ PARCIAL
  - Necessário: Admin configurar raio de busca padrão

**Carrinho:**
- ✅ **Mini Carrinho** - Funcional
  - Status: ✅ IMPLEMENTADO (dinâmico)

---

### 2. **FULL BANNER (Slider Rotativo)**
#### Elementos Gerenciáveis:

- ✅ **Slides** - Admin Geral
  - Status: ✅ IMPLEMENTADO (`/admin/cms/home`)
  - Permite: Upload de imagens, títulos, descrições, CTAs, links
  - Campos: Imagem, Título, Descrição, Botão Texto, Botão Link, Ordem, Ativo

---

### 3. **MOBILE CATEGORY SCROLLER**
#### Elementos Gerenciáveis:

- ⚠️ **Categorias Mobile** - Admin Geral
  - Status: ⚠️ PARCIAL (usa dados de categories)
  - Necessário: Configurar quais categorias aparecem no scroll mobile
  - Campos: Seleção de categorias, Ordem de exibição

---

### 4. **MINI CATEGORY BAR (Desktop)**
#### Elementos Gerenciáveis:

- ⚠️ **Barra de Categorias** - Admin Geral
  - Status: ⚠️ PARCIAL (usa dados de categories)
  - Necessário: Configurar quais categorias aparecem na barra sticky
  - Campos: Seleção de categorias, Limite de itens, Ordem

---

### 5. **TRUST BADGES (Selos de Confiança)**
#### Elementos Gerenciáveis:

- ❌ **Badges** - Admin Geral
  - Status: ❌ NÃO IMPLEMENTADO (hardcoded)
  - Necessário: CRUD de badges
  - Campos: Ícone, Título, Descrição, Ordem, Ativo
  - Exemplo: "Frete Grátis", "Pagamento Seguro", "Entrega Rápida"

---

### 6. **CATEGORY CAROUSEL**
#### Elementos Gerenciáveis:

- ✅ **Categorias** - Admin Geral
  - Status: ✅ IMPLEMENTADO (`/admin/categories`)
  - Permite: CRUD completo de categorias
  - Campos: Nome, Imagem, Link, Ordem, Ativo

---

### 7. **FEATURED BANCAS (Bancas em Destaque)**
#### Elementos Gerenciáveis:

**Admin Geral:**
- ❌ **Seleção de Bancas Destaque** - Admin Geral
  - Status: ❌ NÃO IMPLEMENTADO
  - Necessário: Marcar bancas como "destaque"
  - Campos: Checkbox "Destaque", Ordem de exibição

**Jornaleiro:**
- ⚠️ **Dados da Banca** - Jornaleiro
  - Status: ⚠️ PARCIAL (`/jornaleiro/banca`)
  - Necessário: Completar campos
  - Campos Existentes: Nome, Endereço, CEP, Coordenadas
  - Campos Faltantes:
    - ❌ Logo da Banca
    - ❌ Foto de Capa
    - ❌ Descrição
    - ❌ Horário de Funcionamento
    - ❌ Telefone/WhatsApp
    - ❌ Redes Sociais
    - ❌ Formas de Pagamento Aceitas

---

### 8. **MOST SEARCHED PRODUCTS (Mais Buscados)**
#### Elementos Gerenciáveis:

- ❌ **Produtos Mais Buscados** - Sistema Automático
  - Status: ❌ NÃO IMPLEMENTADO
  - Necessário: Tracking de buscas e visualizações
  - Alternativa: Admin selecionar manualmente produtos para essa seção

---

### 9. **ADS HIGHLIGHTS (Banners Publicitários)**
#### Elementos Gerenciáveis:

- ❌ **Banners de Anúncios** - Admin Geral
  - Status: ❌ NÃO IMPLEMENTADO (hardcoded)
  - Necessário: CRUD de banners
  - Campos: Imagem, Título, Link, Posição, Tamanho, Ordem, Ativo, Data Início/Fim

---

### 10. **TRENDING PRODUCTS (Produtos em Alta)**
#### Elementos Gerenciáveis:

- ❌ **Produtos em Tendência** - Admin Geral ou Automático
  - Status: ❌ NÃO IMPLEMENTADO
  - Necessário: Sistema de trending ou seleção manual
  - Opções:
    - Automático: Baseado em vendas/visualizações
    - Manual: Admin seleciona produtos

---

### 11. **MINI BANNERS**
#### Elementos Gerenciáveis:

- ❌ **Mini Banners** - Admin Geral
  - Status: ❌ NÃO IMPLEMENTADO (hardcoded)
  - Necessário: CRUD de mini banners
  - Campos: Imagem, Título, Subtítulo, Link, Ordem, Ativo
  - Layouts: 2 colunas, 3 colunas, etc.

---

### 12. **FAVORITE PICKS (Escolhas Favoritas)**
#### Elementos Gerenciáveis:

- ❌ **Produtos Favoritos** - Admin Geral
  - Status: ❌ NÃO IMPLEMENTADO
  - Necessário: Seleção manual de produtos
  - Campos: Seleção de produtos, Ordem, Título da seção

---

### 13. **TOP REVIEWED (Mais Avaliados)**
#### Elementos Gerenciáveis:

- ❌ **Sistema de Reviews** - Sistema + Moderação
  - Status: ❌ NÃO IMPLEMENTADO
  - Necessário:
    - Sistema de avaliações de produtos
    - Moderação de reviews (Admin)
    - Resposta a reviews (Jornaleiro)

---

### 14. **NEW ARRIVALS (Novidades)**
#### Elementos Gerenciáveis:

- ⚠️ **Produtos Novos** - Automático baseado em data
  - Status: ⚠️ PARCIAL
  - Necessário: Configurar período (últimos X dias)
  - Alternativa: Checkbox "Novidade" em produtos

---

### 15. **REFERRAL BANNER (Banner de Indicação)**
#### Elementos Gerenciáveis:

- ❌ **Banner de Indicação** - Admin Geral
  - Status: ❌ NÃO IMPLEMENTADO (hardcoded)
  - Necessário: Configurar texto, imagem, CTA
  - Sistema de Referral ainda não existe

---

### 16. **VENDOR SIGNUP BANNER (Banner Cadastro Jornaleiro)**
#### Elementos Gerenciáveis:

- ❌ **Banner Cadastro** - Admin Geral
  - Status: ❌ NÃO IMPLEMENTADO (hardcoded)
  - Necessário: Configurar texto, imagem, CTA

---

### 17. **NEWSLETTER**
#### Elementos Gerenciáveis:

- ❌ **Configuração Newsletter** - Admin Geral
  - Status: ❌ NÃO IMPLEMENTADO
  - Necessário:
    - Integração com serviço de email (Mailchimp, SendGrid)
    - Configurar texto do formulário
    - Gerenciar assinantes
    - Enviar campanhas

---

### 18. **FOOTER (Rodapé)**
#### Elementos Gerenciáveis:

- ❌ **Links do Footer** - Admin Geral
  - Status: ❌ NÃO IMPLEMENTADO (hardcoded em `AppFooter.tsx`)
  - Necessário: CRUD de seções e links do footer
  - Campos:
    - Seções (Sobre, Ajuda, Categorias, etc.)
    - Links dentro de cada seção
    - Redes sociais
    - Informações de contato
    - Formas de pagamento aceitas
    - Selos de segurança

---

## 🏪 PÁGINA DA BANCA

### 1. **HEADER DA BANCA**
#### Elementos Gerenciáveis pelo Jornaleiro:

- ⚠️ **Informações da Banca** - Jornaleiro
  - Status: ⚠️ PARCIAL
  - Campos Existentes:
    - ✅ Nome
    - ✅ Endereço
    - ✅ CEP
  - Campos Faltantes:
    - ❌ Logo/Avatar da Banca
    - ❌ Foto de Capa/Banner
    - ❌ Descrição/Bio
    - ❌ Horário de Funcionamento
    - ❌ Telefone/WhatsApp
    - ❌ Email
    - ❌ Redes Sociais (Instagram, Facebook)
    - ❌ Avaliação/Rating
    - ❌ Número de Avaliações
    - ❌ Tempo de Resposta
    - ❌ Taxa de Entrega no Prazo

---

### 2. **PRODUTOS DA BANCA**
#### Elementos Gerenciáveis pelo Jornaleiro:

- ✅ **Catálogo de Produtos** - Jornaleiro
  - Status: ✅ IMPLEMENTADO (`/jornaleiro/produtos`)
  - Permite: CRUD completo
  - Campos: Nome, Descrição, Preço, Imagens, Categoria, Estoque, etc.

- ❌ **Organização de Produtos** - Jornaleiro
  - Status: ❌ NÃO IMPLEMENTADO
  - Necessário:
    - Coleções/Vitrines personalizadas
    - Ordem de exibição dos produtos
    - Produtos em destaque da banca
    - Produtos fixados no topo

---

### 3. **OFERTAS DA BANCA**
#### Elementos Gerenciáveis pelo Jornaleiro:

- ⚠️ **Cupons e Promoções** - Jornaleiro
  - Status: ⚠️ PARCIAL (`/jornaleiro/coupons`)
  - Necessário: Melhorar interface e funcionalidades
  - Campos: Código, Desconto, Validade, Limite de Uso, Produtos Aplicáveis

---

## 🛍️ PÁGINA DE PRODUTO

### 1. **INFORMAÇÕES DO PRODUTO**
#### Elementos Gerenciáveis pelo Jornaleiro:

- ✅ **Dados Básicos** - Jornaleiro
  - Status: ✅ IMPLEMENTADO
  - Campos: Nome, Descrição, Preço, Imagens

- ❌ **Informações Avançadas** - Jornaleiro
  - Status: ❌ NÃO IMPLEMENTADO
  - Necessário:
    - Especificações técnicas (tabela)
    - Vídeos do produto
    - Documentos/PDFs
    - Perguntas Frequentes do produto
    - Guia de tamanhos (se aplicável)

---

### 2. **REVIEWS DO PRODUTO**
#### Elementos Gerenciáveis:

- ❌ **Sistema de Avaliações** - Cliente + Moderação
  - Status: ❌ NÃO IMPLEMENTADO
  - Necessário:
    - Cliente avaliar após compra
    - Jornaleiro responder avaliações
    - Admin moderar avaliações
    - Fotos nas avaliações
    - Avaliação verificada (compra confirmada)

---

### 3. **PRODUTOS RELACIONADOS**
#### Elementos Gerenciáveis:

- ❌ **Produtos Relacionados** - Automático ou Manual
  - Status: ❌ NÃO IMPLEMENTADO
  - Opções:
    - Automático: Mesma categoria/tags
    - Manual: Jornaleiro seleciona produtos relacionados

---

## 🛒 CARRINHO E CHECKOUT

### 1. **CONFIGURAÇÕES DE FRETE**
#### Elementos Gerenciáveis:

- ⚠️ **Frete Grátis** - Admin Geral
  - Status: ⚠️ PARCIAL (hardcoded em `shippingConfig`)
  - Necessário: Interface para configurar
  - Campos:
    - Valor mínimo para frete grátis
    - Ativar/Desativar frete grátis
    - Regiões com frete grátis

- ❌ **Cálculo de Frete** - Jornaleiro
  - Status: ❌ NÃO IMPLEMENTADO
  - Necessário:
    - Integração com Correios/Transportadoras
    - Tabela de frete por região
    - Frete fixo por banca
    - Retirada no local

---

### 2. **FORMAS DE PAGAMENTO**
#### Elementos Gerenciáveis:

- ❌ **Métodos de Pagamento** - Admin Geral + Jornaleiro
  - Status: ❌ NÃO IMPLEMENTADO
  - Necessário:
    - Admin: Integração com gateways (Mercado Pago, Stripe, PagSeguro)
    - Jornaleiro: Ativar/Desativar métodos aceitos
    - PIX, Cartão, Boleto, Dinheiro (retirada)

---

## 👤 PAINEL DO JORNALEIRO

### 1. **DASHBOARD**
#### Elementos Existentes:

- ⚠️ **Dashboard** - Jornaleiro
  - Status: ⚠️ PARCIAL (`/jornaleiro/dashboard`)
  - Necessário: Melhorar métricas e gráficos
  - Métricas Necessárias:
    - Vendas do dia/semana/mês
    - Produtos mais vendidos
    - Ticket médio
    - Taxa de conversão
    - Pedidos pendentes
    - Estoque baixo
    - Avaliação média
    - Novos clientes

---

### 2. **GESTÃO DE PEDIDOS**
#### Elementos Gerenciáveis:

- ✅ **Pedidos** - Jornaleiro
  - Status: ✅ IMPLEMENTADO (`/jornaleiro/pedidos`)
  - Permite: Visualizar, atualizar status, imprimir comprovante

- ❌ **Notificações de Pedidos** - Sistema
  - Status: ❌ NÃO IMPLEMENTADO
  - Necessário:
    - Notificação push para novo pedido
    - Notificação WhatsApp
    - Email de confirmação
    - SMS (opcional)

---

### 3. **GESTÃO DE PRODUTOS**
#### Elementos Gerenciáveis:

- ✅ **Produtos** - Jornaleiro
  - Status: ✅ IMPLEMENTADO (`/jornaleiro/produtos`)
  
- ❌ **Importação em Massa** - Jornaleiro
  - Status: ❌ NÃO IMPLEMENTADO
  - Necessário:
    - Upload CSV/Excel
    - Template de importação
    - Validação de dados
    - Preview antes de importar

---

### 4. **GESTÃO DE ESTOQUE**
#### Elementos Gerenciáveis:

- ⚠️ **Controle de Estoque** - Jornaleiro
  - Status: ⚠️ PARCIAL (campo existe mas sem alertas)
  - Necessário:
    - Alertas de estoque baixo
    - Histórico de movimentações
    - Ajuste manual de estoque
    - Produtos esgotados automaticamente

---

### 5. **RELATÓRIOS**
#### Elementos Gerenciáveis:

- ⚠️ **Relatórios** - Jornaleiro
  - Status: ⚠️ PARCIAL (`/jornaleiro/relatorios`)
  - Necessário: Expandir relatórios
  - Tipos de Relatórios:
    - Vendas por período
    - Produtos mais vendidos
    - Clientes recorrentes
    - Faturamento
    - Comissões (se aplicável)
    - Exportação PDF/Excel

---

### 6. **CONFIGURAÇÕES DA BANCA**
#### Elementos Gerenciáveis:

- ⚠️ **Configurações** - Jornaleiro
  - Status: ⚠️ PARCIAL (`/jornaleiro/configuracoes`)
  - Campos Necessários:
    - ✅ WhatsApp (existe)
    - ❌ Horário de Funcionamento
    - ❌ Dias de Funcionamento
    - ❌ Tempo de Preparo Médio
    - ❌ Raio de Entrega
    - ❌ Taxa de Entrega
    - ❌ Valor Mínimo do Pedido
    - ❌ Mensagem de Boas-Vindas
    - ❌ Política de Troca/Devolução

---

## 🔧 PAINEL DO ADMIN GERAL

### 1. **DASHBOARD ADMIN**
#### Elementos Necessários:

- ⚠️ **Dashboard** - Admin
  - Status: ⚠️ PARCIAL (`/admin/dashboard`)
  - Necessário: Métricas da plataforma
  - Métricas:
    - Total de bancas ativas
    - Total de produtos
    - Total de pedidos
    - Faturamento total
    - Comissão da plataforma
    - Novos cadastros
    - Bancas mais vendedoras
    - Produtos mais vendidos globalmente
    - Usuários ativos

---

### 2. **GESTÃO DE BANCAS**
#### Elementos Gerenciáveis:

- ⚠️ **Bancas** - Admin
  - Status: ⚠️ PARCIAL (`/admin/bancas`)
  - Necessário:
    - Aprovar/Reprovar cadastros
    - Suspender bancas
    - Editar informações
    - Ver estatísticas por banca
    - Comissões por banca

---

### 3. **GESTÃO DE USUÁRIOS**
#### Elementos Gerenciáveis:

- ❌ **Usuários** - Admin
  - Status: ❌ NÃO IMPLEMENTADO
  - Necessário:
    - CRUD de usuários
    - Perfis: Admin, Jornaleiro, Cliente
    - Permissões
    - Suspender/Ativar contas
    - Histórico de atividades

---

### 4. **GESTÃO DE CATEGORIAS**
#### Elementos Gerenciáveis:

- ✅ **Categorias** - Admin
  - Status: ✅ IMPLEMENTADO (`/admin/categories`)

---

### 5. **GESTÃO DE PEDIDOS GLOBAL**
#### Elementos Gerenciáveis:

- ⚠️ **Pedidos** - Admin
  - Status: ⚠️ PARCIAL (`/admin/orders`)
  - Necessário:
    - Ver todos os pedidos da plataforma
    - Filtros avançados
    - Resolver disputas
    - Cancelamentos
    - Reembolsos

---

### 6. **CMS (Gerenciamento de Conteúdo)**
#### Elementos Gerenciáveis:

- ✅ **Branding** - Admin
  - Status: ✅ IMPLEMENTADO (`/admin/cms/branding`)

- ⚠️ **Home** - Admin
  - Status: ⚠️ PARCIAL (`/admin/cms/home`)
  - Implementado: Slides do banner
  - Faltando: Todas as outras seções da home

- ❌ **Páginas Estáticas** - Admin
  - Status: ❌ NÃO IMPLEMENTADO
  - Necessário:
    - Sobre Nós
    - Termos de Uso
    - Política de Privacidade
    - FAQ
    - Como Funciona
    - Contato

---

### 7. **CONFIGURAÇÕES DA PLATAFORMA**
#### Elementos Gerenciáveis:

- ❌ **Configurações Gerais** - Admin
  - Status: ❌ NÃO IMPLEMENTADO
  - Necessário:
    - Nome da plataforma
    - Email de contato
    - Telefone
    - Endereço
    - Redes sociais
    - SEO (meta tags globais)
    - Google Analytics
    - Facebook Pixel
    - Scripts personalizados

- ⚠️ **WhatsApp** - Admin
  - Status: ⚠️ PARCIAL (`/admin/configuracoes/whatsapp`)
  - Integração Evolution API existe

- ❌ **Email** - Admin
  - Status: ❌ NÃO IMPLEMENTADO
  - Necessário:
    - Configurar SMTP
    - Templates de email
    - Email de confirmação de pedido
    - Email de boas-vindas
    - Email de recuperação de senha

---

## 📊 RESUMO EXECUTIVO

### ✅ **IMPLEMENTADO (Funcionando)**
1. Branding (Logo, Cores) - Admin
2. Slides do Banner - Admin
3. Categorias - Admin
4. Produtos - Jornaleiro
5. Pedidos - Jornaleiro
6. Cupons - Jornaleiro (básico)

### ⚠️ **PARCIALMENTE IMPLEMENTADO (Precisa Melhorias)**
1. Dados da Banca - Jornaleiro (faltam campos)
2. Dashboard - Admin e Jornaleiro (faltam métricas)
3. Relatórios - Jornaleiro (básico)
4. Configurações - Jornaleiro (incompleto)
5. Gestão de Bancas - Admin (básico)
6. Gestão de Pedidos - Admin (básico)

### ❌ **NÃO IMPLEMENTADO (Precisa Desenvolver)**
1. Menu/Mega Menu Dinâmico - Admin
2. Trust Badges - Admin
3. Banners Publicitários - Admin
4. Mini Banners - Admin
5. Sistema de Reviews - Cliente + Moderação
6. Produtos em Destaque/Trending - Admin
7. Newsletter - Admin
8. Footer Dinâmico - Admin
9. Sistema de Autenticação Completo
10. Gestão de Usuários - Admin
11. Formas de Pagamento - Admin + Jornaleiro
12. Cálculo de Frete - Jornaleiro
13. Páginas Estáticas (CMS) - Admin
14. Configurações da Plataforma - Admin
15. Sistema de Email - Admin
16. Importação em Massa - Jornaleiro
17. Controle de Estoque Avançado - Jornaleiro
18. Notificações de Pedidos - Sistema
19. Chat/Mensagens - Sistema

---

## 🎯 PRIORIDADES SUGERIDAS

### **ALTA PRIORIDADE (Core do Negócio)**
1. ✅ Sistema de Autenticação e Permissões
2. ✅ Formas de Pagamento (Mercado Pago/PIX)
3. ✅ Cálculo de Frete
4. ✅ Notificações de Pedidos (WhatsApp/Push)
5. ✅ Dados Completos da Banca (Logo, Horário, etc.)

### **MÉDIA PRIORIDADE (Melhoria de Experiência)**
6. ✅ Sistema de Reviews
7. ✅ Menu/Mega Menu Dinâmico
8. ✅ Banners e Mini Banners Gerenciáveis
9. ✅ Dashboard com Métricas Completas
10. ✅ Gestão de Usuários

### **BAIXA PRIORIDADE (Nice to Have)**
11. ✅ Newsletter
12. ✅ Chat/Mensagens
13. ✅ Importação em Massa
14. ✅ Páginas Estáticas (CMS)
15. ✅ Footer Dinâmico

---

## 📝 NOTAS FINAIS

Este checklist serve como roadmap para desenvolvimento. Cada item marcado como ❌ ou ⚠️ representa uma oportunidade de melhoria e desenvolvimento de novas funcionalidades.

**Próximos Passos:**
1. Priorizar itens com a equipe
2. Criar tasks/issues para cada funcionalidade
3. Estimar tempo de desenvolvimento
4. Implementar incrementalmente
5. Testar e validar com usuários

**Última Atualização:** 30/09/2025
**Versão:** 1.0
