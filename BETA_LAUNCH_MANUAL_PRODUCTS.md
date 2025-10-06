# 🚀 Guia de Cadastro Manual de Produtos para Beta Launch

## 📋 Visão Geral

Sistema completo para cadastrar produtos manualmente usando dados da Mercos, preparando a plataforma para o beta launch com 5 jornaleiros, garantindo que quando a integração real for homologada, os dados já estarão compatíveis e apenas preços/estoques serão atualizados.

---

## 🎯 Objetivo

Permitir cadastro manual de produtos com:
1. **Dados compatíveis com Mercos** (códigos, categorias, unidades)
2. **Disponibilização automática** para todas as bancas ou específica
3. **Upload de imagens em massa** vinculado por código
4. **Preparação para migração suave** quando API real for integrada

---

## 🔧 Estrutura Implementada

### 1. Banco de Dados

**Novos campos na tabela `products`:**
```sql
- codigo_mercos VARCHAR(50) UNIQUE  -- Ex: AKOTO001
- unidade_medida VARCHAR(10)        -- Ex: UN, CX, KG
- venda_multiplos DECIMAL(10,2)     -- Ex: 1.00, 2.00
- categoria_mercos VARCHAR(100)     -- Ex: Planet Manga
- disponivel_todas_bancas BOOLEAN   -- true = todas as bancas
```

**Executar no Supabase:**
```bash
database/add-codigo-mercos-products.sql
```

### 2. APIs Criadas

```
POST /api/admin/produtos/upload-imagens-massa
     - Upload múltiplas imagens
     - Vinculação automática por código Mercos
     - Relatório de sucesso/erros
```

### 3. Páginas Admin

```
/admin/products/create          - Cadastro com campos Mercos
/admin/produtos/upload-imagens  - Upload em massa de imagens
```

---

## 📝 Fluxo de Trabalho Completo

### PASSO 1: Preparar Dados dos Produtos

1. **Acessar plataforma Mercos** (sandbox ou produção)
2. **Exportar catálogo** ou coletar manualmente:
   - Código (Ex: AKOTO001)
   - Nome (Ex: 10 COISAS PARA FAZER ANTES DOS 40 - 01)
   - Preço de Tabela (Ex: R$ 40,90)
   - Unidade de Medida (Ex: UN)
   - Venda em Múltiplos (Ex: 1,00)
   - Categoria (Ex: Planet Manga)
   - Estoque (Ex: 1.327 UN)

3. **Baixar imagens da Mercos**
   - Renomear cada imagem com o código: `AKOTO001.jpg`
   - Organizar em uma pasta local
   - Manter o código EXATAMENTE como no cadastro

---

### PASSO 2: Cadastrar Produtos no Admin

1. **Acessar** `/admin/products/create`

2. **Preencher Dados Básicos:**
   - **Nome**: Exatamente como na Mercos
   - **Mini Descrição**: Breve descrição do produto
   - **Categoria**: Selecionar categoria do sistema
   - **Preço**: Valor atual do produto
   - **Estoque**: Quantidade disponível

3. **Preencher Dados Mercos:**
   - **Código Mercos**: `AKOTO001` (IMPORTANTE: em maiúsculas)
   - **Unidade**: Selecionar (UN, CX, KG, etc)
   - **Múltiplos**: Ex: 1.00
   - **Categoria Mercos**: Ex: "Planet Manga"

4. **Configurar Disponibilidade:**
   - ✅ **Todas as Bancas**: Produto aparece automaticamente para todas
   - 🎯 **Banca Específica**: Apenas uma banca terá acesso

5. **Configurar Disponibilidade Física:**
   - ✅ Pronta Entrega
   - 📋 Sob Encomenda  
   - 🔮 Pré-Venda

6. **Salvar Produto**

---

### PASSO 3: Upload de Imagens em Massa

1. **Acessar** `/admin/produtos/upload-imagens`

2. **Preparar Imagens:**
   - Renomear EXATAMENTE com o código:
     - `AKOTO001.jpg` → Produto com código AKOTO001
     - `ADBEM001.png` → Produto com código ADBEM001
     - `ACBKA004.webp` → Produto com código ACBKA004

3. **Upload:**
   - Arrastar todas as imagens para a área de drop
   - OU clicar para selecionar múltiplas
   - Revisar lista de arquivos
   - Clicar em "Fazer Upload"

4. **Resultado:**
   - ✅ **Sucesso**: Lista de produtos vinculados
   - ❌ **Erros**: Produtos não encontrados ou problemas no upload

