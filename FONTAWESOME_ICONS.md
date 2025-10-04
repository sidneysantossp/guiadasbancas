# 🎨 Guia de Ícones Font Awesome (Estilo Minimalista)

**Pacote:** `@fortawesome/fontawesome-free@6.5.1`  
**Estilo:** Regular/Outline (minimalista)

---

## 📦 Produtos & Estoque

```html
<!-- Produto -->
<i className="fa-regular fa-box"></i>
<i className="fa-regular fa-boxes-stacked"></i>

<!-- Estoque -->
<i className="fa-regular fa-warehouse"></i>
<i className="fa-regular fa-cubes"></i>

<!-- Preço/Dinheiro -->
<i className="fa-regular fa-dollar-sign"></i>
<i className="fa-regular fa-tag"></i>
<i className="fa-regular fa-tags"></i>
<i className="fa-regular fa-receipt"></i>

<!-- Carrinho -->
<i className="fa-regular fa-cart-shopping"></i>
<i className="fa-regular fa-cart-plus"></i>
```

---

## 🏪 Banca & Loja

```html
<!-- Banca/Loja -->
<i className="fa-regular fa-store"></i>
<i className="fa-regular fa-shop"></i>

<!-- Ofertas/Promoções -->
<i className="fa-regular fa-star"></i>
<i className="fa-regular fa-fire"></i>
<i className="fa-regular fa-badge-percent"></i>

<!-- Entrega -->
<i className="fa-regular fa-truck"></i>
<i className="fa-regular fa-truck-fast"></i>
<i className="fa-regular fa-box-open"></i>
```

---

## ✅ Status & Ações

```html
<!-- Sucesso -->
<i className="fa-regular fa-circle-check"></i>
<i className="fa-regular fa-check"></i>

<!-- Erro -->
<i className="fa-regular fa-circle-xmark"></i>
<i className="fa-regular fa-xmark"></i>

<!-- Aviso -->
<i className="fa-regular fa-circle-exclamation"></i>
<i className="fa-regular fa-triangle-exclamation"></i>

<!-- Info -->
<i className="fa-regular fa-circle-info"></i>
<i className="fa-regular fa-info"></i>

<!-- Editar -->
<i className="fa-regular fa-pen"></i>
<i className="fa-regular fa-pen-to-square"></i>

<!-- Deletar -->
<i className="fa-regular fa-trash"></i>
<i className="fa-regular fa-trash-can"></i>

<!-- Configurações -->
<i className="fa-regular fa-gear"></i>
<i className="fa-regular fa-sliders"></i>
```

---

## 👤 Usuário & Navegação

```html
<!-- Usuário -->
<i className="fa-regular fa-user"></i>
<i className="fa-regular fa-circle-user"></i>

<!-- Login/Logout -->
<i className="fa-regular fa-right-to-bracket"></i>
<i className="fa-regular fa-right-from-bracket"></i>

<!-- Menu -->
<i className="fa-regular fa-bars"></i>
<i className="fa-regular fa-ellipsis-vertical"></i>

<!-- Busca -->
<i className="fa-regular fa-magnifying-glass"></i>

<!-- Home -->
<i className="fa-regular fa-house"></i>
```

---

## 📊 Admin & Dashboard

```html
<!-- Dashboard -->
<i className="fa-regular fa-chart-line"></i>
<i className="fa-regular fa-chart-bar"></i>

<!-- Pedidos -->
<i className="fa-regular fa-clipboard-list"></i>
<i className="fa-regular fa-list-check"></i>

<!-- Relatórios -->
<i className="fa-regular fa-file-chart-column"></i>
<i className="fa-regular fa-chart-pie"></i>

<!-- Configurações -->
<i className="fa-regular fa-screwdriver-wrench"></i>
```

---

## 🔔 Notificações & Comunicação

```html
<!-- Notificação -->
<i className="fa-regular fa-bell"></i>

<!-- Email -->
<i className="fa-regular fa-envelope"></i>

<!-- WhatsApp -->
<i className="fa-brands fa-whatsapp"></i>

<!-- Telefone -->
<i className="fa-regular fa-phone"></i>

<!-- Mensagem -->
<i className="fa-regular fa-message"></i>
<i className="fa-regular fa-comment"></i>
```

