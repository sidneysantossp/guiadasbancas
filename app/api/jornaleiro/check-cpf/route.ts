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

    // Se encontrou na tabela de cotistas, apenas registrar mas permitir cadastro
    const isCotista = cotistas && cotistas.length > 0;
    console.log('[check-cpf] É cotista?', isCotista, '- Total:', cotistas?.length || 0);

    // Buscar usuários com este CPF
    const { data: users, error: usersError } = await supabaseAdmin
      .from('users')
      .select('id, name, cpf')
      .eq('cpf', cpfOnly);

    if (usersError) {
      console.error('[check-cpf] Erro ao buscar usuários:', usersError);
      return NextResponse.json({ error: "Erro ao verificar CPF" }, { status: 500 });
    }

    console.log('[check-cpf] Usuários encontrados:', users?.length || 0);

    // Se não encontrou usuários, CPF está livre
    if (!users || users.length === 0) {
      console.log('[check-cpf] CPF livre - sem usuários');
      return NextResponse.json({ 
        exists: false,
        bancas: [],
        isCotista: isCotista
      });
    }

    // Buscar bancas associadas a esses usuários
    const userIds = users.map(u => u.id);
    console.log('[check-cpf] Buscando bancas para user_ids:', userIds);
    
    const { data: bancas, error: bancasError } = await supabaseAdmin
      .from('bancas')
      .select('id, name, address, city, uf, user_id')
      .in('user_id', userIds);

    if (bancasError) {
      console.error('[check-cpf] Erro ao buscar bancas:', bancasError);
      return NextResponse.json({ error: "Erro ao buscar bancas" }, { status: 500 });
    }

    console.log('[check-cpf] Bancas encontradas:', bancas?.length || 0);

    // Se não tem bancas, CPF está livre
    if (!bancas || bancas.length === 0) {
      console.log('[check-cpf] CPF livre - usuário sem bancas');
      return NextResponse.json({ 
        exists: false,
        bancas: [],
        isCotista: isCotista
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
