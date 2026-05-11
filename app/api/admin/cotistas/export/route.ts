import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/security/admin-auth";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";
export const maxDuration = 60;

const CSV_HEADERS = [
  "ID",
  "Código",
  "Razão Social",
  "CPF/CNPJ",
  "Telefone",
  "Telefone 2",
  "Endereço Principal",
  "Cidade",
  "Estado",
  "Status",
  "Criado em",
  "Atualizado em",
];

function csvCell(value: unknown): string {
  if (value === null || value === undefined) return "";
  const text = String(value).replace(/\r?\n/g, " ").trim();
  if (/[;"\r\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function formatCsvDate(value: unknown): string {
  if (!value) return "";
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return String(value);

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "America/Sao_Paulo",
  }).format(date);
}

function applyCotistaFilters(query: any, search: string, status: string) {
  const trimmedSearch = search.trim();
  const searchDigits = trimmedSearch.replace(/[^0-9]/g, "");

  if (trimmedSearch) {
    const isNumericSearch = /^\d+$/.test(trimmedSearch);

    if (isNumericSearch && searchDigits.length <= 4) {
      query = query.eq("codigo", trimmedSearch);
    } else {
      const safeSearch = trimmedSearch.replace(/[(),]/g, " ");
      const ors: string[] = [`razao_social.ilike.%${safeSearch}%`];

      if (searchDigits.length >= 3) {
        ors.push(`cnpj_cpf.ilike.%${searchDigits}%`);
      }

      query = query.or(ors.join(","));
    }
  }

  if (status === "ativo") {
    query = query.eq("ativo", true);
  } else if (status === "inativo") {
    query = query.eq("ativo", false);
  }

  return query;
}

async function fetchCotistasForExport(search: string, status: string) {
  const pageSize = 1000;
  let from = 0;
  const rows: any[] = [];

  while (true) {
    const to = from + pageSize - 1;
    let query = supabaseAdmin
      .from("cotistas")
      .select(
        "id,codigo,razao_social,cnpj_cpf,telefone,telefone_2,endereco_principal,cidade,estado,ativo,created_at,updated_at"
      )
      .order("razao_social", { ascending: true })
      .range(from, to);

    query = applyCotistaFilters(query, search, status);

    const { data, error } = await query;
    if (error) throw error;

    const chunk = Array.isArray(data) ? data : [];
    rows.push(...chunk);

    if (chunk.length < pageSize) break;
    from += pageSize;
  }

  return rows;
}

export async function GET(request: NextRequest) {
  try {
    const authError = await requireAdminAuth(request);
    if (authError) return authError;

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";

    const cotistas = await fetchCotistasForExport(search, status);
    const csvRows = cotistas.map((row) =>
      [
        row.id,
        row.codigo,
        row.razao_social,
        row.cnpj_cpf,
        row.telefone,
        row.telefone_2,
        row.endereco_principal,
        row.cidade,
        row.estado,
        row.ativo ? "Ativo" : "Inativo",
        formatCsvDate(row.created_at),
        formatCsvDate(row.updated_at),
      ]
        .map(csvCell)
        .join(";")
    );

    const csv = `\uFEFF${CSV_HEADERS.map(csvCell).join(";")}\n${csvRows.join("\n")}`;
    const today = new Date().toISOString().slice(0, 10);

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="cotistas-${today}.csv"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error: any) {
    console.error("[EXPORT COTISTAS] Erro:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Erro ao exportar cotistas" },
      { status: 500 }
    );
  }
}
