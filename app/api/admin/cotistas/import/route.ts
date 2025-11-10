import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // 60 seconds timeout

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
  console.log('[IMPORT COTISTAS] === INÍCIO ===');
  
  try {
    console.log('[IMPORT COTISTAS] Verificando autenticação...');
    if (!verifyAdminAuth(request)) {
      console.log('[IMPORT COTISTAS] Não autorizado');
      return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
    }

    console.log('[IMPORT COTISTAS] Obtendo formData...');
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      console.log('[IMPORT COTISTAS] Arquivo não encontrado');
      return NextResponse.json({ success: false, error: "Arquivo não encontrado" }, { status: 400 });
    }

    console.log('[IMPORT COTISTAS] Arquivo recebido:', file.name, file.type, file.size);

    // Ler conteúdo do arquivo como texto (CSV/TSV apenas)
    console.log('[IMPORT COTISTAS] Lendo arquivo como texto...');
    const buffer = await file.arrayBuffer();
    const text = new TextDecoder('utf-8').decode(buffer);
    
    if (!text || text.trim().length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: "Arquivo vazio ou inválido" 
      }, { status: 400 });
    }
    
    // Processar linhas
    const lines = text.split('\n').filter(line => line.trim());
    
    if (lines.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: "Arquivo não contém dados" 
      }, { status: 400 });
    }
    
    // Detectar separador automático
    const firstLine = lines[0];
    const separator = firstLine.includes('\t') ? '\t' : (firstLine.includes(';') ? ';' : ',');
    console.log('[IMPORT COTISTAS] Separador detectado:', separator === '\t' ? 'TAB' : separator);
    
    // Converter para array 2D
    const data = lines.map(line => 
      line.split(separator).map(v => v.trim().replace(/^["']|["']$/g, ''))
    );
    
    console.log('[IMPORT COTISTAS] Total linhas processadas:', data.length);
    
    if (data.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: "Arquivo vazio ou formato inválido" 
      }, { status: 400 });
    }
    
    const headers = data[0].map((h: any) => String(h).trim().toLowerCase());
    
    console.log('[IMPORT COTISTAS] Headers encontrados:', headers);
    console.log('[IMPORT COTISTAS] Total de linhas:', data.length - 1);

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
        
        if (values.every((v: string) => !v)) continue; // Pular linhas vazias
        
        const razaoSocial = values[idxRazaoSocial]?.trim();
        let cnpjCpf = values[idxCnpjCpf]?.trim();
        
        // Se CNPJ/CPF vier como número do Excel, formatar corretamente
        if (cnpjCpf && /^\d+$/.test(cnpjCpf)) {
          // Adicionar zeros à esquerda se necessário
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
          // Atualizar
          const { error } = await supabaseAdmin
            .from('cotistas')
            .update(cotistaData)
            .eq('id', existing.id);

          if (error) {
            errorDetails.push(`Linha ${i + 1}: Erro ao atualizar - ${error.message}`);
            errors++;
          } else {
            updated++;
          }
        } else {
          // Inserir novo
          const { error } = await supabaseAdmin
            .from('cotistas')
            .insert(cotistaData);

          if (error) {
            errorDetails.push(`Linha ${i + 1}: Erro ao inserir - ${error.message}`);
            errors++;
          } else {
            imported++;
          }
        }

      } catch (err: any) {
        console.error(`[IMPORT COTISTAS] Erro na linha ${i + 1}:`, err);
        errorDetails.push(`Linha ${i + 1}: ${err.message}`);
        errors++;
      }
    }

    console.log('[IMPORT COTISTAS] Resultado:', { imported, updated, errors });

    return NextResponse.json({
      success: true,
      total: data.length - 1,
      imported,
      updated,
      errors,
      errorDetails: errorDetails.slice(0, 50) // Limitar a 50 erros para não sobrecarregar resposta
    });

  } catch (error: any) {
    console.error('[IMPORT COTISTAS] ❌ EXCEPTION:', error);
    console.error('[IMPORT COTISTAS] Stack:', error.stack);
    
    // SEMPRE retornar JSON, não importa o erro
    return NextResponse.json({
      success: false,
      error: error?.message || String(error) || "Erro desconhecido ao processar arquivo"
    }, { 
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  }
}
