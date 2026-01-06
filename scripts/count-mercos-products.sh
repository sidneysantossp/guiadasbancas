#!/bin/bash

# Script para contar produtos na API Mercos
# Usa a API de health para obter informações e depois faz paginação completa

DISTRIBUIDOR_ID="1511df09-1f4a-4e68-9f8c-05cd06be6269"
BASE_URL="https://app.mercos.com/api/v1"

# Tokens da Brancaleone (buscar do banco de dados)
# Você precisa fornecer os tokens aqui
APP_TOKEN="$1"
COMPANY_TOKEN="$2"

if [ -z "$APP_TOKEN" ] || [ -z "$COMPANY_TOKEN" ]; then
    echo "Uso: ./count-mercos-products.sh <APP_TOKEN> <COMPANY_TOKEN>"
    echo ""
    echo "Para obter os tokens, execute no Supabase:"
    echo "SELECT application_token, company_token FROM distribuidores WHERE id = '$DISTRIBUIDOR_ID';"
    exit 1
fi

echo "=== Contando produtos na API Mercos ==="
echo "Distribuidor: Brancaleone"
echo ""

TOTAL=0
ATIVOS=0
INATIVOS=0
EXCLUIDOS=0
PAGE=0
ALTERADO_APOS="2000-01-01T00:00:00"

while true; do
    PAGE=$((PAGE + 1))
    
    RESPONSE=$(curl -s "$BASE_URL/produtos?alterado_apos=$ALTERADO_APOS&limit=200&order_by=ultima_alteracao&order_direction=asc" \
        -H "ApplicationToken: $APP_TOKEN" \
        -H "CompanyToken: $COMPANY_TOKEN" \
        -H "Content-Type: application/json" \
        -D /tmp/mercos_headers.txt)
    
    # Verificar se limitou registros
    LIMITOU=$(grep -i "MEUSPEDIDOS_LIMITOU_REGISTROS: 1" /tmp/mercos_headers.txt 2>/dev/null)
    
    # Contar produtos nesta página
    COUNT=$(echo "$RESPONSE" | jq 'if type == "array" then length else .data | length end' 2>/dev/null)
    
    if [ -z "$COUNT" ] || [ "$COUNT" == "null" ] || [ "$COUNT" == "0" ]; then
        echo "Página $PAGE: 0 produtos (fim)"
        break
    fi
    
    TOTAL=$((TOTAL + COUNT))
    
    # Contar por status
    ATIVOS_PAGE=$(echo "$RESPONSE" | jq '[.[] | select(.ativo == true and .excluido != true)] | length' 2>/dev/null || echo "0")
    EXCLUIDOS_PAGE=$(echo "$RESPONSE" | jq '[.[] | select(.excluido == true)] | length' 2>/dev/null || echo "0")
    INATIVOS_PAGE=$(echo "$RESPONSE" | jq '[.[] | select(.ativo != true and .excluido != true)] | length' 2>/dev/null || echo "0")
    
    ATIVOS=$((ATIVOS + ATIVOS_PAGE))
    EXCLUIDOS=$((EXCLUIDOS + EXCLUIDOS_PAGE))
    INATIVOS=$((INATIVOS + INATIVOS_PAGE))
    
    # Pegar última data para próxima página
    ULTIMA_DATA=$(echo "$RESPONSE" | jq -r 'if type == "array" then .[-1].ultima_alteracao else .data[-1].ultima_alteracao end' 2>/dev/null)
    
    echo "Página $PAGE: $COUNT produtos (total: $TOTAL, última data: $ULTIMA_DATA)"
    
    if [ -z "$LIMITOU" ]; then
        echo "Não limitou registros - última página"
        break
    fi
    
    if [ -z "$ULTIMA_DATA" ] || [ "$ULTIMA_DATA" == "null" ]; then
        break
    fi
    
    ALTERADO_APOS="$ULTIMA_DATA"
    
    # Safety: máximo 100 páginas
    if [ $PAGE -ge 100 ]; then
        echo "Atingiu limite de 100 páginas"
        break
    fi
done

echo ""
echo "=== RESULTADO ==="
echo "Total de produtos na Mercos: $TOTAL"
echo "  - Ativos: $ATIVOS"
echo "  - Inativos: $INATIVOS"
echo "  - Excluídos: $EXCLUIDOS"
echo ""
echo "Produtos no banco local: 3473"
echo "Diferença: $((TOTAL - 3473))"
