# Sistema de Categorização Automática de Produtos

## 📋 Visão Geral

Sistema inteligente que categoriza produtos automaticamente baseado em palavras-chave nos nomes dos produtos. Desenvolvido para:

- **Preparar catálogo para homologação da Mercos** - Produtos já estarão nas categorias corretas
- **Melhorar experiência de busca** - Usuários encontram produtos facilmente nas páginas das bancas
- **Organização automática** - Milhares de produtos categorizados em segundos

## 🎯 Categorias Suportadas

O sistema reconhece automaticamente:

### Produtos de Banca
- **Tabaco e Cigarros** - Cigarros, charutos, tabaco
- **Bebidas Alcoólicas** - Cervejas, vinhos, destilados
- **Bebidas** - Água, refrigerantes, sucos, energéticos, leite
- **Snacks e Salgadinhos** - Chips, amendoim, biscoitos salgados
- **Doces e Chocolates** - Chocolates, balas, chicletes, doces

### Entretenimento
- **Mangás** - Mangás japoneses
- **HQs e Comics** - Quadrinhos DC/Marvel
- **Graphic Novels** - Turma da Mônica, graphic novels
- **Revistas** - Revistas diversas
- **Livros** - Livros em geral

### Colecionáveis
- **Cards e Colecionáveis** - Cards de futebol, pokémon, etc
- **Álbuns de Figurinhas** - Álbuns diversos

### Outros
- **Acessórios** - Produtos diversos
- **Outros** - Categoria padrão

## 🚀 Como Usar

### 1. Garantir Categorias no Banco

Antes de categorizar, garanta que todas as categorias necessárias existem:

```bash
# Ver quais categorias faltam (preview)
node scripts/garantir-categorias-essenciais.js

# Criar categorias faltantes
node scripts/garantir-categorias-essenciais.js --aplicar
```

### 2. Categorizar Produtos

#### Preview (sem aplicar mudanças)
```bash
# Ver quais mudanças seriam feitas
node scripts/categorizar-produtos-automaticamente.js

# Ver apenas produtos de um distribuidor específico
node scripts/categorizar-produtos-automaticamente.js --distribuidor=DISTRIBUIDOR_ID

# Limitar a 100 produtos para teste
node scripts/categorizar-produtos-automaticamente.js --limit=100

# Ver apenas produtos que iriam para "Bebidas"
node scripts/categorizar-produtos-automaticamente.js --categoria="Bebidas"
```

#### Aplicar Categorizações
```bash
# Aplicar em todos os produtos
node scripts/categorizar-produtos-automaticamente.js --aplicar

# Aplicar apenas em um distribuidor
node scripts/categorizar-produtos-automaticamente.js --distribuidor=DISTRIBUIDOR_ID --aplicar

# Aplicar apenas produtos de bebidas
node scripts/categorizar-produtos-automaticamente.js --categoria="Bebidas" --aplicar
```

## 📊 Exemplos de Saída

### Preview
```
🏷️  CATEGORIZAÇÃO AUTOMÁTICA DE PRODUTOS

Modo: 👁️  PREVIEW (use --aplicar para aplicar)

📂 Buscando categorias...
✅ 14 categorias encontradas

📋 Categorias disponíveis:
   - Tabaco e Cigarros
   - Bebidas Alcoólicas
   - Bebidas
   - Mangás
   ...

📦 Buscando produtos...
✅ 3439 produtos encontrados

📊 ESTATÍSTICAS

Total de produtos:        3439
Com mudança:              2150 ✏️
Sem mudança necessária:   1200 ✓
Sem categoria sugerida:   89 ⚠️

📊 Produtos por categoria:
   Mangás: 850
   Bebidas: 420
   Doces e Chocolates: 380
   Snacks e Salgadinhos: 200
   ...

📝 PREVIEW DAS MUDANÇAS (primeiros 20):

COCA-COLA 2L PET RETORNÁVEL                       | SEM CATEGORIA        → Bebidas
MARLBORO RED BOX                                   | Outros               → Tabaco e Cigarros
ONE PIECE VOL. 105                                 | SEM CATEGORIA        → Mangás
...

💡 Para aplicar estas mudanças, execute novamente com --aplicar
```

