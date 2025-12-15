"use client";

type StarsProps = {
  value?: number;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
};

/**
 * Componente compartilhado para exibição de estrelas de avaliação.
 * Substitui as múltiplas implementações duplicadas em outros componentes.
 */
export default function Stars({ value = 0, count, size = 'sm', showCount = false }: StarsProps) {
  const v = Math.max(0, Math.min(5, Number(value ?? 0)));
  const full = Math.floor(v);
  const half = v - full >= 0.5;
  
  const sizeMap = {
    sm: { width: 12, height: 12 },
    md: { width: 14, height: 14 },
    lg: { width: 18, height: 18 },
  };
  
  const { width, height } = sizeMap[size];
  
  return (
    <span className="inline-flex items-center gap-[2px] text-[#f59e0b]">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" width={width} height={height} fill="currentColor" aria-hidden>
          {i < full ? (
            <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.786 1.402 8.164L12 18.896 4.664 23.16l1.402-8.164L.132 9.21l8.2-1.192L12 .587z" />
          ) : i === full && half ? (
            <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.786 1.402 8.164L12 18.896V.587z" />
          ) : (
            <path d="M22 9.21l-8.2-1.192L12 .587 10.2 8.018 2 9.21l5.934 5.786L6.532 23.16 12 18.896l5.468 4.264-1.402-8.164L22 9.21z" fillOpacity="0.25" />
          )}
        </svg>
      ))}
      {showCount && typeof count === 'number' && (
        <span className="ml-1 text-[11px] text-gray-500">{count} avaliação{count === 1 ? '' : 's'}</span>
      )}
    </span>
  );
}
