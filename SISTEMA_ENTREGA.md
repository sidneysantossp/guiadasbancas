# Sistema de Entrega - Guia das Bancas

## 🎯 Comportamento Padrão

### **POR PADRÃO (delivery_enabled = false):**
- ✅ **Retirar na banca** → SEMPRE DISPONÍVEL (grátis)
- ❌ **Motoboy** → NÃO disponível
- ❌ **Sedex/PAC** → NÃO disponíveis
- ❌ Cálculo de frete → NÃO disponível
- ❌ Barra de meta de frete grátis → NÃO aparece

### **QUANDO JORNALEIRO ATIVA ENTREGA (delivery_enabled = true):**
- ✅ **Retirar na banca** → Continua disponível (grátis)
- ✅ **Motoboy Uber Eats** → Fica disponível (a consultar)
- ✅ **Sedex/PAC** → Ficam disponíveis (calculado por CEP)
- ✅ Cálculo de frete → Disponível
- ✅ Barra de meta de frete grátis → Aparece

---

## 📍 Onde Configurar

### **Painel do Jornaleiro:**
1. Acesse: `/jornaleiro/configuracoes`
2. Clique na aba: **"Entrega"**
3. Marque/desmarque: **☑️ Habilitar Entrega**
4. Configure (se habilitado):
   - CEP de Origem
   - Valor para Frete Grátis
   - Taxa de Entrega
   - Valor Mínimo do Pedido
   - Raio de Entrega

---

## 🛒 Experiência do Cliente no Checkout

### **Cenário 1: Entrega DESABILITADA (padrão)**

```
┌─────────────────────────────────────────┐
│ Retirada                                │
├─────────────────────────────────────────┤
│ ℹ️ Apenas retirada: Esta banca não     │
│   oferece serviço de entrega no        │
│   momento. Você pode retirar seus      │
│   produtos diretamente na banca.       │
├─────────────────────────────────────────┤
│ ☑️ Retirar na banca          Grátis    │
└─────────────────────────────────────────┘
```

### **Cenário 2: Entrega HABILITADA**

```
┌─────────────────────────────────────────┐
│ Retirada e Entrega                      │
├─────────────────────────────────────────┤
│ CEP: [01001-000]  [Calcular frete]     │
├─────────────────────────────────────────┤
│ 🎁 Meta frete grátis: R$ 80/120        │
│ ████████░░░░ Faltam R$ 40,00           │
├─────────────────────────────────────────┤
│ ☑️ Retirar na banca          Grátis    │
│ ☐  Motoboy Uber Eats      A Consultar  │
│ ☐  Sedex (2 dias)         R$ 15,00     │
│ ☐  PAC (5 dias)           R$ 10,00     │
└─────────────────────────────────────────┘
```

---

## 🗄️ Estrutura do Banco de Dados

### **Tabela: bancas**

| Coluna | Tipo | Default | Descrição |
|--------|------|---------|-----------|
| `delivery_enabled` | BOOLEAN | `false` | Habilita opções de entrega |
| `free_shipping_threshold` | DECIMAL(10,2) | `120.00` | Valor mínimo para frete grátis |
| `origin_cep` | VARCHAR(9) | `NULL` | CEP de origem para cálculo |

### **Script SQL:**
```sql
-- Já executado no Supabase
ALTER TABLE bancas ADD COLUMN delivery_enabled BOOLEAN DEFAULT false;
ALTER TABLE bancas ADD COLUMN free_shipping_threshold DECIMAL(10,2) DEFAULT 120.00;
ALTER TABLE bancas ADD COLUMN origin_cep VARCHAR(9);
```

---

## 🔄 Fluxo Completo

### **1. Jornaleiro cria conta:**
- `delivery_enabled = false` (padrão)
- Cliente só vê "Retirar na banca"

### **2. Jornaleiro ativa entrega:**
```sql
UPDATE bancas 
SET 
  delivery_enabled = true,
  free_shipping_threshold = 120.00,
  origin_cep = '01001-000'
WHERE id = 'ID_DA_BANCA';
```