---

## 🎯 Exemplo Prático

### Produto da Mercos

```
Código: AKOTO001
Nome: 10 COISAS PARA FAZER ANTES DOS 40 - 01
Unidade: UN
Múltiplos: 1,00
Categoria: Planet Manga
Preço: R$ 40,90
Estoque: 1.327 UN
```

### Cadastro no Sistema

1. **Formulário:**
   ```
   Nome: 10 COISAS PARA FAZER ANTES DOS 40 - 01
   Código Mercos: AKOTO001
   Unidade: UN
   Múltiplos: 1.00
   Categoria Mercos: Planet Manga
   Preço: 40.90
   Estoque: 1327
   Disponibilidade: Todas as Bancas ✅
   ```

2. **Imagem:**
   - Baixar imagem da Mercos
   - Renomear para: `AKOTO001.jpg`
   - Upload em massa

3. **Resultado:**
   - ✅ Produto cadastrado
   - ✅ Disponível em todas as bancas
   - ✅ Imagem vinculada automaticamente
   - ✅ Aparece no dashboard do jornaleiro
   - ✅ Aparece no perfil da banca no frontend

---

## 🔄 Migração Futura (Pós-Homologação)

Quando a API real da Mercos for homologada:

### O que será atualizado:
- ✅ **Preços** (se houver alteração)
- ✅ **Estoques** (quantidades atualizadas)
- ✅ **Status** (ativo/inativo)

### O que será mantido:
- ✅ **Código Mercos** (mesmo código)
- ✅ **Nome** (nomenclatura idêntica)
- ✅ **Categoria Mercos** (mesma categoria)
- ✅ **Imagens** (já vinculadas pelo código)
- ✅ **URL e Slug** (permanecem iguais)

### Vantagem:
- **Zero conflito** na migração
- **Zero downtime** para os jornaleiros
- **URLs dos produtos** permanecem as mesmas
- **Customizações** das bancas são preservadas

---

## 📊 Fluxo para os 5 Jornaleiros Beta

### Fase 1: Onboarding
1. Jornaleiro cadastra sua banca
2. Acessa dashboard
3. **VÊ IMEDIATAMENTE** catálogo de produtos disponíveis
4. Pode habilitar/desabilitar produtos
5. Pode customizar preços se necessário

### Fase 2: Gestão
1. Produtos aparecem automaticamente no perfil da banca
2. Clientes podem comprar
3. Pedidos entram no dashboard
4. Jornaleiro gerencia normalmente

### Fase 3: Migração (Futura)
1. API real da Mercos é homologada
2. Sistema atualiza preços/estoques automaticamente
3. **Nenhuma ação necessária** dos jornaleiros
4. Tudo continua funcionando normalmente

---

## ⚠️ Importante: Boas Práticas

### Código Mercos:
- ✅ **SEMPRE em maiúsculas**: `AKOTO001`
- ✅ **SEM espaços**: `AKOTO001` não `AKOTO 001`
- ✅ **Exatamente igual** ao nome da imagem

### Nomenclatura:
- ✅ Use **exatamente** o nome da Mercos
- ✅ Mantenha **mesma categoria** da Mercos
- ✅ **Consistência** é fundamental para migração

### Imagens:
- ✅ Formato: JPG, PNG, WebP
- ✅ Nome: `CODIGO.extensao` (Ex: `AKOTO001.jpg`)
- ✅ Tamanho recomendado: max 2MB por imagem

---

## 🆘 Troubleshooting

### Problema: Imagem não vincula
**Causa**: Código não corresponde
**Solução**: Verificar se código do produto e nome da imagem são IDÊNTICOS

### Problema: Produto não aparece para jornaleiro
**Causa**: Disponibilidade não configurada
**Solução**: Editar produto e marcar "Todas as Bancas"

### Problema: Erro ao cadastrar produto
**Causa**: Código Mercos duplicado
**Solução**: Cada código deve ser único no sistema

---

## 📞 Suporte

Para dúvidas sobre o cadastro manual de produtos ou upload de imagens, consulte a documentação técnica ou entre em contato com o time de desenvolvimento.

---

## 🎉 Resumo

Este sistema permite:
1. ✅ **Cadastro manual** compatível com Mercos
2. ✅ **Upload de imagens em massa** com vinculação automática
3. ✅ **Disponibilização automática** para todas as bancas
4. ✅ **Experiência completa** para jornaleiros beta
5. ✅ **Migração suave** quando API real for integrada

**Beta launch pronto! 🚀**
