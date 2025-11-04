export interface Distribuidor {
  id: string;
  nome: string;
  application_token: string;
  company_token: string;
  base_url: string;
  ativo: boolean;
  ultima_sincronizacao: string | null;
  total_produtos: number;
  created_at: string;
  updated_at: string;
}

export interface MercosProduto {
  id: number;
  codigo: string;
  nome: string;
  preco_tabela: number;
  saldo_estoque: number;
  categoria_id: number | null;
  ativo: boolean;
  excluido: boolean;
  unidade: string | null;
  observacoes: string | null;
  ultima_alteracao: string;
  comissao: number | null;
  ipi: number | null;
  tipo_ipi: string | null;
  st: number | null;
  moeda: string;
  multiplo: number | null;
  peso_bruto: number | null;
  largura: number | null;
  altura: number | null;
  comprimento: number | null;
  codigo_ncm: string | null;
  exibir_no_b2b: boolean;
  produtos_grade?: MercosProdutoGrade[];
}

export interface MercosProdutoGrade {
  id: number;
  codigo: string;
  ativo: boolean;
  excluido: boolean;
  preco_tabela?: number;
}

export interface MercosCategoria {
  id: number;
  nome: string;
  categoria_pai_id: number | null;
  excluido: boolean;
  ultima_alteracao: string;
}

export interface MercosImagemProduto {
  produto_id: number;
  ordem: number;
  imagem_url?: string;
  imagem_base64?: string;
}

export interface MercosSyncResult {
  success: boolean;
  produtos_novos: number;
  produtos_atualizados: number;
  produtos_total: number;
  erros: string[];
  ultima_sincronizacao: string;
}

export interface MercosApiResponse<T> {
  data: T;
  limitou_registros?: boolean;
  qtde_total_registros?: number;
  requisicoes_extras?: number;
}

export interface MercosThrottleError {
  tempo_ate_permitir_novamente: number;
  limite_de_requisicoes: number;
}

export interface MercosError {
  status?: number;
  message: string;
  details?: string;
  code?: string;
  timestamp?: string;
}
