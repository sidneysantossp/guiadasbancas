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
      return NextResponse.json({ error: "Erro ao verificar cotistas" }, { status: 500 });
    }

    console.log('[check-cpf] Cotistas encontrados:', cotistas?.length || 0);

    // Se encontrou na tabela de cotistas, BLOQUEAR cadastro
    if (cotistas && cotistas.length > 0) {
      const cotistaInfo = cotistas.map(c => ({
        id: c.id,
        name: `${c.codigo} - ${c.razao_social}` || 'Cotista',
        address: `CNPJ/CPF: ${c.cnpj_cpf ? c.cnpj_cpf.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4') : 'N/A'}`
      }));

      console.log('[check-cpf] CPF/CNPJ já cadastrado como cotista:', cotistaInfo);

      return NextResponse.json({
        exists: true,
        bancas: cotistaInfo,
        isCotista: true,
        message: cpfOnly.length === 11 
          ? 'CPF já cadastrado como Cota Ativa' 
          : 'CNPJ já cadastrado como Cota Ativa'
      });
    }

    // Buscar perfis de usuário com este CPF (CPF está em user_profiles, não em users)
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from('user_profiles')
      .select('id, full_name, cpf, banca_id')
      .eq('cpf', cpfOnly);

    if (profilesError) {
      console.error('[check-cpf] Erro ao buscar perfis:', profilesError);
      return NextResponse.json({ error: "Erro ao verificar CPF" }, { status: 500 });
    }

    console.log('[check-cpf] Perfis encontrados:', profiles?.length || 0);

    // Se não encontrou perfis, CPF está livre
    if (!profiles || profiles.length === 0) {
      console.log('[check-cpf] CPF livre - sem perfis');
      return NextResponse.json({ 
        exists: false,
        bancas: []
      });
    }

    // Buscar bancas associadas a esses perfis (via banca_id no perfil ou user_id na banca)
    const userIds = profiles.map(p => p.id);
    const bancaIds = profiles.map(p => p.banca_id).filter(Boolean);
    
    console.log('[check-cpf] Buscando bancas para user_ids:', userIds, 'e banca_ids:', bancaIds);
    
    // Buscar bancas por user_id OU por id (se tiver banca_id no perfil)
    let bancas: any[] = [];
    
    if (bancaIds.length > 0) {
      const { data: bancasByIds, error: bancasError1 } = await supabaseAdmin
        .from('bancas')
        .select('id, name, address, city, uf, user_id')
        .in('id', bancaIds);
      
      if (!bancasError1 && bancasByIds) {
        bancas = [...bancas, ...bancasByIds];
      }
    }
    
    const { data: bancasByUser, error: bancasError2 } = await supabaseAdmin
      .from('bancas')
      .select('id, name, address, city, uf, user_id')
      .in('user_id', userIds);

    if (bancasError2) {
      console.error('[check-cpf] Erro ao buscar bancas:', bancasError2);
      return NextResponse.json({ error: "Erro ao buscar bancas" }, { status: 500 });
    }
    
    if (bancasByUser) {
      // Adicionar bancas que ainda não estão na lista
      for (const b of bancasByUser) {
        if (!bancas.find(existing => existing.id === b.id)) {
          bancas.push(b);
        }
      }
    }

    console.log('[check-cpf] Bancas encontradas:', bancas?.length || 0);

    // Se não tem bancas, CPF está livre
    if (!bancas || bancas.length === 0) {
      console.log('[check-cpf] CPF livre - usuário sem bancas');
      return NextResponse.json({ 
        exists: false,
        bancas: []
      });
    }

    // Formatar endereço das bancas
    const bancasFormatted = bancas.map(banca => {
      let endereco = '';
      
      if (typeof banca.address === 'string') {
        endereco = banca.address;
      } else if (typeof banca.address === 'object' && banca.address !== null) {
        const addr = banca.address as any;
        const parts = [
          addr.street,
          addr.number,
          addr.neighborhood,
          addr.city || banca.city,
          addr.uf || banca.uf
        ].filter(Boolean);
        endereco = parts.join(', ');
      }

      // Fallback para cidade e UF se não tiver endereço completo
      if (!endereco && (banca.city || banca.uf)) {
        endereco = [banca.city, banca.uf].filter(Boolean).join(' - ');
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
      message: cpfOnly.length === 11 
        ? 'CPF já cadastrado nas bancas abaixo' 
        : 'CNPJ já cadastrado nas bancas abaixo'
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
