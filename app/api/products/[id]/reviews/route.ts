import { NextRequest, NextResponse } from "next/server";

// Mock de avaliações - em produção, buscar do banco de dados
const MOCK_REVIEWS = [
  {
    id: "rev-1",
    product_id: "prod-1759043100415",
    user_name: "Maria Silva",
    user_avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=200&auto=format&fit=crop",
    rating: 5,
    comment: "Produto excelente! Meu filho adorou o kit do Show da Luna. Chegou rápido e em perfeitas condições.",
    created_at: "2025-09-25T10:30:00Z",
    verified_purchase: true
  },
  {
    id: "rev-2", 
    product_id: "prod-1759043100415",
    user_name: "João Santos",
    user_avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop",
    rating: 4,
    comment: "Muito bom! As figurinhas são de qualidade e o álbum é bem feito. Recomendo!",
    created_at: "2025-09-24T15:45:00Z",
    verified_purchase: true
  },
  {
    id: "rev-3",
    product_id: "prod-1759040628235", 
    user_name: "Ana Costa",
    user_avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop",
    rating: 5,
    comment: "História linda do Chico Bento! A qualidade da capa dura é excelente. Vale muito a pena!",
    created_at: "2025-09-26T09:15:00Z",
    verified_purchase: true
  },
  {
    id: "rev-4",
    product_id: "prod-1759040628235",
    user_name: "Carlos Oliveira", 
    user_avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    rating: 4,
    comment: "Graphic novel muito bem feita. O Orlandeli capturou bem a essência do Chico Bento.",
    created_at: "2025-09-23T14:20:00Z",
    verified_purchase: true
  }
];

export async function GET(_req: NextRequest, context: { params: { id: string } }) {
  const productId = context.params.id;
  
  // Filtrar avaliações do produto específico
  const reviews = MOCK_REVIEWS.filter(review => review.product_id === productId);
  
  // Calcular estatísticas
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
    : 0;
  
  const ratingDistribution = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length,
  };
  
  return NextResponse.json({
    success: true,
    data: {
      reviews: reviews.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
      stats: {
        total: totalReviews,
        average: Math.round(averageRating * 10) / 10,
        distribution: ratingDistribution
      }
    }
  });
}
