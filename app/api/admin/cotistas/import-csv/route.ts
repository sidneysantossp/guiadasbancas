import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

function verifyAdminAuth(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  return Boolean(authHeader && authHeader === "Bearer admin-token");
}

// Extrai código do início da razão social (ex: "0001 - NOME" → "0001")
function extractCodigo(razaoSocial: string): string {
  const match = razaoSocial.match(/^(\d+)\s*-/);
  return match ? match[1] : razaoSocial.substring(0, 10).trim();
}

// Limpa CNPJ/CPF removendo formatação
function cleanCnpjCpf(value: string): string {
  return value.replace(/[^\d]/g, '');
}

// Valida se é CPF ou CNPJ válido
function isValidCnpjCpf(value: string): boolean {
  const cleaned = cleanCnpjCpf(value);
  return cleaned.length === 11 || cleaned.length === 14;
}

export async function POST(request: NextRequest) {
  console.log('[CSV IMPORT] Iniciando importação CSV');
  
  try {
    if (!verifyAdminAuth(request)) {
      return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ success: false, error: "Arquivo não encontrado" }, { status: 400 });
    }

    console.log('[CSV IMPORT] Arquivo recebido:', file.name, file.type, file.size);

    // Ler como texto simples (CSV/TSV)
    const buffer = await file.arrayBuffer();
    const text = new TextDecoder('utf-8').decode(buffer);
    
    // Processar linhas
    const lines = text.split('\n').filter(line => line.trim());
    
    if (lines.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: "Arquivo vazio" 
      }, { status: 400 });
    }

    // Detectar separador (vírgula, ponto-vírgula ou tab)
    const firstLine = lines[0];
    const separator = firstLine.includes('\t') ? '\t' : (firstLine.includes(';') ? ';' : ',');
    console.log('[CSV IMPORT] Separador detectado:', separator === '\t' ? 'TAB' : separator);

    const data = lines.map(line => 
      line.split(separator).map(v => v.trim().replace(/^["']|["']$/g, ''))
    );
    
    const headers = data[0].map((h: any) => String(h).trim().toLowerCase());
    
    console.log('[CSV IMPORT] Headers:', headers);
    console.log('[CSV IMPORT] Total linhas:', data.length - 1);

    // Encontrar índices das colunas
    const findColumn = (names: string[]) => {
      for (const name of names) {
        const idx = headers.findIndex(h => 
          h.includes(name) || 
          h.replace(/\s+/g, '').includes(name.replace(/\s+/g, ''))
        );
        if (idx !== -1) return idx;
      }
      return -1;
    };

    const idxRazaoSocial = findColumn(['razaosocial', 'razao social', 'razão social', 'nome', 'empresa']);
    const idxCnpjCpf = findColumn(['cnpj', 'cpf', 'cnpj/cpf', 'documento']);
    const idxTelefone = findColumn(['telefone', 'telefones', 'tel', 'fone']);
    const idxTelefone2 = findColumn(['telefone2', 'telefone 2', 'tel2']);
    const idxEndereco = findColumn(['endereco', 'endereço', 'endereco principal', 'endereço principal', 'rua', 'logradouro']);
    const idxCidade = findColumn(['cidade']);
    const idxEstado = findColumn(['estado', 'uf']);

    if (idxRazaoSocial === -1) {
      return NextResponse.json({ 
        success: false, 
        error: "Coluna 'Razão Social' não encontrada. Colunas disponíveis: " + headers.join(', ') 
      }, { status: 400 });
    }

    if (idxCnpjCpf === -1) {
      return NextResponse.json({ 
        success: false, 
        error: "Coluna 'CNPJ/CPF' não encontrada. Colunas disponíveis: " + headers.join(', ') 
      }, { status: 400 });
    }

    let imported = 0;
    let updated = 0;
    let errors = 0;
    const errorDetails: string[] = [];

    // Processar cada linha
    for (let i = 1; i < data.length; i++) {
      try {
        const values = data[i].map((v: any) => {
          if (v === null || v === undefined) return '';
          return String(v).trim();
        });
        
        if (values.every((v: string) => !v)) continue;
        
        const razaoSocial = values[idxRazaoSocial]?.trim();
        let cnpjCpf = values[idxCnpjCpf]?.trim();
        
        // Auto-pad CNPJ/CPF
        if (cnpjCpf && /^\d+$/.test(cnpjCpf)) {
          if (cnpjCpf.length < 11) {
            cnpjCpf = cnpjCpf.padStart(11, '0');
          } else if (cnpjCpf.length > 11 && cnpjCpf.length < 14) {
            cnpjCpf = cnpjCpf.padStart(14, '0');
          }
        }

        if (!razaoSocial || !cnpjCpf) {
          errorDetails.push(`Linha ${i + 1}: Razão Social ou CNPJ/CPF vazio`);
          errors++;
          continue;
        }

        if (!isValidCnpjCpf(cnpjCpf)) {
          errorDetails.push(`Linha ${i + 1}: CNPJ/CPF inválido: ${cnpjCpf}`);
          errors++;
          continue;
        }

        const codigo = extractCodigo(razaoSocial);
        const cnpjCpfClean = cleanCnpjCpf(cnpjCpf);

        const cotistaData = {
          codigo,
          razao_social: razaoSocial,
          cnpj_cpf: cnpjCpfClean,
          telefone: idxTelefone !== -1 ? values[idxTelefone]?.trim() || null : null,
          telefone_2: idxTelefone2 !== -1 ? values[idxTelefone2]?.trim() || null : null,
          endereco_principal: idxEndereco !== -1 ? values[idxEndereco]?.trim() || null : null,
          cidade: idxCidade !== -1 ? values[idxCidade]?.trim() || null : null,
          estado: idxEstado !== -1 ? values[idxEstado]?.trim() || null : null,
          ativo: true,
        };

        // Verificar se já existe
        const { data: existing } = await supabaseAdmin
          .from('cotistas')
          .select('id')
          .eq('cnpj_cpf', cnpjCpfClean)
          .single();

        if (existing) {
          const { error } = await supabaseAdmin
            .from('cotistas')
            .update(cotistaData)
            .eq('id', existing.id);

          if (error) {
            errorDetails.push(`Linha ${i + 1}: ${error.message}`);
            errors++;
          } else {
            updated++;
          }
        } else {
          const { error } = await supabaseAdmin
            .from('cotistas')
            .insert(cotistaData);

          if (error) {
            errorDetails.push(`Linha ${i + 1}: ${error.message}`);
            errors++;
          } else {
            imported++;
          }
        }

      } catch (err: any) {
        errorDetails.push(`Linha ${i + 1}: ${err.message}`);
        errors++;
      }
    }

    console.log('[CSV IMPORT] Resultado:', { imported, updated, errors });

    return NextResponse.json({
      success: true,
      total: data.length - 1,
      imported,
      updated,
      errors,
      errorDetails: errorDetails.slice(0, 50)
    });

  } catch (error: any) {
    console.error('[CSV IMPORT] Exception:', error);
    return NextResponse.json({
      success: false,
      error: error?.message || "Erro ao processar arquivo"
    }, { status: 500 });
  }
}