### **3. Cliente faz pedido:**
- Vê todas as opções
- Pode escolher entre retirada ou entrega
- Calcula frete por CEP
- Acompanha meta de frete grátis

### **4. Jornaleiro desativa entrega:**
```sql
UPDATE bancas 
SET delivery_enabled = false
WHERE id = 'ID_DA_BANCA';
```

### **5. Cliente volta a ver:**
- Apenas "Retirar na banca"
- Mensagem informativa

---

## ✅ Vantagens do Sistema

### **Para Bancas Tradicionais (sem entrega):**
- ✅ Fluxo simples
- ✅ Sem complicações de frete
- ✅ Cliente sabe que só pode retirar
- ✅ Sem configurações desnecessárias

### **Para Bancas com Entrega:**
- ✅ Total controle sobre opções
- ✅ Cálculo automático de frete
- ✅ Meta de frete grátis incentiva vendas
- ✅ Múltiplas transportadoras
- ✅ Cliente pode escolher retirada (economiza frete)

---

## 🎯 Casos de Uso

### **Banca de Bairro (sem entrega):**
```
delivery_enabled = false
```
- Cliente compra e retira no local
- Zero configuração de frete
- Processo mais rápido

### **Banca com Motoboy Local:**
```
delivery_enabled = true
free_shipping_threshold = 50.00
origin_cep = '01310-100'
```
- Cliente pode retirar (grátis)
- Ou pedir entrega (Motoboy a consultar)
- Frete grátis acima de R$ 50

### **Banca com Entrega Nacional:**
```
delivery_enabled = true
free_shipping_threshold = 120.00
origin_cep = '01001-000'
```
- Retirada local (grátis)
- Motoboy (a consultar)
- Sedex/PAC (calculado)
- Frete grátis acima de R$ 120

---

## 🐛 Troubleshooting

### **Opções de entrega não aparecem:**
- ✅ Verifique `delivery_enabled = true` no banco
- ✅ Limpe cache do navegador
- ✅ Verifique se as APIs estão retornando os campos

### **Cálculo de frete não funciona:**
- ✅ Verifique se `origin_cep` está preenchido
- ✅ CEP deve estar no formato 00000-000
- ✅ Verifique logs da API de frete

### **Sempre aparece "Apenas retirada":**
- ✅ Execute: `SELECT delivery_enabled FROM bancas WHERE id = 'X'`
- ✅ Se false, ative: `UPDATE bancas SET delivery_enabled = true WHERE id = 'X'`

---

## 📊 Resumo Visual

```
┌──────────────────────────────────────────────────┐
│                  NOVA BANCA                      │
│                       ↓                          │
│         delivery_enabled = FALSE                 │
│                       ↓                          │
│         ✅ Retirar na banca (grátis)            │
│         ❌ Outras opções (não aparecem)         │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│         JORNALEIRO ATIVA ENTREGA                 │
│                       ↓                          │
│         delivery_enabled = TRUE                  │
│                       ↓                          │
│         ✅ Retirar na banca (grátis)            │
│         ✅ Motoboy (a consultar)                │
│         ✅ Sedex/PAC (calculado)                │
│         ✅ Cálculo de frete                     │
│         ✅ Meta de frete grátis                 │
└──────────────────────────────────────────────────┘
```

---

## 📚 Arquivos Relacionados

- `app/checkout/page.tsx` - Interface do checkout
- `app/jornaleiro/configuracoes/page.tsx` - Painel de configuração
- `components/BancaPageClient.tsx` - Barra de meta na página da banca
- `app/api/jornaleiro/banca/route.ts` - API que retorna configurações
- `database/add-shipping-config-to-bancas.sql` - Script de migração

---

## ✨ Conclusão

**O sistema está 100% funcional e flexível:**
- ✅ Por padrão: apenas retirada (simples)
- ✅ Opcional: ativar entrega (completo)
- ✅ Cliente sempre pode escolher retirada
- ✅ Jornaleiro controla tudo pelo painel
- ✅ Sem complicação para quem não precisa
- ✅ Total funcionalidade para quem quer entregar
