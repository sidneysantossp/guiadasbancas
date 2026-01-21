import { redirect } from 'next/navigation';
import { getAdminBancaById } from '@/lib/data/bancas';
import { toBancaSlug } from '@/lib/slug';

export default async function BancaByIdPage({ params }: { params: { id: string } }) {
  const { id } = params;
  
  try {
    // Buscar dados da banca pelo ID
    const banca = await getAdminBancaById(id);
    
    if (!banca) {
      // Se não encontrar, redirecionar para página de bancas
      redirect('/bancas');
    }
    
    // Extrair UF do endereço ou usar 'sp' como padrão
    let uf = 'sp';
    
    // Tentar extrair do address_obj primeiro
    if (banca.addressObj?.state) {
      uf = banca.addressObj.state.toLowerCase();
    } else if (banca.address_obj?.state) {
      uf = banca.address_obj.state.toLowerCase();
    } else if (banca.address) {
      // Tentar extrair do endereço (ex: "... - SP")
      const match = banca.address.match(/\b([A-Z]{2})\b/);
      if (match) {
        uf = match[1].toLowerCase();
      }
    }
    
    // Criar slug: nome-da-banca-id
    const slug = `${toBancaSlug(banca.name)}-${banca.id}`;
    
    // Redirecionar para a URL correta
    redirect(`/banca/${uf}/${slug}`);
  } catch (error) {
    console.error('[BancaByIdPage] Erro ao buscar banca:', error);
    redirect('/bancas');
  }
}
