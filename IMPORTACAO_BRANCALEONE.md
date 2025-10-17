# 📋 Guia de Importação - Produtos Brancaleone

## 🎯 Objetivo
Importar todos os produtos do catálogo Brancaleone Publicações para o banco de dados do Guia das Bancas.

**Catálogo:** https://brancaleonepublicacoes.meuspedidos.com.br/

---

## 📊 3 Opções de Importação

### ✅ OPÇÃO 1: Web Scraping Automatizado (Node.js + Puppeteer)

**Vantagens:**
- ✅ Totalmente automatizado
- ✅ Extrai TODOS os dados (imagens, títulos, preços, códigos)
- ✅ Gera arquivos JSON e CSV prontos
- ✅ Rápido (minutos)

**Como executar:**

```bash
# 1. Instalar dependências
npm install puppeteer

# 2. Executar script
node scripts/scrape-brancaleone.js

# 3. Arquivos gerados:
# - brancaleone-products.json
# - brancaleone-products.csv
```

**Arquivo:** `/scripts/scrape-brancaleone.js`

---

### ✅ OPÇÃO 2: Extração via Console do Navegador (Mais Fácil)

**Vantagens:**
- ✅ Não precisa instalar nada
- ✅ Funciona em qualquer navegador
- ✅ Download automático dos arquivos
- ✅ Ideal para testes rápidos

**Como executar:**

1. Abra: https://brancaleonepublicacoes.meuspedidos.com.br/
2. Pressione **F12** (DevTools)
3. Vá na aba **Console**
4. Cole o código do arquivo `/scripts/browser-scraper.js`
5. Pressione **Enter**
6. Aguarde a extração
7. Baixe os arquivos JSON e CSV gerados

**Arquivo:** `/scripts/browser-scraper.js`

---

### ✅ OPÇÃO 3: Solicitar Dados Diretamente (Mais Profissional)

**Vantagens:**
- ✅ Dados oficiais e completos
- ✅ Possível integração via API
- ✅ Atualização automática
- ✅ Suporte técnico

**Como fazer:**

**Email para Brancaleone:**

```
Assunto: Parceria - Integração de Catálogo de Produtos

Prezados,

Somos o Guia das Bancas (www.guiadasbancas.com.br), uma plataforma que conecta 
bancas de jornal a seus clientes.

Gostaríamos de integrar o catálogo de produtos da Brancaleone Publicações em 
nossa plataforma para facilitar pedidos das bancas.

Vocês poderiam nos fornecer:

1. Exportação do catálogo em CSV/Excel com:
   - Código do produto
   - Título
   - Descrição
   - Preço
   - URL da imagem
   - Categoria

2. Ou acesso à API Mercos para sincronização automática:
   - CompanyToken da Brancaleone
   - Documentação de integração

Ficamos à disposição para agendar uma reunião.

Atenciosamente,
[Seu Nome]
[Seu Contato]
Guia das Bancas
```

**Contatos Brancaleone:**
- Site: https://brancaleonepublicacoes.meuspedidos.com.br/
- Buscar email/telefone no site

---

## 📥 Importar Dados no Banco

Após obter o arquivo JSON ou CSV, use este script:

```bash
node scripts/import-products-to-db.js brancaleone-products.json
```

**Ou via SQL:**

```sql
-- Importar produtos da Brancaleone
INSERT INTO products (
  code,
  name,
  description,
  price,
  images,
  distribuidor_id,
  banca_id,
  active,
  created_at
)
SELECT
  code,
  title,
  description,
  CAST(REGEXP_REPLACE(price, '[^0-9,.]', '', 'g') AS DECIMAL(10,2)),
  ARRAY[image],
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  NULL, -- Produtos do distribuidor
  true,
  NOW()
FROM json_to_recordset('[COLE_O_JSON_AQUI]') AS x(
  code TEXT,
  title TEXT,
  description TEXT,
  price TEXT,
  image TEXT
);
```

---

## 🔄 Mapeamento de Campos

| Campo no Catálogo | Campo no Banco | Observação |
|-------------------|----------------|------------|
| `code` | `code` | Código/SKU do produto |
| `title` | `name` | Nome do produto |
| `description` | `description` | Descrição completa |
| `price` | `price` | Preço (converter para decimal) |
| `image` | `images[0]` | URL da imagem principal |
| - | `distribuidor_id` | ID da Brancaleone no sistema |
| - | `banca_id` | NULL (produto do distribuidor) |
| - | `active` | true |
| - | `stock` | 999 (estoque padrão) |

---

## ✅ Checklist de Importação

- [ ] Escolher método de extração (Opção 1, 2 ou 3)
- [ ] Executar extração e obter arquivo JSON/CSV
- [ ] Validar dados extraídos (preview)
- [ ] Criar distribuidor "Brancaleone Publicações" no admin
- [ ] Executar script de importação
- [ ] Verificar produtos no painel admin
- [ ] Testar exibição no frontend
- [ ] Configurar sincronização automática (se API disponível)

---

## 📞 Suporte

Se tiver dúvidas sobre a importação, consulte:
- `/scripts/scrape-brancaleone.js` - Script Puppeteer
- `/scripts/browser-scraper.js` - Script para console
- `/CONFIGURACAO_MERCOS.md` - Integração via API

---

**Última atualização:** 2025-10-17