---

## 📅 Data & Tempo

```html
<!-- Calendário -->
<i className="fa-regular fa-calendar"></i>
<i className="fa-regular fa-calendar-days"></i>

<!-- Relógio -->
<i className="fa-regular fa-clock"></i>

<!-- Histórico -->
<i className="fa-regular fa-clock-rotate-left"></i>
```

---

## 🎯 Ações Específicas

```html
<!-- Favorito/Like -->
<i className="fa-regular fa-heart"></i>

<!-- Compartilhar -->
<i className="fa-regular fa-share-nodes"></i>

<!-- Download -->
<i className="fa-regular fa-arrow-down-to-line"></i>

<!-- Upload -->
<i className="fa-regular fa-arrow-up-from-line"></i>

<!-- Imprimir -->
<i className="fa-regular fa-print"></i>

<!-- Filtro -->
<i className="fa-regular fa-filter"></i>
```

---

## 🔐 Segurança

```html
<!-- Bloqueado -->
<i className="fa-regular fa-lock"></i>

<!-- Desbloqueado -->
<i className="fa-regular fa-lock-open"></i>

<!-- Olho (mostrar/ocultar) -->
<i className="fa-regular fa-eye"></i>
<i className="fa-regular fa-eye-slash"></i>
```

---

## 📍 Localização

```html
<!-- Localização -->
<i className="fa-regular fa-location-dot"></i>
<i className="fa-regular fa-map-pin"></i>

<!-- Mapa -->
<i className="fa-regular fa-map"></i>
```

---

## 🎨 Exemplos de Uso

### Toast Notifications
```tsx
<div className="flex items-center gap-3">
  <i className="fa-regular fa-circle-check text-lg"></i>
  <span>Produto salvo com sucesso!</span>
</div>
```

### Botões
```tsx
<button className="flex items-center gap-2">
  <i className="fa-regular fa-plus"></i>
  <span>Adicionar Produto</span>
</button>
```

### Cards
```tsx
<div className="flex items-center gap-2">
  <i className="fa-regular fa-box text-gray-500"></i>
  <h3>Meus Produtos</h3>
</div>
```

### Status Badges
```tsx
<span className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded">
  <i className="fa-regular fa-circle-check text-xs"></i>
  <span className="text-xs">Disponível</span>
</span>
```

---

## 🎨 Cores Personalizadas

```tsx
{/* Verde - Sucesso */}
<i className="fa-regular fa-check text-green-500"></i>

{/* Vermelho - Erro */}
<i className="fa-regular fa-xmark text-red-500"></i>

{/* Amarelo - Aviso */}
<i className="fa-regular fa-triangle-exclamation text-yellow-500"></i>

{/* Azul - Info */}
<i className="fa-regular fa-circle-info text-blue-500"></i>

{/* Laranja - Estrela/Destaque */}
<i className="fa-regular fa-star text-orange-500"></i>
```

---

## 💡 Dicas

### Quando usar `fa-regular` vs `fa-solid`:

- ✅ **fa-regular** (padrão): Ícones minimalistas, outline
- ⚠️ **fa-solid**: Use apenas para destaques ou quando necessário peso visual
- 🎨 **fa-brands**: Para logos de marcas (WhatsApp, Facebook, etc.)

### Tamanhos:
```tsx
<i className="fa-regular fa-star text-xs"></i>   {/* Extra pequeno */}
<i className="fa-regular fa-star text-sm"></i>   {/* Pequeno */}
<i className="fa-regular fa-star text-base"></i> {/* Normal */}
<i className="fa-regular fa-star text-lg"></i>   {/* Grande */}
<i className="fa-regular fa-star text-xl"></i>   {/* Extra grande */}
<i className="fa-regular fa-star text-2xl"></i>  {/* 2x */}
```

---

## 📚 Referências

- **Documentação:** https://fontawesome.com/docs
- **Buscar Ícones:** https://fontawesome.com/search?o=r&m=free (Regular/Free)
- **Versão:** Font Awesome 6.5.1 (Free)
- **Pacote NPM:** `@fortawesome/fontawesome-free`

---

**Atualizado:** 04/10/2025  
**Estilo:** Minimalista (Regular/Outline)
