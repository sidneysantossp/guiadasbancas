# Fase 0 - Baseline e inventario de performance

## Snapshot
- Data: 2025-02-08
- Escopo: todas as paginas (publico, login, registro, jornaleiro, admin, distribuidor)

## Inventario de rotas
- Total de paginas: 127
- Admin: 54
- Jornaleiro: 36
- Distribuidor: 12
- Debug: 2
- Admin-demo: 1
- Publico: 22

Exemplos de rotas publicas:
- /
- /bancas
- /bancas-perto-de-mim
- /banca/[uf]/[slug]
- /buscar
- /categorias/[slug]
- /produto/[id]
- /entrar
- /registrar
- /checkout
- /minha-conta

## Footprint de CSR
- Arquivos com "use client": 209
  - app: 122
  - components: 82
  - hooks: 2
  - lib: 3
- layout raiz e client (forca CSR global): app/layout.tsx
- imports dinamicos com ssr: false: 17

Impacto:
- HTML inicial reduzido
- Hydration completa em quase todas as paginas
- Revalidate no client nao tem efeito real

## Perfil de fetch e cache
- Ocorrencias de fetch: 382
- Ocorrencias de cache "no-store": 117
- Ocorrencias de revalidate: 69

Arquivos com maior volume de fetch:
- app/distribuidor/configuracoes/markup/page.tsx (10)
- app/jornaleiro/banca-v2/page.tsx (9)
- app/admin/cms/categories/page.tsx (9)
- app/admin/distribuidores/[id]/sync/page.tsx (8)
- components/BancaPageClient.tsx (6)
- app/jornaleiro/produtos/[id]/page.tsx (6)
- app/admin/products/[id]/edit/page.tsx (6)
- components/ProductPageClient.tsx (5)
- app/checkout/page.tsx (5)
- app/admin/products/page.tsx (5)

Observacoes criticas:
- Fetch client com next: { revalidate } nao aplica cache
- Waterfall de chamadas em paginas de categoria/banca/produto
- Callbacks com limit=10000 em produtos (payload alto)
- Headers globais de cache em /api podem cachear endpoints sensiveis

## Gargalos imediatos (publico)
- Home: muitas secoes com ssr: false e fetch em client
- Categoria: fetch sequencial (categorias -> produtos -> bancas)
- Banca: carrega 100 + 10000 produtos no client
- Produto: multiplas chamadas em paralelo sem consolidacao
- Footer/Navbar: fetch no client em todas as rotas

## Riscos de seguranca (nao performance, mas critico)
- Service role do Supabase aparece em lib/supabase.ts (nao deve ir para client)

## Medicoes pendentes (baseline real)
- Lighthouse (home, buscar, produto, banca, login, registro)
- Web Vitals no ambiente real (LCP/FCP/TTFB/CLS)
- Bundle size e JS inicial por rota

## Proximos passos (Fase 1)
- Tornar layout raiz server e separar grupos de rotas
- Migrar home, login e registro para SSR/ISR
- Criar loaders de dados por pagina e remover fetch de useEffect
- Padronizar cache e remover no-store onde nao necessario
- Definir tokens visuais para manter layout
