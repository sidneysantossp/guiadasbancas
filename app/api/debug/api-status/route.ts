import { NextResponse } from "next/server";

export async function GET() {
  try {
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'https://guiadasbancas.com.br';

    const apisToTest = [
      '/api/categories',
      '/api/bancas',
      '/api/products',
      '/api/admin/branding'
    ];

    const results: Record<string, any> = {};

    for (const api of apisToTest) {
      try {
        const response = await fetch(`${baseUrl}${api}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        });

        const data = await response.json();
        
        results[api] = {
          status: response.status,
          ok: response.ok,
          hasData: !!data,
          dataCount: Array.isArray(data?.data) ? data.data.length : 0,
          success: data?.success || false,
          error: data?.error || null
        };
      } catch (e) {
        results[api] = {
          status: 'error',
          ok: false,
          error: e instanceof Error ? e.message : 'Unknown error'
        };
      }
    }

    return NextResponse.json({
      success: true,
      baseUrl,
      results,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
