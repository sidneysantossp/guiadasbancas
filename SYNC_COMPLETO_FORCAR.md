# SINCRONIZAÇÃO COMPLETA - FORÇAR 100%

## Problema Atual
- Mercos: 3440 produtos ativos
- Banco: 3439 produtos ativos  
- Diferença: 1 produto faltando

## Causa Provável
O produto novo criado na Mercos pode estar:
1. Marcado como INATIVO (campo `ativo = false`)
2. Marcado como EXCLUÍDO (campo `excluido = true`)
3. Criado há menos de 1 minuto (delay da API)
4. Com algum problema de sincronização

## Solução Definitiva

### Opção 1: Verificar na Mercos
1. Acesse a Mercos
2. Encontre o produto novo
3. Verifique se está marcado como **ATIVO**
4. Salve novamente
5. Aguarde 2 minutos
6. Execute sincronização completa

### Opção 2: Executar Reset Total
Execute o reset completo que deleta TODOS os produtos e busca novamente:

```bash
curl -X POST "https://www.guiadasbancas.com.br/api/admin/distribuidores/reset-sync"
```

⚠️ **ATENÇÃO**: Isso vai deletar TODOS os 7.256 produtos e buscar novamente da Mercos.
Pode demorar ~3-5 minutos.

### Opção 3: Sincronização Completa (Recomendado)
Execute várias vezes até pegar:

```bash
curl -X POST "https://www.guiadasbancas.com.br/api/cron/sync-mercos?full=true"
```

## Comandos Úteis

### Ver produtos ativos no banco:
```bash
curl -s "https://www.guiadasbancas.com.br/api/admin/products/count"
```

### Ver último sync:
```bash
curl -s "https://www.guiadasbancas.com.br/api/admin/sync/stats"
```

### Diagnóstico completo:
```bash
curl -s "https://www.guiadasbancas.com.br/api/admin/distribuidores/diagnostico-sync"
```

## Próximos Passos

1. ✅ Verificar se produto está ATIVO na Mercos
2. ✅ Executar sincronização completa
3. ✅ Aguardar 2 minutos
4. ✅ Verificar novamente
5. ✅ Se não resolver, executar reset total
