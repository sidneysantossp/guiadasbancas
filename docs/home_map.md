# Mapeamento da Home — Guia das Bancas

Este documento descreve todas as sessões e recursos presentes na página inicial, seus componentes, dados necessários, opções de configuração e pontos de integração para o futuro Painel Admin.

Última atualização: 2025-09-22

---

## Índice
- [Hero / FullBanner](#hero--fullbanner)
- [MiniCategoryBar (Sticky)](#minicategorybar-sticky)
- [CategoryCarousel](#categorycarousel)
- [Produtos mais buscados (grid de mini cards)](#produtos-mais-buscados-grid-de-mini-cards)
- [Ofertas Relâmpago (AdsHighlights)](#ofertas-relâmpago-adshighlights)
- [Produtos mais buscados — Trends (slider)](#produtos-mais-buscados--trends-slider)
- [Mini Banners](#mini-banners)
- [Recomendados para você (FavoritePicks)](#recomendados-para-você-favoritepicks)
- [Bancas perto de você (FeaturedBancas)](#bancas-perto-de-você-featuredbancas)
- [Os mais bem Avaliados (TopReviewed)](#os-mais-bem-avaliados-topreviewed)
- [Bancas recém chegadas! (NewArrivals)](#bancas-recém-chegadas-newarrivals)
- [Newsletter](#newsletter)
- [Footer](#footer)
- [Recursos compartilhados](#recursos-compartilhados)

---

## Hero / FullBanner
- **Componente**: `components/FullBanner.tsx`
- **Função**: Destaque principal (campanhas, call-to-action).
- **Dados**:
  - Imagem/arte principal
  - Título + subtítulo (opcional)
  - CTA (rótulo + link)
- **Configurações (Admin)**:
  - Agendamento de campanha (início/fim)
  - Alvo do CTA (rota interna/URL externa)
  - Responsividade de imagem (breakpoints)

## MiniCategoryBar (Sticky)
- **Componente**: `components/MiniCategoryBar.tsx`
- **Função**: Navegação rápida por categorias, aparece ao rolar.
- **Dados**:
  - Lista de categorias (nome, ícone, slug)
- **Configurações (Admin)**:
  - Ordem e destaque de categorias
  - Exibir/ocultar em mobile/desktop

## CategoryCarousel
- **Componente**: `components/CategoryCarousel.tsx`
- **Função**: Carrossel de departamentos/categorias.
- **Dados**:
  - Categoria (nome, imagem/ícone, slug)
- **Configurações (Admin)**:
  - Itens por visualização (mobile/tablet/desktop)
  - Ordem e pin de categorias

## Produtos mais buscados (grid de mini cards)
- **Componente**: `components/MostSearchedProducts.tsx`
- **Função**: Grid 2 linhas (4 colunas desktop) de produtos populares.
- **Dados**:
  - Produto (id, nome, preço, imagem, vendedor/loja, descrição)
- **Configurações (Admin)**:
  - Quantidade total (padrão 8)
  - Ordenação (mais vendidos, mais pesquisados, manual)
  - Exibir botões (Comprar / WhatsApp)

## Ofertas Relâmpago (AdsHighlights)
- **Componente**: `components/AdsHighlights.tsx`
- **Função**: Carrossel publicitário de anunciantes (3/2/1 por view), com fundo ilustrativo.
- **Dados**:
  - Anúncio: título, subtítulo, imagem, CTA (rótulo/opcional), rating e reviews, `vendorId`, `vendorName`, `vendorAvatar`
- **Configurações (Admin)**:
  - Ativar/desativar fundo imagem
  - Intervalo do autoplay
  - Inserção/edição de cards patrocinados

## Produtos mais buscados — Trends (slider)
- **Componente**: `components/TrendingProducts.tsx`
- **Função**: Carrossel de produtos (4/2/1 por view) com ícone de fogo no título.
- **Dados**:
  - Produto: id, nome, imagem, preço atual/antigo, discountLabel
- **Ações**: Adicionar ao carrinho, Comprar pelo WhatsApp, Badge “Pronta Entrega”.
- **Configurações (Admin)**:
  - Intervalo do autoplay
  - Exibir badge “Pronta Entrega” e texto do badge
  - Habilitar/ocultar botões de ação

## Mini Banners
- **Componente**: `components/MiniBanners.tsx`
- **Função**: Slider de mini banners (3/2/1 por view) com tamanho fixo.
- **Dados**:
  - Lista de imagens (URLs)
- **Configurações (Admin)**:
  - Tamanho (largura/altura)
  - AutoPlay e velocidade
  - Links de destino por banner (opcional)

## Recomendados para você (FavoritePicks)
- **Componente**: `components/FavoritePicks.tsx`
- **Função**: Grade 2x3 de cards horizontais com 3 ícones alinhados verticalmente (favoritar, visualizar, carrinho).
- **Dados**:
  - Produto (id, título — padronizado “Produto da Banca”), vendedor, imagem, preço, preço antigo, disponível, desconto, rating/reviews
- **Configurações (Admin)**:
  - Quantidade de itens (padrão 6)
  - Ativar coluna de ações e estilo de ícones

## Bancas perto de você (FeaturedBancas)
- **Componente**: `components/FeaturedBancas.tsx`
- **Função**: Carrossel de bancas com badge de distância (clamped) e miniaturas dos produtos/categorias.
- **Dados**:
  - Banca: id, nome, endereço, lat/lng, capa, rating, categorias (nome + ícone), distância calculada
- **Configurações (Admin)**:
  - Itens por view (1/2/4)
  - Mostrar miniaturas (quantidade)
  - Mostrar badges de categorias e endereço com ícone

## Os mais bem Avaliados (TopReviewed)
- **Componente**: `components/TopReviewed.tsx`
- **Função**: Slider rotativo com tile promocional (primeiro slide) + cards de produtos com padding de imagem, badge “Pronta Entrega”, avaliações, botões.
- **Dados**:
  - Produto: id, título, vendedor, imagem, preço atual/antigo, rating/reviews, disponível, discountLabel
  - Card Promocional: imagem, título (2 linhas), descrição (2 linhas), CTA
- **Configurações (Admin)**:
  - Intervalo do autoplay
  - Conteúdo do card promocional (título, descrição, botão, imagem)
  - Exibir "Pronta Entrega" e ícone

## Bancas recém chegadas! (NewArrivals)
- **Componente**: `components/NewArrivals.tsx`
- **Função**: Slider de “novas bancas”, cards com imagem (padding), avatar, nome e chips (taxa, distância, itens).
- **Dados**:
  - Banca: id, nome, cover, avatar, feeLabel, distanceLabel, itemsLabel
- **Configurações (Admin)**:
  - Itens por view (3/2/1)
  - Cores dos chips e ícones

## Newsletter
- **Componente**: `components/Newsletter.tsx`
- **Função**: Seção de inscrição por e-mail com CTA.
- **Dados**:
  - Texto do título e descrição, layout de fundo
- **Integração (Admin)**:
  - Endpoint do serviço (Mailchimp/Sendgrid/API própria)
  - Consentimento (LGPD) e textos legais

## Footer
- **Componente**: `components/AppFooter.tsx`
- **Função**: Rodapé robusto (tema escuro) com logo, descrição, redes sociais, colunas de links e barra inferior.
- **Dados**:
  - Links (Internos/Externos), Redes sociais
- **Configurações (Admin)**:
  - Edição de colunas (títulos, itens)
  - Ícones de pagamentos/selos (opcional)

---

## Recursos compartilhados
- **Cálculo de Distância**: `components/DistanceBadge.tsx` (badge com clamping 1–3 km).
- **APIs/DB**:
  - Bancas: `app/api/bancas/route.ts` (GET/POST) e utilitários `lib/db.ts`, `lib/location.ts`.
- **Imagens Externas**: `next.config.js` com domínios permitidos (Unsplash, etc.).
- **Estilo/Utilitários**: Tailwind CSS (spacing, line-clamp, grid, flex, rounded, shadow, cores).

---

## Sugestão de Modelagem (Admin)
- **Seções (HomeSections)**
  - id, key (ex.: `hero`, `ads_highlights`), título, ordem, status (on/off)
- **Banners/Promos**
  - id, imagem, título, descrição, CTA (rótulo/link), período, prioridade
- **Categorias**
  - id, nome, slug, ícone, ordem, destaque (bool)
- **Bancas**
  - id, nome, avatar, capa, endereço, lat/lng, taxa, distância (calc), itens/portfólio, rating
- **Produtos**
  - id, nome, preço, preço antigo, imagem, vendedor (bancaId), prontoEntrega (bool), descontoLabel, rating/reviews
- **Conteúdos Fixos**
  - Footer (colunas/links), Newsletter (textos, endpoint), cores de tema

---

## Checklist de Integração (Admin)
- **[ ]** CRUD de Banners e Promos (Hero/Promo-Card/Ads)
- **[ ]** CRUD de Categorias (ordem, destaque, ícones)
- **[ ]** CRUD de Bancas (dados visuais, geolocalização, métricas)
- **[ ]** CRUD de Produtos (variações, rótulos, disponibilidade)
- **[ ]** Configuração de Seções (on/off, ordenação, quantidade e layout)
- **[ ]** Newsletter (endpoint + textos + LGPD)
- **[ ]** Footer (colunas, redes, políticas)

---

## Observações
- Sliders utilizam autoplay e duplicação de itens para loop infinito. Parâmetros de velocidade e perView são configuráveis por sessão.
- Imagens com `object-cover` e cantos arredondados são padrão para consistência.
- Botões de ação seguem paleta laranja (gradiente ou borda) para reforçar identidade visual.
