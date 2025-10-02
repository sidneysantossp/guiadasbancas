import Image, { ImageProps } from 'next/image';

interface SafeImageProps extends Omit<ImageProps, 'src'> {
  src: string | null | undefined;
  fallback?: string;
}

/**
 * Componente Image seguro que valida o src antes de renderizar
 * Evita erros "Image is missing required src property"
 */
export default function SafeImage({ src, fallback = '/placeholder.png', alt, ...props }: SafeImageProps) {
  // Validar se src é válido
  const isValidSrc = src && typeof src === 'string' && src.trim().length > 0;
  const imageSrc = isValidSrc ? src : fallback;

  // Se não tem src válido nem fallback, renderizar div vazia
  if (!imageSrc || imageSrc === '/placeholder.png') {
    return (
      <div 
        className="bg-gray-200 flex items-center justify-center text-gray-400 text-xs"
        style={{ width: props.width || '100%', height: props.height || '100%' }}
      >
        {alt || 'Sem imagem'}
      </div>
    );
  }

  return <Image src={imageSrc} alt={alt} {...props} />;
}
