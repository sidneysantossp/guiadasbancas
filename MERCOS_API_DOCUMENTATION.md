# 📘 Documentação Completa da API Mercos

## 🚀 Início Rápido

### Ambiente Sandbox

Antes de integrar com a Mercos, é necessário utilizar o ambiente exclusivo para testes: o **sandbox**.

**Acesse:** [Criar conta no Sandbox](https://sandbox.mercos.com)

⚠️ **Atenção:** O acesso ao sandbox tem validade limitada. Se expirar, solicite renovação pelo chat da plataforma.

### Exemplo de Requisição de Teste

```bash
curl \
  -H 'Content-Type: application/json' \
  -H "ApplicationToken: {{ApplicationToken}}" \
  -H "CompanyToken: {{CompanyToken}}" \
  -X GET \
  https://sandbox.mercos.com/api/v1/token_auth_status
```

---

## 🔑 Entendendo os Tokens

### ApplicationToken
- **O que é:** Identifica sua aplicação (por exemplo, seu ERP)
- **Sandbox:** `d39001ac-0b14-11f0-8ed7-6e1485be00f2`
- **Produção:** Fornecido após homologação

### CompanyToken
- **O que é:** Representa o cliente da sua aplicação (sua empresa)
- **Como obter:** Acesse `Minha Conta > Sistema > Integração` e clique em `Gerar` ou copiar o Company Token

💡 **Importante:** Após enviar sua primeira requisição com os tokens, sua aplicação estará conectada à empresa correspondente.

---

## 🔐 Segurança dos Tokens

⚠️ **CRÍTICO:**
- Nunca compartilhe tokens publicamente ou com pessoas não autorizadas
- Armazene de forma segura e utilize apenas dentro da aplicação
- Recomendamos ocultar esses valores em logs, interfaces e prints de tela
- Use variáveis de ambiente para armazenar os tokens

---

## 📝 Templates Postman

Para facilitar os testes, disponibilizamos coleções no Postman:

👉 [Acessar coleção de templates](https://www.postman.com/mercos)

---

## ⏱️ Throttling (OBRIGATÓRIO)

### O que é?
Controle de limite de requisições por tempo, evitando sobrecarga do servidor.

### Como funciona?
Quando você recebe um **status code 429**, o body retorna:

```json
{
   "tempo_ate_permitir_novamente": 5,
   "limite_de_requisicoes": 1
}
```

### Implementação (OBRIGATÓRIA)

```javascript
async function requestWithThrottling(url, options) {
  try {
    const response = await fetch(url, options);
    
    if (response.status === 429) {
      const throttleError = await response.json();
      const waitTime = throttleError.tempo_ate_permitir_novamente * 1000;
      
      console.log(`Aguardando ${throttleError.tempo_ate_permitir_novamente}s...`);
      
      await new Promise(resolve => setTimeout(resolve, waitTime));
      
      // Tentar novamente
      return requestWithThrottling(url, options);
    }
    
    return response;
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
}
```

⚠️ **Importante:** 
- Esse controle deve ser aplicado a **TODAS as rotas**
- O limite é global
- É **critério obrigatório** para homologação

---

## 📄 Paginação (OBRIGATÓRIA)

### Por que é importante?
No sandbox geralmente não há paginação, mas em **produção é comum** que dados estejam distribuídos em múltiplas páginas.

⚠️ **Risco:** Sem tratamento correto, há perda de dados nas páginas finais.

### Headers de Controle

```
MEUSPEDIDOS_LIMITOU_REGISTROS: 1 (só aparece quando há mais dados)
MEUSPEDIDOS_QTDE_TOTAL_REGISTROS: quantidade total
MEUSPEDIDOS_REQUISICOES_EXTRAS: quantas requisições adicionais necessárias
```

### Como Implementar

```javascript
async function getAllRecords(baseUrl) {
  let allRecords = [];
  let alteradoApos = '2020-01-01T00:00:00';
  let hasMore = true;

  while (hasMore) {
    const response = await fetch(`${baseUrl}?alterado_apos=${alteradoApos}`);
    const data = await response.json();
    
    allRecords = [...allRecords, ...data];

    // Verificar se há mais páginas
    const limitouRegistros = response.headers.get('MEUSPEDIDOS_LIMITOU_REGISTROS');
    
    if (limitouRegistros === '1' && data.length > 0) {
      // Usar última alteração do último registro
      const ultimoRegistro = data[data.length - 1];
      alteradoApos = ultimoRegistro.ultima_alteracao;
    } else {
      hasMore = false;
    }
  }

  return allRecords;
}
```

### Fluxo Correto

1. Faça primeira requisição com `alterado_apos`
2. Salve todos os registros retornados
3. Atualize `alterado_apos` com o `ultima_alteracao` do último registro
4. Faça nova requisição com valor atualizado
5. Repita até `MEUSPEDIDOS_LIMITOU_REGISTROS` não aparecer

---

## 🎯 Homologação

### Antes de Produção

✅ Todos os testes devem ser feitos em **sandbox**
✅ Simular fluxos de uso
✅ Validar que tudo funciona

### Etapas

1. **Finalize os testes** usando recursos do menu de homologação beta
2. **Envie evidências** (prints, vídeos ou exemplos)
3. **Agende reunião** de homologação

### Critérios Obrigatórios para Aprovação

| Critério | Funciona sem tratar (sandbox)? | Obrigatório (produção)? |
|----------|--------------------------------|-------------------------|
| **Throttling (erro 429)** | Sim, pode não ocorrer | ✅ Obrigatório |
| **Paginação (alterado_apos)** | Sim, pode não ocorrer | ✅ Obrigatório |

⚠️ **Importante:** A não implementação desses critérios resulta em **reprovação automática**.

### O que é validado na reunião?

- **Throttling:** Identificar erro 429, aguardar tempo informado, reenviar
- **Paginação:** Percorrer todas as páginas até coletar todos os registros

---

## 🌐 Ambientes

### Sandbox (Testes)
```
URL: https://sandbox.mercos.com/api/v1
ApplicationToken: d39001ac-0b14-11f0-8ed7-6e1485be00f2
CompanyToken: 4b866744-a086-11f0-ada6-5e65486a6283
```

### Produção
```
URL: https://app.mercos.com/api/v1
ApplicationToken: (fornecido após homologação)
CompanyToken: (seu token específico)
```

⚠️ **Diferenças:**
- Tokens mudam
- URL base muda
- Apenas endpoints utilizados são liberados
- Sandbox continua ativo após produção

---

## 📊 Códigos HTTP

| Código | Descrição |
|--------|-----------|
| **200** | Sucesso |
| **400** | Bad Request - Parâmetro inválido |
| **401** | Unauthorized - Token inválido |
| **404** | Not Found - Endpoint não existe |
| **429** | Too Many Requests - Aguarde e reenvie |
| **500** | Internal Server Error - Contate suporte |

---

## 📦 JSON

⚠️ **Atenção:** Sempre utilize os **nomes das chaves** do JSON, nunca a posição. Assim sua integração continua funcionando mesmo com novos campos.

---

## 🛠️ GET por ID

### Sandbox
- GET por ID funciona para testes
- Exemplo: `GET /produtos/123`

### Produção
- GET por ID **não é permitido** por padrão
- Use GET com filtros e paginação
- Se realmente necessário, solicite liberação ao suporte com justificativa técnica

---

## 📞 Suporte

### Chat na Plataforma
Se você já tem acesso ao sandbox, fale pelo chat.

### WhatsApp
[Clique aqui para conversar](https://wa.me/5547999999999)

### Parcerias
Quer se tornar parceiro? [Preencha o formulário](https://mercos.com/parceiros)

---

## 📚 Principais Entidades

### 1. Produtos
- Gerenciar produtos
- Grades (variações)
- Categorias
- Imagens
- Tabelas de preço

### 2. Clientes
- Incluir, alterar, excluir
- Endereços
- Contatos
- Tags
- Segmentos

### 3. Pedidos (V2)
- Criar orçamentos e pedidos
- Itens com grades
- Campos extras
- Status customizados
- Faturamento

### 4. Categorias de Produtos
- Estrutura hierárquica (3 níveis)
- Vincular a produtos

### 5. Tabelas de Preço
- Preço livre
- Acréscimo
- Desconto
- Vincular a produtos e clientes

### 6. Títulos
- Faturas de clientes
- 2ª via de boleto
- Integração com Mercos Pay

### 7. Notas Fiscais
- 2ª via para clientes
- Upload de XML e PDF
- Chave de acesso

### 8. Transportadoras
- Gerenciar transportadoras
- Telefones e dados

### 9. Condições de Pagamento
- À vista, parcelado
- Valor mínimo
- Disponibilidade B2B

### 10. Formas de Pagamento
- Boleto, PIX, Cartão
- Configurar disponibilidade

---

## ✅ Checklist de Implementação

- [ ] Cadastrar conta no Sandbox
- [ ] Obter ApplicationToken e CompanyToken
- [ ] Testar requisição de status
- [ ] Implementar tratamento de Throttling (429)
- [ ] Implementar paginação com `alterado_apos`
- [ ] Testar criação de produtos
- [ ] Testar criação de clientes
- [ ] Testar criação de pedidos
- [ ] Realizar testes completos no sandbox
- [ ] Preparar evidências (prints, vídeos)
- [ ] Agendar reunião de homologação
- [ ] Receber tokens de produção
- [ ] Migrar para produção

---

## 🎓 Boas Práticas

1. **Sempre trate erros 429** (Throttling)
2. **Implemente paginação corretamente**
3. **Use `alterado_apos` para sincronizações**
4. **Armazene IDs retornados** para futuras atualizações
5. **Nunca exponha tokens** em logs ou código
6. **Teste exaustivamente no sandbox**
7. **Mantenha o sandbox ativo** mesmo em produção
8. **Use nomes de chaves JSON**, não posições
9. **Implemente retry logic** para falhas temporárias
10. **Monitore logs** de sincronização

---

## 🚀 Recursos Avançados

### Produtos Grade (Variações)
- Até 3 variações por produto
- Cores, tamanhos, materiais
- UUID para agrupar grades

### Campos Extras
- Pedidos: texto, data, numérico, hora, lista
- Clientes: customizar informações

### Status Customizados
- Criar etapas personalizadas
- Controle de workflow

### Promoções
- Descontos automáticos
- Regras por produto
- Período de validade

---

## 📖 Referências Úteis

- [Documentação Oficial](https://docs.mercos.com)
- [Postman Collections](https://www.postman.com/mercos)
- [Chat de Suporte](https://app.mercos.com)

---

## 🎉 Conclusão

Esta documentação cobre os principais aspectos da integração com a API Mercos.

**Próximos passos:**
1. Configure o ambiente sandbox
2. Implemente os endpoints necessários
3. Teste exaustivamente
4. Agende homologação
5. Vá para produção! 🚀

---

**Última atualização:** Outubro 2025  
**Versão da API:** V1 e V2 (Pedidos)
