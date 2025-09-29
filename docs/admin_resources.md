# Admin Resources and Integration Map

This document maps the Admin resources (Banca, Produtos, Categorias, Pedidos), their data models, relationships, workflows, APIs, RBAC, and front-end integration points.

## Domain Overview
- Banca 1—N Produtos
- Produto N—1 Categoria (uma categoria por produto)
- Banca 1—N Pedidos; Pedido 1—N Itens (cada item referencia produto e congela preço)

---

## Banca

- Campos
  - id (uuid)
  - name, slug (único)
  - description (rich text)
  - phone_whatsapp, email, cnpj/cpf (opcional)
  - social_links: instagram, facebook, tiktok, site
  - cover_url, avatar_url, gallery[]
  - address_text
  - address_obj { street, number, complement, district, city, state, country, zipcode }
  - geo: { lat, lng }
  - hours: [{ dayOfWeek (0-6), openAt, closeAt, breaks[] }]
  - payments: [pix, dinheiro, cartao, credito_online, debito_online]
  - delivery_options: [retirada, entrega_local, parceiro]
  - min_order_value (decimal)
  - delivery_fee_policy: { free_threshold, fee_base, fee_per_km }
  - categories_enabled[] (ids de categorias)
  - featured (bool)
  - status: ativo | pausado | em_aprovacao
  - meta_title, meta_description
  - created_at, updated_at, created_by, updated_by

- Validações
  - name obrigatório; slug único
  - phone_whatsapp normalizado (somente dígitos)
  - hours coerentes (openAt < closeAt)

- Filtros (Admin)
  - status, cidade/UF, featured, data criação, nome

- Integração Front
  - `components/BancaPageClient.tsx`: usa cover, avatar, description, phone, hours, categories_enabled, payments, gallery

---

## Categorias

- Campos
  - id (uuid)
  - name, slug (único)
  - description (opcional)
  - image_url (para home)
  - order (int), active (bool)
  - meta_title, meta_description
  - created_at, updated_at, created_by, updated_by

- Validações
  - name obrigatório; slug único; order >= 0

- Filtros (Admin)
  - active, order, nome

- Integração Front
  - Tabs/Chips de categorias em `BancaPageClient.tsx` e homepage

---

## Produtos

- Campos
  - id (uuid), banca_id (FK), category_id (FK)
  - name, slug, sku (opcional), barcode (opcional)
  - description (rich text curto)
  - images[] (1..N; images[0] é principal)
  - price (decimal), price_original (decimal opcional), discount_percent (derivado ou manual)
  - stock_qty (int >= 0), track_stock (bool)
  - active (bool), visibility: publico | nao_listado | rascunho
  - badges: ready_to_ship (bool), destaque (bool)
  - rating_avg (0..5), reviews_count (int)
  - created_at, updated_at, created_by, updated_by

- Regras
  - price_original >= price (se informado)
  - discount_percent = 100 * (1 - price/price_original) quando price_original > price

- Filtros (Admin)
  - por banca, categoria, status, estoque, preço, data

- Integração Front
  - `BancaPageClient.tsx`, `CategoryResultsClient.tsx`: name, image, price, price_original/discount_percent, ready_to_ship, rating_avg, reviews_count

---

## Pedidos

- Campos
  - id (uuid), banca_id (FK)
  - customer: { name, phone_whatsapp, email }
  - shipping_address (quando aplicável)
  - items[]: { product_id, name_snapshot, price_snapshot, qty, image_snapshot, weight? }
  - subtotal, discount_amount, shipping_fee, total
  - payment_method: pix | dinheiro | cartao | online
  - payment_status: pendente | aprovado | cancelado | reembolsado
  - delivery_method: retirada | entrega_local
  - delivery_eta, tracking_code (opcional)
  - status: novo | confirmado | em_preparo | saiu_para_entrega | entregue | cancelado
  - timeline[]: { status, at, note, by }
  - customer_note, internal_note
  - created_at, updated_at, created_by

- Validações
  - items não-vazios; qty >= 1
  - total = subtotal - desconto + frete

- Filtros (Admin)
  - status, período, método pagamento, banca, faixa de valor

- Integração Front
  - Hoje via WhatsApp. Futuro: checkout interno com POST /api/pedidos

---

## APIs (REST Sugerido)

- Autenticação
  - POST /api/auth/login { email, password }
  - Tokens JWT com roles (RBAC)

- Bancas
  - GET /api/bancas?search=&city=&state=&status=
  - GET /api/bancas/:id
  - POST /api/bancas
  - PATCH /api/bancas/:id
  - DELETE /api/bancas/:id

- Categorias
  - GET /api/categories?active=true
  - GET /api/categories/:id
  - POST /api/categories
  - PATCH /api/categories/:id
  - DELETE /api/categories/:id

