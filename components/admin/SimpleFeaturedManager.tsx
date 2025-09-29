"use client";

import { useState } from "react";

interface SimpleFeaturedManagerProps {
  onFeaturedChange?: (canFeature: boolean, featuredCount: number) => void;
}

export default function SimpleFeaturedManager({ onFeaturedChange }: SimpleFeaturedManagerProps) {
  const [featuredCount] = useState(0); // Simulado por enquanto
  const canAddMore = featuredCount < 8;
  const remainingSlots = 8 - featuredCount;

  // Notificar componente pai
  if (onFeaturedChange) {
    onFeaturedChange(canAddMore, featuredCount);
  }

  return (
    <div className="space-y-4">
      {/* Contador */}
      <div className={`p-4 rounded-lg border ${canAddMore ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-gray-800">🔥 Produtos em Destaque</h4>
            <p className="text-xs text-gray-600 mt-1">
              {featuredCount}/8 produtos destacados
              {canAddMore && ` • ${remainingSlots} vagas restantes`}
            </p>
          </div>
          <div className={`text-2xl font-bold ${canAddMore ? 'text-green-600' : 'text-amber-600'}`}>
            {featuredCount}/8
          </div>
        </div>
        
        {!canAddMore && (
          <div className="mt-2 p-2 bg-amber-100 border border-amber-200 rounded text-xs text-amber-700">
            <strong>⚠️ Limite atingido!</strong> Desative algum produto para destacar este.
          </div>
        )}
      </div>

      {/* Mensagem informativa */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="text-sm text-gray-600">
          <p>📋 <strong>Como funciona:</strong></p>
          <ul className="mt-2 space-y-1 text-xs">
            <li>• Marque produtos como destaque (máximo 8)</li>
            <li>• Produtos destacados aparecem na seção "Ofertas e Promoções"</li>
            <li>• Gerencie os destaques na listagem de produtos</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
