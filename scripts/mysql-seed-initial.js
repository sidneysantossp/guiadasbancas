/*
  Seed inicial para MySQL: cria tabelas mínimas (se não existirem) e dados-base
  - Usuários: Maria (jornaleiro), Teste (jornaleiro), Admin (admin)
  - Bancas para jornaleiros

  Requer env vars:
    DATABASE_HOST
    DATABASE_HOST_FALLBACK (opcional)
    DATABASE_PORT (3306 default)
    DATABASE_USER
    DATABASE_PASSWORD
    DATABASE_NAME

  Executar:
    node scripts/mysql-seed-initial.js
*/

const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const { randomUUID } = require('crypto');

function env(name, def) {
  const v = process.env[name] ?? def;
  if (!v) throw new Error(`Missing env var ${name}`);
  return v;
}

async function getPool() {
  const hostPrimary = process.env.DATABASE_HOST || '203.161.46.119';
  const hostFallback = process.env.DATABASE_HOST_FALLBACK || '203.161.58.60';
  const port = Number(process.env.DATABASE_PORT || '3306');
  const user = env('DATABASE_USER');
  const password = env('DATABASE_PASSWORD');
  const database = env('DATABASE_NAME');

  async function tryCreate(host) {
    return mysql.createPool({ host, port, user, password, database, waitForConnections: true, connectionLimit: 5, queueLimit: 0, charset: 'utf8mb4_general_ci' });
  }

  try {
    const pool = await tryCreate(hostPrimary);
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();
    return pool;
  } catch (e) {
    const pool = await tryCreate(hostFallback);
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();
    return pool;
  }
}

async function ensureSchema(conn) {
  const ddl = `
  CREATE TABLE IF NOT EXISTS users (
    id            CHAR(36)      NOT NULL,
    email         VARCHAR(255)  NOT NULL UNIQUE,
    password_hash VARCHAR(255)  NOT NULL,
    created_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
  ) ENGINE=InnoDB;

  CREATE TABLE IF NOT EXISTS user_profiles (
    user_id        CHAR(36)      NOT NULL,
    role           ENUM('admin','jornaleiro','cliente') NOT NULL DEFAULT 'cliente',
    full_name      VARCHAR(255),
    phone          VARCHAR(30),
    avatar_url     VARCHAR(500),
    banca_id       CHAR(36)      NULL,
    email_verified TINYINT(1)    NOT NULL DEFAULT 0,
    active         TINYINT(1)    NOT NULL DEFAULT 1,
    created_at     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id),
    CONSTRAINT fk_user_profiles_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  ) ENGINE=InnoDB;

  CREATE TABLE IF NOT EXISTS bancas (
    id         CHAR(36)     NOT NULL,
    user_id    CHAR(36)     NOT NULL,
    name       VARCHAR(255) NOT NULL,
    whatsapp   VARCHAR(30),
    email      VARCHAR(255),
    cep        VARCHAR(12),
    address    VARCHAR(255),
    lat        DECIMAL(10,7),
    lng        DECIMAL(10,7),
    active     TINYINT(1)   NOT NULL DEFAULT 1,
    approved   TINYINT(1)   NOT NULL DEFAULT 0,
    created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_bancas_user (user_id),
    KEY idx_bancas_active_approved (active, approved),
    CONSTRAINT fk_bancas_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  ) ENGINE=InnoDB;

  CREATE TABLE IF NOT EXISTS banca_delivery_settings (
    id                  CHAR(36)    NOT NULL,
    banca_id            CHAR(36)    NOT NULL,
    delivery_fee        DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    min_order_value     DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    delivery_radius_km  DECIMAL(5,2)  NOT NULL DEFAULT 5.00,
    preparation_time_min INT          NOT NULL DEFAULT 30,
    PRIMARY KEY (id),
    UNIQUE KEY uq_bds (banca_id),
    CONSTRAINT fk_bds_banca FOREIGN KEY (banca_id) REFERENCES bancas(id) ON DELETE CASCADE
  ) ENGINE=InnoDB;

  CREATE TABLE IF NOT EXISTS banca_payment_methods (
    id       CHAR(36)   NOT NULL,
    banca_id CHAR(36)   NOT NULL,
    method   ENUM('dinheiro','debito','credito','pix') NOT NULL,
    enabled  TINYINT(1) NOT NULL DEFAULT 1,
    PRIMARY KEY (id),
    UNIQUE KEY uq_bpm (banca_id, method),
    CONSTRAINT fk_bpm_banca FOREIGN KEY (banca_id) REFERENCES bancas(id) ON DELETE CASCADE
  ) ENGINE=InnoDB;
  `;

  for (const stmt of ddl.split(/;\s*\n/)) {
    if (stmt.trim()) await conn.query(stmt);
  }
}

