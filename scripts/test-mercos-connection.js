#!/usr/bin/env node
/**
 * Smoke test da integração Mercos.
 * Verifica o token (token_auth_status) e busca 1 produto ordenado por ultima_alteracao.
 * Usa envs: MERCOS_API_URL, MERCOS_APPLICATION_TOKEN, MERCOS_COMPANY_TOKEN.
 */

const API_URL = (process.env.MERCOS_API_URL || 'https://app.mercos.com/api/v1').replace(/\/+$/, '');
const APPLICATION_TOKEN = process.env.MERCOS_APPLICATION_TOKEN;
const COMPANY_TOKEN = process.env.MERCOS_COMPANY_TOKEN;

if (!APPLICATION_TOKEN || !COMPANY_TOKEN) {
  console.error('[FAIL] MERCOS_APPLICATION_TOKEN e/ou MERCOS_COMPANY_TOKEN não definidos.');
  process.exit(1);
}

const headers = {
  ApplicationToken: APPLICATION_TOKEN,
  CompanyToken: COMPANY_TOKEN,
  'Content-Type': 'application/json',
};

const ok = (msg, extra) => console.log(`[OK] ${msg}`, extra ?? '');
const fail = (msg, err) => {
  console.error(`[FAIL] ${msg}`);
  if (err) console.error(err);
  process.exit(1);
};

async function checkStatus() {
  const url = `${API_URL}/token_auth_status`;
  const res = await fetch(url, { headers });
  if (!res.ok) {
    const body = await res.text();
    fail(`token_auth_status retornou ${res.status}`, body);
  }
  const json = await res.json().catch(() => ({}));
  ok('token_auth_status', json);
}

async function fetchLatestProduct() {
  const qp = new URLSearchParams({
    alterado_apos: '2020-01-01T00:00:00',
    limit: '1',
    order_by: 'ultima_alteracao',
    order_direction: 'desc',
  });
  const url = `${API_URL}/produtos?${qp.toString()}`;
  const res = await fetch(url, { headers });
  if (!res.ok) {
    const body = await res.text();
    fail(`produtos retornou ${res.status}`, body);
  }
  const json = await res.json().catch(() => ({}));
  const data = Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : [];
  if (data.length === 0) {
    fail('Nenhum produto retornado');
  }
  const p = data[0];
  ok('produto mais recente', {
    id: p.id,
    nome: p.nome,
    ultima_alteracao: p.ultima_alteracao,
    saldo_estoque: p.saldo_estoque,
    preco_tabela: p.preco_tabela,
    ativo: p.ativo,
    excluido: p.excluido,
  });
}

async function main() {
  await checkStatus();
  await fetchLatestProduct();
  ok('Smoke test Mercos concluído com sucesso.');
}

main().catch((err) => fail('Erro inesperado', err));
