"use client";

interface ReviewsManagerProps {
  allowReviews: boolean;
  onAllowReviewsChange: (allow: boolean) => void;
}

export default function ReviewsManager({ allowReviews, onAllowReviewsChange }: ReviewsManagerProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex items-start gap-3">
        <div className="flex items-center justify-center w-10 h-10 bg-yellow-100 rounded-lg flex-shrink-0">
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-yellow-600" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
        
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-800 mb-1">Gestão de Avaliações</h3>
          <p className="text-xs text-gray-600 mb-3">
            Configure se os clientes podem avaliar este produto e deixar comentários.
          </p>
          
          <div className="space-y-3">
            <label className="inline-flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={allowReviews}
                onChange={(e) => onAllowReviewsChange(e.target.checked)}
                className="rounded text-[#ff5c00] focus:ring-[#ff5c00] w-4 h-4"
              />
              <div>
                <div className="text-sm font-medium text-gray-900">
                  ⭐ Permitir avaliações e comentários
                </div>
                <div className="text-xs text-gray-600">
                  Clientes poderão avaliar com estrelas e deixar comentários sobre o produto
                </div>
              </div>
            </label>
            
            {allowReviews && (
              <div className="ml-7 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-green-700 text-xs font-medium mb-2">
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  Avaliações ativadas
                </div>
                <div className="text-xs text-green-600 space-y-1">
                  <div>✓ Clientes podem dar notas de 1 a 5 estrelas</div>
                  <div>✓ Comentários aparecerão na página do produto</div>
                  <div>✓ Média das avaliações será exibida no card</div>
                </div>
              </div>
            )}
            
            {!allowReviews && (
              <div className="ml-7 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-2 text-gray-600 text-xs font-medium mb-2">
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  Avaliações desativadas
                </div>
                <div className="text-xs text-gray-500">
                  O produto não receberá avaliações dos clientes
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-100">
        <div className="text-xs text-gray-500 flex items-center gap-2">
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-blue-500" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
          </svg>
          <span>
            Você pode alterar essa configuração a qualquer momento. 
            Avaliações existentes não serão perdidas se desativar temporariamente.
          </span>
        </div>
      </div>
    </div>
  );
}
