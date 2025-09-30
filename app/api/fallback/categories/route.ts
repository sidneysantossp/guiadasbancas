import { NextResponse } from "next/server";

// Dados de fallback enquanto o Supabase não funciona
const mockCategories = [
  { id: '1', name: 'Revistas', image: '/images/categories/revistas.jpg', link: '/categoria/revistas', active: true, order: 1 },
  { id: '2', name: 'Jornais', image: '/images/categories/jornais.jpg', link: '/categoria/jornais', active: true, order: 2 },
  { id: '3', name: 'Livros', image: '/images/categories/livros.jpg', link: '/categoria/livros', active: true, order: 3 },
  { id: '4', name: 'Quadrinhos', image: '/images/categories/quadrinhos.jpg', link: '/categoria/quadrinhos', active: true, order: 4 },
  { id: '5', name: 'Doces', image: '/images/categories/doces.jpg', link: '/categoria/doces', active: true, order: 5 }
];

export async function GET() {
  return NextResponse.json({
    success: true,
    data: mockCategories,
    note: "Dados de fallback - Supabase temporariamente indisponível"
  });
}
