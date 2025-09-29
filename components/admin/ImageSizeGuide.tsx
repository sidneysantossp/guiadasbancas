export default function ImageSizeGuide() {
  return (
    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
      <h4 className="text-sm font-semibold text-blue-800 mb-3 flex items-center gap-2">
        📏 Guia de Tamanhos de Imagem
      </h4>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
        <div className="bg-white p-3 rounded-md border border-blue-100">
          <h5 className="font-medium text-blue-700 text-xs mb-1">📚 Gibis & Revistas</h5>
          <p className="text-xs text-gray-600"><strong>600x900px</strong></p>
          <p className="text-xs text-gray-500">Proporção 2:3 (vertical)</p>
        </div>
        
        <div className="bg-white p-3 rounded-md border border-blue-100">
          <h5 className="font-medium text-blue-700 text-xs mb-1">📦 Produtos Gerais</h5>
          <p className="text-xs text-gray-600"><strong>800x800px</strong></p>
          <p className="text-xs text-gray-500">Proporção 1:1 (quadrado)</p>
        </div>
        
        <div className="bg-white p-3 rounded-md border border-blue-100">
          <h5 className="font-medium text-blue-700 text-xs mb-1">📖 Livros</h5>
          <p className="text-xs text-gray-600"><strong>600x900px</strong></p>
          <p className="text-xs text-gray-500">Proporção 2:3 (vertical)</p>
        </div>
      </div>
      
      <div className="bg-white p-3 rounded-md border border-green-100">
        <h5 className="font-medium text-green-700 text-xs mb-2">💡 Dicas importantes:</h5>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• <strong>Arraste e solte</strong> imagens diretamente na área de upload</li>
          <li>• <strong>Fundo branco ou transparente</strong> fica melhor na vitrine</li>
          <li>• <strong>Qualidade alta</strong> para evitar pixelização</li>
          <li>• <strong>Formato JPG ou PNG</strong> são recomendados</li>
          <li>• <strong>Tamanho máximo:</strong> 2MB por imagem</li>
        </ul>
      </div>
      
      <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded-md">
        <p className="text-xs text-amber-700">
          <strong>⚡ Automático:</strong> O sistema se adapta automaticamente ao tamanho da sua imagem, 
          mas seguir essas recomendações garante a melhor apresentação na vitrine.
        </p>
      </div>
    </div>
  );
}