- Produtos
  - GET /api/bancas/:bancaId/produtos?category=&q=&page=&limit=
  - GET /api/produtos/:id
  - POST /api/produtos
  - PATCH /api/produtos/:id
  - DELETE /api/produtos/:id

- Pedidos
  - GET /api/pedidos?bancaId=&status=&from=&to=&page=&limit=
  - GET /api/pedidos/:id
  - POST /api/pedidos
  - PATCH /api/pedidos/:id

- Uploads
  - POST /api/uploads (multipart) -> { url }

---

## Workflows

- Catálogo
  - Produto criado como rascunho -> aprovado (público)
  - Estoque: se track_stock, decrementar em confirmacao de pagamento

- Pedidos
  - novo -> confirmado -> em_preparo -> saiu_para_entrega -> entregue | cancelado
  - Notificações: WhatsApp, e-mail, webhooks (opcional)

---

## RBAC e Segurança

- Papel: superadmin, admin, operador_banca
- Escopo operador_banca: apenas recursos da própria banca
- Auditoria: logs por recurso (quem, quando, o quê)
- Rate limit em endpoints públicos (GET)
- Sanitização e validação de uploads

---

## Integração com o Front

- `components/BancaPageClient.tsx`
  - Substituir mocks por:
    - GET /api/bancas/:id (dados da banca)
    - GET /api/bancas/:id/produtos?category=&page=&limit=30 (lista paginada)
  - Botão “Comprar” usa `phone_whatsapp`

- `components/CategoryResultsClient.tsx`
  - GET /api/categories (tabs)
  - GET /api/produtos?category=... (lista)

- `data/categories.json`
  - Migrar para GET /api/categories (ativos ordenados)

---

## Campos Derivados e Boas Práticas

- Slugs: gerar no backend e validar unicidade
- discount_percent: calcular se não enviado
- Normalização de telefone (DDI/DDD) para `wa.me`
- Paginação padrão: `page`, `limit` (10/20/30)
- Ordenação: `sort=field:asc|desc`

---

## Próximos Passos

- Implementar rotas de API e modelos
- Criar telas no Admin para CRUD dos 4 recursos
- Ligar front às APIs e remover fontes mock
- Configurar uploads e CDN
- Definir templates de notificação (WhatsApp/e-mail)

---

## Painéis e Credenciais (Dev)

- **Admin geral**: `http://localhost:3000/admin`
- **Painel do jornaleiro**: `http://localhost:3000/jornaleiro`
- **Credenciais demo jornaleiro**
  - Email: `demo@jornaleiro.com`
  - Senha: `123456`

### Rotas atuais do painel do jornaleiro

- **Dashboard**: `/jornaleiro/dashboard`
  - KPIs (pedidos hoje, faturamento, etc.) via `/api/orders` e `/api/products`
- **Pedidos**: `/jornaleiro/pedidos`
  - Filtros + ação "Avançar status" usando `PATCH /api/orders`
- **Produtos**: `/jornaleiro/produtos`
  - Filtros por categoria/status; ativa/desativa com `PATCH /api/products/:id`
  - Criar: `/jornaleiro/produtos/create` (`POST /api/products` + upload mock)
  - Editar: `/jornaleiro/produtos/[id]` (`GET/PATCH /api/products/:id`)
- **Minha Banca**: `/jornaleiro/banca`
  - Formulário completo para dados gerais, contatos/redes, endereço, horários, pagamentos, categorias e galeria.
  - Persiste em `PUT /api/jornaleiro/banca` (token mock `seller-token`) e reflete na vitrine pública.

---

## Endpoints Mock utilizados

| Recurso | Método | Caminho | Descrição |
| --- | --- | --- | --- |
| Minha Banca | GET | `/api/jornaleiro/banca` | Retorna dados da banca do jornaleiro autenticado (token `seller-token`) |
| Minha Banca | PUT | `/api/jornaleiro/banca` | Atualiza dados gerais, contato, endereço, horários, pagamentos, categorias e galeria |
| Produtos | GET | `/api/products` | Lista com filtros `q`, `category`, `active` |
| Produtos | POST | `/api/products` | Cria produto (mock) |
| Produtos | PATCH | `/api/products/:id` | Atualiza campos do produto |
| Produtos | GET | `/api/products/:id` | Retorna produto pelo id |
| Produtos | DELETE | `/api/products/:id` | Remove produto (mock) |
| Pedidos | GET | `/api/orders` | Lista pedidos filtrando por status/q |
| Pedidos | PATCH | `/api/orders` | Atualiza status do pedido |
| Categorias (público) | GET | `/api/categories` | Lista categorias ativas do `data/categories.json` |
| Upload | POST | `/api/upload` | Mock de upload, retorna URL em `/uploads/...` |

> **Nota**: o store de produtos é compartilhado entre `/api/products` e `/api/products/[id]` via `globalThis.__PRODUCTS_STORE__`, permitindo testes consistentes do CRUD mock.