async function upsertUser(conn, { email, password, fullName, role }) {
  const [[existing]] = await conn.query('SELECT u.id FROM users u WHERE u.email = ? LIMIT 1', [email]);
  const id = existing?.id || randomUUID();
  const password_hash = await bcrypt.hash(password, 10);

  // users
  await conn.query(
    'INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)',
    [id, email, password_hash]
  );

  // user_profiles
  await conn.query(
    'INSERT INTO user_profiles (user_id, role, full_name, email_verified, active) VALUES (?, ?, ?, 1, 1) ON DUPLICATE KEY UPDATE role = VALUES(role), full_name = VALUES(full_name)',
    [id, role, fullName]
  );

  return id;
}

async function upsertBanca(conn, { userId, name, whatsapp, email, cep, address, lat, lng, approved = 1 }) {
  // Uma banca por usuário
  const [[existing]] = await conn.query('SELECT id FROM bancas WHERE user_id = ? LIMIT 1', [userId]);
  const id = existing?.id || randomUUID();

  await conn.query(
    `INSERT INTO bancas (id, user_id, name, whatsapp, email, cep, address, lat, lng, active, approved)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
     ON DUPLICATE KEY UPDATE name=VALUES(name), whatsapp=VALUES(whatsapp), email=VALUES(email), cep=VALUES(cep), address=VALUES(address), lat=VALUES(lat), lng=VALUES(lng), approved=VALUES(approved)`,
    [id, userId, name, whatsapp, email, cep, address, lat, lng, approved]
  );

  // Definir banca_id no perfil
  await conn.query('UPDATE user_profiles SET banca_id = ? WHERE user_id = ?', [id, userId]);

  // Delivery default
  await conn.query(
    `INSERT INTO banca_delivery_settings (id, banca_id, delivery_fee, min_order_value, delivery_radius_km, preparation_time_min)
     VALUES (?, ?, 5.00, 10.00, 5.00, 30)
     ON DUPLICATE KEY UPDATE banca_id = VALUES(banca_id)`,
    [randomUUID(), id]
  );

  // Payment methods padrão
  const methods = ['pix', 'dinheiro'];
  for (const m of methods) {
    await conn.query(
      `INSERT INTO banca_payment_methods (id, banca_id, method, enabled)
       VALUES (?, ?, ?, 1)
       ON DUPLICATE KEY UPDATE enabled = 1`,
      [randomUUID(), id, m]
    );
  }

  return id;
}

async function main() {
  console.log('🔌 Conectando ao MySQL...');
  const pool = await getPool();
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    console.log('🛠️  Garantindo schema mínimo...');
    await ensureSchema(conn);

    console.log('👤 Inserindo usuários base...');
    const mariaId = await upsertUser(conn, { email: 'maria@jornaleiro.com', password: 'senha123', fullName: 'Maria Alves', role: 'jornaleiro' });
    const testeId = await upsertUser(conn, { email: 'teste@jornaleiro.com', password: 'senha123', fullName: 'Jornaleiro Teste', role: 'jornaleiro' });
    const adminId = await upsertUser(conn, { email: 'admin@guiadasbancas.com', password: 'admin123', fullName: 'Administrador', role: 'admin' });

    console.log('🏪 Inserindo bancas...');
    await upsertBanca(conn, {
      userId: mariaId,
      name: 'Banca São Jorge',
      whatsapp: '11987654321',
      email: 'maria@jornaleiro.com',
      cep: '01305-100',
      address: 'Rua Augusta, 1024 - Consolação, São Paulo - SP',
      lat: -23.5505,
      lng: -46.6333,
      approved: 1,
    });

    await upsertBanca(conn, {
      userId: testeId,
      name: 'Banca Teste',
      whatsapp: '11999999999',
      email: 'teste@jornaleiro.com',
      cep: '01310-100',
      address: 'Av. Paulista, 1000 - Bela Vista, São Paulo - SP',
      lat: -23.5505,
      lng: -46.6333,
      approved: 1,
    });

    await conn.commit();
    console.log('✅ Seed finalizado com sucesso.');
  } catch (e) {
    await conn.rollback();
    console.error('❌ Erro no seed:', e.message || e);
    process.exitCode = 1;
  } finally {
    conn.release();
    await pool.end();
  }
}

main().catch((e) => {
  console.error('❌ Fatal:', e);
  process.exit(1);
});
