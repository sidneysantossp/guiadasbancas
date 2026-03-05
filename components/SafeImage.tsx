import Image, { ImageProps } from 'next/image';
import { sanitizePublicImageUrl } from '@/lib/sanitizePublicImageUrl';

interface SafeImageProps extends Omit<ImageProps, 'src'> {
  src: string | null | undefined;
  fallback?: string;
}

/**
 * Componente Image seguro que valida o src antes de renderizar
 * Evita erros "Image is missing required src property"
 */
export default function SafeImage({ src, fallback = '/placeholder.png', alt, ...props }: SafeImageProps) {
  const imageSrc = sanitizePublicImageUrl(src);
  const fallbackSrc = fallback === "/placeholder.png" ? "" : sanitizePublicImageUrl(fallback);
  const finalSrc = imageSrc || fallbackSrc;

  // Se não tem src válido nem fallback, renderizar div vazia
  if (!finalSrc) {
    return (
      <div 
        className="bg-gray-200 flex items-center justify-center text-gray-400 text-xs"
        style={{ width: props.width || '100%', height: props.height || '100%' }}
      >
        {alt || 'Sem imagem'}
      </div>
    );
  }

  return <Image src={finalSrc} alt={alt} {...props} />;
}
