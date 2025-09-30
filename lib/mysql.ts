import mysql from 'mysql2/promise';

let pool: mysql.Pool | null = null;

function getEnv(name: string, def?: string) {
  const v = process.env[name] ?? def;
  if (!v) throw new Error(`Missing env var ${name}`);
  return v;
}

export async function getPool() {
  if (pool) return pool;

  const hostPrimary = process.env.DATABASE_HOST || '203.161.46.119';
  const hostFallback = process.env.DATABASE_HOST_FALLBACK || '203.161.58.60';
  const port = Number(process.env.DATABASE_PORT || '3306');
  const user = getEnv('DATABASE_USER');
  const password = getEnv('DATABASE_PASSWORD');
  const database = getEnv('DATABASE_NAME');

  async function tryCreate(host: string) {
    return mysql.createPool({
      host,
      port,
      user,
      password,
      database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      charset: 'utf8mb4_general_ci',
      timezone: 'Z',
    });
  }

  try {
    pool = await tryCreate(hostPrimary);
    // Teste simples
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();
  } catch (e) {
    // Tentar fallback
    const fb = await tryCreate(hostFallback);
    const conn = await fb.getConnection();
    await conn.ping();
    conn.release();
    pool = fb;
  }

  return pool!;
}

export async function dbQuery<T = any>(sql: string, params?: any[]): Promise<[T[], mysql.FieldPacket[]]> {
  const p = await getPool();
  return p.query<T>(sql, params);
}
