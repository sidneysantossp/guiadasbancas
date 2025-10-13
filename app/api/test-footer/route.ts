import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'API Footer funcionando!',
    timestamp: new Date().toISOString(),
    data: {
      title: 'Guia das Bancas',
      description: 'Conectamos você às melhores bancas da sua região.',
      socialLinks: {
        instagram: 'https://instagram.com/guiadasbancas',
        facebook: 'https://facebook.com/guiadasbancas'
      },
      links: [
        { id: '1', text: 'Sobre nós', url: '/sobre-nos', section: 'institucional', order: 1, active: true },
        { id: '2', text: 'Minha conta', url: '/minha-conta', section: 'para_voce', order: 1, active: true }
      ]
    }
  });
}

export async function PUT() {
  return NextResponse.json({
    success: true,
    message: 'Footer salvo com sucesso (modo teste)!'
  });
}