## 🔧 Adicionar Novas Regras de Categorização

Para adicionar novas categorias ou palavras-chave:

1. Edite o arquivo `/lib/auto-categorize.ts`
2. Adicione a categoria em `CATEGORY_RULES`:

```typescript
{
  id: 'nova-categoria',
  name: 'Nova Categoria',
  keywords: [
    'PALAVRA1', 'PALAVRA2', 'MARCA1', 'MARCA2'
  ],
  priority: 15 // Quanto maior, mais prioritário
}
```

3. Garanta que a categoria existe no banco:
```bash
node scripts/garantir-categorias-essenciais.js --aplicar
```

4. Execute a categorização:
```bash
node scripts/categorizar-produtos-automaticamente.js --aplicar
```

## 💡 Dicas e Boas Práticas

### Prioridades
- **15+**: Categorias muito específicas (Tabaco, Alcoólicas)
- **10-14**: Categorias principais (Bebidas, Snacks, Doces)
- **5-9**: Entretenimento (Mangás, HQs, Livros)
- **1-4**: Outras categorias

### Palavras-chave
- Use MAIÚSCULAS para as palavras-chave
- Inclua variações (COCA-COLA, COCA COLA)
- Inclua marcas populares
- Evite palavras genéricas demais

### Testing
```bash
# Sempre teste com preview primeiro
node scripts/categorizar-produtos-automaticamente.js --limit=100

# Teste categoria por categoria
node scripts/categorizar-produtos-automaticamente.js --categoria="Bebidas"

# Verifique distribuidor por distribuidor
node scripts/categorizar-produtos-automaticamente.js --distribuidor=ID --limit=50
```

## 🌐 Via API (Admin)

Você também pode usar via API:

### Preview
```bash
GET /api/admin/produtos/auto-categorize?distribuidor_id=ID&limit=100
```

### Aplicar
```bash
POST /api/admin/produtos/auto-categorize
Content-Type: application/json

{
  "distribuidor_id": "optional-id",
  "dry_run": false
}
```

## 📈 Métricas e Relatórios

O sistema fornece:
- Total de produtos analisados
- Produtos com mudança vs sem mudança
- Distribuição por categoria
- Lista detalhada de mudanças
- Taxa de sucesso/erro

## ❓ FAQ

**P: O script sobrescreve categorizações manuais?**  
R: Sim, ele atualiza todos os produtos. Se quiser preservar algumas categorizações, filtre por distribuidor ou categoria.

**P: E se um produto combinar com múltiplas categorias?**  
R: A primeira categoria (maior prioridade) que der match será usada.

**P: Posso reverter as mudanças?**  
R: Não há rollback automático. Sempre use `--preview` primeiro e faça backup se necessário.

**P: Como adiciono suporte para novos distribuidores?**  
R: O sistema funciona automaticamente para qualquer produto com `distribuidor_id` não nulo.

## 🐛 Troubleshooting

### Categoria não encontrada
```
⚠️  Categoria "Bebidas" não encontrada no banco
```
**Solução**: Execute `node scripts/garantir-categorias-essenciais.js --aplicar`

### Erro de permissão
```
❌ Erro ao buscar produtos: permission denied
```
**Solução**: Verifique se `SUPABASE_SERVICE_ROLE_KEY` está configurada no `.env.local`

### Produtos não sendo categorizados
**Solução**: Verifique se as palavras-chave cobrem o nome do produto. Adicione mais keywords em `auto-categorize.ts`

## 🎓 Exemplo Completo

```bash
# 1. Verificar ambiente
node -v  # deve ser v16+

# 2. Garantir categorias
node scripts/garantir-categorias-essenciais.js --aplicar

# 3. Preview de 50 produtos para testar
node scripts/categorizar-produtos-automaticamente.js --limit=50

# 4. Preview completo
node scripts/categorizar-produtos-automaticamente.js

# 5. Aplicar em um distribuidor específico
node scripts/categorizar-produtos-automaticamente.js --distribuidor=BRANCALEONE_ID --aplicar

# 6. Aplicar em todos
node scripts/categorizar-produtos-automaticamente.js --aplicar
```

## 📞 Suporte

Para dúvidas ou melhorias, contate o time de desenvolvimento.
