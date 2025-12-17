import { NextResponse, NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { cpf } = await req.json();
    
    if (!cpf) {
      return NextResponse.json({ error: "CPF não informado" }, { status: 400 });
    }

    // Remover formatação do CPF
    const cpfOnly = cpf.replace(/\D/g, '');
    
    console.log('[check-cpf] Verificando CPF/CNPJ:', cpfOnly);
    
    if (cpfOnly.length !== 11 && cpfOnly.length !== 14) {
      return NextResponse.json({ error: "CPF/CNPJ inválido" }, { status: 400 });
    }

    // Verificar na tabela de cotistas (cota ativa)
    const { data: cotistas, error: cotistasError } = await supabaseAdmin
      .from('cotistas')
      .select('id, razao_social, cnpj_cpf, codigo')
      .eq('cnpj_cpf', cpfOnly);

    if (cotistasError) {
      console.error('[check-cpf] Erro ao buscar cotistas:', cotistasError);
    }

    // Flag para indicar se é cotista (usado apenas se tiver banca ativa ou futura implementação)
    const isCotistaFound = cotistas && cotistas.length > 0;
    console.log('[check-cpf] É cotista:', isCotistaFound);

    // Lista final de bancas ativas encontradas
    let bancasAtivas: any[] = [];

    // 1. Buscar bancas ATIVAS vinculadas diretamente a este CPF de cotista
    const { data: bancasCotista } = await supabaseAdmin
      .from('bancas')
      // OBS: a tabela `bancas` não possui `city`/`uf` em alguns ambientes.
      .select('id, name, address, user_id, active')
      .eq('cotista_cnpj_cpf', cpfOnly)
      .eq('active', true); // APENAS ATIVAS

    if (bancasCotista && bancasCotista.length > 0) {
      console.log('[check-cpf] Bancas ativas encontradas por vínculo de cotista:', bancasCotista.length);
      bancasAtivas = [...bancasAtivas, ...bancasCotista];
    }

    // 2. Buscar perfis de usuário com este CPF
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from('user_profiles')
      .select('id, full_name, cpf, banca_id')
      .eq('cpf', cpfOnly);

    if (profilesError) {
      console.error('[check-cpf] Erro ao buscar perfis:', profilesError);
    }

    // Se encontrou perfis, verificar se eles têm bancas ATIVAS
    if (profiles && profiles.length > 0) {
      console.log('[check-cpf] Perfis encontrados:', profiles.length);
      
      const userIds = profiles.map(p => p.id);
      const bancaIds = profiles.map(p => p.banca_id).filter(Boolean);
      
      // Buscar bancas por user_id OU por id, filtrando por ACTIVE=true
      if (bancaIds.length > 0) {
        const { data: bancasByIds } = await supabaseAdmin
          .from('bancas')
          .select('id, name, address, user_id, active')
          .in('id', bancaIds)
          .eq('active', true); // APENAS ATIVAS
        
        if (bancasByIds) {
          bancasAtivas = [...bancasAtivas, ...bancasByIds];
        }
      }
      
      const { data: bancasByUser } = await supabaseAdmin
        .from('bancas')
        .select('id, name, address, user_id, active')
        .in('user_id', userIds)
        .eq('active', true); // APENAS ATIVAS

      if (bancasByUser) {
        bancasAtivas = [...bancasAtivas, ...bancasByUser];
      }
    }

    // Remover duplicatas (bancas encontradas por múltiplos critérios)
    const uniqueBancas = Array.from(new Map(bancasAtivas.map(item => [item.id, item])).values());
    console.log('[check-cpf] Total de bancas ativas únicas:', uniqueBancas.length);

    // Se não tem bancas ATIVAS, CPF está livre (mesmo que seja cotista ou tenha perfil antigo)
    if (uniqueBancas.length === 0) {
      console.log('[check-cpf] CPF livre - sem bancas ativas');
      return NextResponse.json({ 
        exists: false,
        bancas: [],
        isCotista: isCotistaFound // Informar pro front caso queiram usar, mas exists=false libera o fluxo
      });
    }

    // Se tem bancas ATIVAS, bloqueia e retorna lista
    const bancasFormatted = uniqueBancas.map(banca => {
      let endereco = '';
      
      if (typeof banca.address === 'string') {
        endereco = banca.address;
      } else if (typeof banca.address === 'object' && banca.address !== null) {
        const addr = banca.address as any;
        const parts = [
          addr.street,
          addr.number,
          addr.neighborhood,
          addr.city,
          addr.uf
        ].filter(Boolean);
        endereco = parts.join(', ');
      }

      return {
        id: banca.id,
        name: banca.name || 'Banca sem nome',
        address: endereco || 'Endereço não informado'
      };
    });

    return NextResponse.json({
      exists: true,
      bancas: bancasFormatted,
      isCotista: isCotistaFound,
      message: cpfOnly.length === 11 
        ? 'CPF já possui cadastro com banca ativa' 
        : 'CNPJ já possui cadastro com banca ativa'
    });

  } catch (error: any) {
    console.error('[check-cpf] ERRO CRÍTICO:', error);
    console.error('[check-cpf] Stack:', error.stack);
    console.error('[check-cpf] Message:', error.message);
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
