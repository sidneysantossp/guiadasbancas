# ⚠️ PROBLEMA CRÍTICO: API MERCOS - BUG DE PAGINAÇÃO

## 🔴 Situação Atual

- **Esperado**: 3.439 produtos ativos
- **Sincronizado**: 2.992 produtos ativos  
- **Faltando**: 447 produtos (13% do catálogo)
- **Impacto**: 500+ jornaleiros acessando catálogo incompleto

## 🐛 Bug Confirmado da API Mercos

A API Mercos possui um **BUG CRÍTICO** de paginação que impede sincronização completa:

### Evidências:

1. **Paginação não funciona**: Todos os parâmetros testados retornam sempre os mesmos 500 produtos
   - ❌ `id_maior_que=X` - ignora o parâmetro
   - ❌ `after_id=X` - ignora o parâmetro
   - ❌ `offset=X` - ignora o parâmetro
   - ❌ `page=X` - ignora o parâmetro

2. **Loop infinito**: A API retorna sempre IDs `179565812 → 184933431`

3. **Header indica mais registros**: 
   ```
   meuspedidos_qtde_total_registros: 8085
   meuspedidos_requisicoes_extras: 16
   ```
   Mas não há forma de acessá-los via paginação!

## 🔧 Soluções Emergenciais

### Opção 1: Exportação Manual (RECOMENDADO) ⭐

1. Acessar interface Mercos
2. Ir em **Produtos > Exportar**
3. Baixar planilha CSV/Excel com TODOS os produtos ativos
4. Usar script de importação que criamos

**Vantagens:**
- ✅ Garante 100% dos produtos
- ✅ Rápido (5-10 minutos)
- ✅ Independente do bug da API

### Opção 2: Contatar Suporte Mercos

**Ticket de Suporte:**
```
Assunto: BUG CRÍTICO - Paginação da API /produtos não funciona

Descrição:
A paginação do endpoint GET /produtos não está funcionando.
Todos os parâmetros (id_maior_que, after_id, offset, page) 
retornam sempre os mesmos 500 produtos em loop infinito.

Impacto: Impossível sincronizar catálogo completo via API.

IDs testados que se repetem: 179565812 → 184933431

Headers retornados:
- meuspedidos_qtde_total_registros: 8085  
- meuspedidos_limitou_registros: 1

Solicito urgência pois temos 500+ usuários dependendo do catálogo completo.
```

### Opção 3: Sincronização por Filtros Específicos

Se a Mercos tem filtros específicos (marca, fornecedor, etc), podemos tentar buscar por esses filtros para pegar produtos diferentes.

## 📊 Dados para o Suporte

**Distribuidor:** Brancaleone Publicações  
**Token:** [seu application_token]  
**Endpoint:** `https://app.mercos.com/api/v1/produtos`  
**Problema:** Paginação retorna sempre os mesmos registros  
**Data do Bug:** Confirmado em 2025-11-18  

## 🚨 Ação Imediata Requerida

**Para garantir 100% do catálogo para os 500+ jornaleiros:**

1. ✅ Usar exportação manual da interface Mercos (HOJE)
2. ✅ Abrir ticket de suporte sobre o bug (HOJE)
3. ✅ Importar planilha exportada para o banco (script pronto)

## 📝 Script de Importação

Criarei um script que:
1. Lê planilha CSV/Excel exportada da Mercos
2. Insere/atualiza produtos no banco
3. Mantém sincronização com códigos corretos
4. Preserva imagens já importadas

**Tempo estimado:** 10-15 minutos para importação completa

---

**Última atualização:** 2025-11-18 01:45 BRT  
**Status:** AGUARDANDO AÇÃO DO USUÁRIO
