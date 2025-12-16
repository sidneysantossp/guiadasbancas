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
    
    if (cpfOnly.length !== 11 && cpfOnly.length !== 14) {
      return NextResponse.json({ error: "CPF/CNPJ inválido" }, { status: 400 });
    }

    // Verificar na tabela de cotistas (cota ativa)
    const { data: cotistas, error: cotistasError } = await supabaseAdmin
      .from('cotistas')
      .select('id, razao_social, cnpj_cpf, codigo')
      .eq('cnpj_cpf', cpfOnly);

    if (cotistasError) {
      console.error('Erro ao buscar cotistas:', cotistasError);
    }

    // Se encontrou na tabela de cotistas, apenas registrar mas permitir cadastro
    // Não bloquear o cadastro se for apenas cotista
    const isCotista = cotistas && cotistas.length > 0;

    // Buscar usuários com este CPF
    const { data: users, error: usersError } = await supabaseAdmin
      .from('users')
      .select('id, name, cpf')
      .eq('cpf', cpfOnly);

    if (usersError) {
      console.error('Erro ao buscar usuários:', usersError);
      return NextResponse.json({ error: "Erro ao verificar CPF" }, { status: 500 });
    }

    // Se não encontrou usuários, CPF está livre (mesmo que seja cotista)
    if (!users || users.length === 0) {
      return NextResponse.json({ 
        exists: false,
        bancas: [],
        isCotista: isCotista
      });
    }

    // Buscar bancas associadas a esses usuários
    const userIds = users.map(u => u.id);
    const { data: bancas, error: bancasError } = await supabaseAdmin
      .from('bancas')
      .select('id, name, address, city, uf, user_id')
      .in('user_id', userIds);

    if (bancasError) {
      console.error('Erro ao buscar bancas:', bancasError);
      return NextResponse.json({ error: "Erro ao buscar bancas" }, { status: 500 });
    }

    // Se não tem bancas, CPF está livre (mesmo que seja cotista)
    if (!bancas || bancas.length === 0) {
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
    console.error('Erro na API check-cpf:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
