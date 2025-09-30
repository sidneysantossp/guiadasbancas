import { NextResponse } from 'next/server';
import { dbQuery } from '@/lib/mysql';

export async function GET() {
  try {
    const [[row]] = await dbQuery<any>(
      'SELECT 1 as ok, CURRENT_USER() as current_user, DATABASE() as db, @@version as version, @@hostname as hostname'
    );

    return NextResponse.json({
      status: 'ok',
      result: row,
      usedHost: process.env.DATABASE_HOST || '203.161.46.119',
      fallbackHost: process.env.DATABASE_HOST_FALLBACK || '203.161.58.60',
      port: Number(process.env.DATABASE_PORT || '3306'),
      database: process.env.DATABASE_NAME,
      user: process.env.DATABASE_USER,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 'error',
        message: error?.message || 'Unknown error',
        code: error?.code,
        errno: error?.errno,
        sqlState: error?.sqlState,
        usedHost: process.env.DATABASE_HOST || '203.161.46.119',
        fallbackHost: process.env.DATABASE_HOST_FALLBACK || '203.161.58.60',
        port: Number(process.env.DATABASE_PORT || '3306'),
        database: process.env.DATABASE_NAME,
        user: process.env.DATABASE_USER,
      },
      { status: 500 }
    );
  }
}
