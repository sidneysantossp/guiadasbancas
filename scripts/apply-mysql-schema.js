/*
  Aplica o schema MySQL do arquivo database/mysql/schema.sql no banco informado por env.
  Uso:
    DATABASE_HOST=... DATABASE_USER=... DATABASE_PASSWORD=... DATABASE_NAME=... node scripts/apply-mysql-schema.js
*/

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

function env(name, def) {
  const v = process.env[name] ?? def;
  if (!v) throw new Error(`Missing env var ${name}`);
  return v;
}

async function main() {
  const hostPrimary = process.env.DATABASE_HOST || '203.161.46.119';
  const hostFallback = process.env.DATABASE_HOST_FALLBACK || '203.161.58.60';
  const port = Number(process.env.DATABASE_PORT || '3306');
  const user = env('DATABASE_USER');
  const password = env('DATABASE_PASSWORD');
  const database = env('DATABASE_NAME');

  const schemaFile = path.join(__dirname, '..', 'database', 'mysql', 'schema.sql').replace(/scripts\/+\.\./, '');
  const schemaPath = path.resolve(__dirname, '../database/mysql/schema.sql');
  const sql = fs.readFileSync(schemaPath, 'utf8');

  async function tryConnect(host) {
    const pool = await mysql.createPool({ host, port, user, password, database, waitForConnections: true, connectionLimit: 5, queueLimit: 0, charset: 'utf8mb4_general_ci' });
    const conn = await pool.getConnection();
    try {
      // Não tenta criar o banco, apenas usa o existente
      const statements = sql
        .split(/;\s*\n/)
        .map(s => s.trim())
        .filter(s => s && !s.match(/^CREATE DATABASE|^USE guiadasbancas/i));

      for (const stmt of statements) {
        if (stmt) await conn.query(stmt);
      }

      console.log('✅ Schema aplicado com sucesso em', host);
    } finally {
      conn.release();
      await pool.end();
    }
  }

  try {
    await tryConnect(hostPrimary);
  } catch (e) {
    console.warn('⚠️ Falhou no host primário, tentando fallback:', e.message || e);
    await tryConnect(hostFallback);
  }
}

main().catch((e) => {
  console.error('❌ Erro ao aplicar schema:', e);
  process.exit(1);
});
