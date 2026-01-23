import { redirect } from 'next/navigation';
import { toBancaSlug } from '@/lib/slug';
import { supabaseAdmin } from '@/lib/supabase';

export default async function BancaByIdPage({ params }: { params: { id: string } }) {
  const { id } = params;
  
  try {
    // Buscar dados da banca diretamente no Supabase
    const { data: banca, error } = await supabaseAdmin
      .from('bancas')
      .select('id, name, address, cep')
      .eq('id', id)
      .single();
    
    if (error || !banca) {
      console.error('[BancaByIdPage] Banca não encontrada:', id, error);
      redirect('/bancas');
    }
    
    // Extrair UF do endereço ou usar 'sp' como padrão
    let uf = 'sp';
    
    if (banca.address) {
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
