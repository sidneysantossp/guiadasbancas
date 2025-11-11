import type { MercosProduto, MercosCategoria, MercosThrottleError, MercosError } from '@/types/distribuidor';

interface MercosConfig {
  applicationToken: string;
  companyToken: string;
  baseUrl?: string;
  maxRetries?: number;
  retryDelay?: number;
}

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

const DEFAULT_MAX_RETRIES = 3;
const DEFAULT_RETRY_DELAY = 1000; // 1 segundo
const MAX_RETRY_DELAY = 30000; // 30 segundos

export class MercosAPI {
  private config: Required<MercosConfig>;
  private baseUrl: string;
  private requestQueue: Array<() => Promise<void>> = [];
  private isProcessingQueue = false;

  constructor(config: MercosConfig) {
    this.config = {
      baseUrl: 'https://app.mercos.com/api/v1',
      maxRetries: DEFAULT_MAX_RETRIES,
      retryDelay: DEFAULT_RETRY_DELAY,
      ...config,
    };
    this.baseUrl = this.config.baseUrl.endsWith('/')
      ? this.config.baseUrl.slice(0, -1)
      : this.config.baseUrl;
  }

  async getBatchProdutosByAlteracao(params: {
    alteradoApos: string | null;
    afterId?: number | null;
    limit?: number;
    orderDirection?: 'asc' | 'desc';
  }): Promise<{ produtos: MercosProduto[]; limited: boolean }> {
    const { alteradoApos, afterId = null, limit = 200, orderDirection = 'asc' } = params;

    const qp = new URLSearchParams();
    if (alteradoApos) qp.append('alterado_apos', alteradoApos);
    qp.append('limit', Math.min(limit, 200).toString());
    if (afterId) qp.append('id_maior_que', afterId.toString());
    qp.append('order_by', 'ultima_alteracao');
    qp.append('order_direction', orderDirection);

    const endpoint = `/produtos?${qp.toString()}`;
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'ApplicationToken': this.config.applicationToken,
      'CompanyToken': this.config.companyToken,
      'Content-Type': 'application/json',
    } as Record<string, string>;

    while (true) {
      const response = await fetch(url, { headers });
      if (response.status === 429) {
        const throttleError = await response.json().catch(() => ({ tempo_ate_permitir_novamente: 5 }));
        const waitTime = (throttleError.tempo_ate_permitir_novamente || 5) * 1000;
        await new Promise(r => setTimeout(r, waitTime));
        continue;
      }
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro Mercos API: ${response.status} - ${errorText}`);
      }

      const raw = await response.json();
      const data = (raw && typeof raw === 'object' && 'data' in raw && Array.isArray(raw.data)) ? raw.data : raw;
      const produtos: MercosProduto[] = Array.isArray(data) ? data : [];
      const limited = response.headers.get('MEUSPEDIDOS_LIMITOU_REGISTROS') === '1';
      return { produtos, limited };
    }
  }

  /**
   * Realiza uma requisição com tratamento de erros e retentativas
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    attempt = 1
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers = new Headers({
      'ApplicationToken': this.config.applicationToken,
      'CompanyToken': this.config.companyToken,
      'Content-Type': 'application/json',
      ...options.headers,
    });

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Tratamento de throttling (429)
      if (response.status === 429) {
        const throttleError: MercosThrottleError = await response.json().catch(() => ({
          tempo_ate_permitir_novamente: 5, // Valor padrão de 5 segundos
        }));
        
        const waitTime = (throttleError.tempo_ate_permitir_novamente || 5) * 1000;
        console.warn(`[MercosAPI] Throttling detectado. Aguardando ${waitTime / 1000}s...`);
        
        await this.delay(waitTime);
        return this.request<T>(endpoint, options, attempt);
      }

      // Se for um erro de servidor (5xx), tenta novamente
      if (response.status >= 500) {
        throw new Error(`Erro do servidor: ${response.status} ${response.statusText}`);
      }

      // Se for um erro de cliente (4xx), não tenta novamente
      if (response.status >= 400) {
        const errorText = await response.text();
        const error: MercosError = {
          status: response.status,
          message: `Erro na requisição: ${response.statusText}`,
          details: errorText,
        };
        throw error;
      }

      // Tenta fazer o parse da resposta como JSON
      try {
        return await response.json();
      } catch (e) {
        // Se não for possível fazer o parse, retorna o texto da resposta
        return response.text() as unknown as T;
      }
    } catch (error) {
      // Se for um erro de rede ou timeout, tenta novamente
      if (this.isRetryableError(error) && attempt <= this.config.maxRetries) {
        const delay = this.calculateBackoff(attempt);
        console.warn(`[MercosAPI] Tentativa ${attempt}/${this.config.maxRetries} falhou. Tentando novamente em ${delay}ms...`, error);
        
        await this.delay(delay);
        return this.request<T>(endpoint, options, attempt + 1);
      }

      // Se excedeu o número de tentativas ou não for um erro de rede, propaga o erro
      console.error(`[MercosAPI] Erro na requisição após ${attempt} tentativas:`, error);
      throw error;
    }
  }

  /**
   * Verifica se um erro é recuperável
   */
  private isRetryableError(error: unknown): boolean {
    // Erros de rede são sempre recuperáveis
    if (error instanceof TypeError && error.message.includes('fetch failed')) {
      return true;
    }
    
    // Timeouts e erros de conexão
    if (error instanceof Error && (
      error.message.includes('network timeout') ||
      error.message.includes('ECONNREFUSED') ||
      error.message.includes('ETIMEDOUT')
    )) {
      return true;
    }
    
    // Erros 5xx do servidor
    if (typeof error === 'object' && error !== null && 'status' in error) {
      const status = (error as { status?: number }).status;
      return status !== undefined && status >= 500;
    }
    
    return false;
  }

  /**
   * Calcula o tempo de espera para a próxima tentativa usando backoff exponencial
   */
  private calculateBackoff(attempt: number): number {
    const baseDelay = this.config.retryDelay || DEFAULT_RETRY_DELAY;
    const backoff = Math.min(
      baseDelay * Math.pow(2, attempt - 1),
      MAX_RETRY_DELAY
    );
    // Adiciona um jitter aleatório para evitar thundering herd
    const jitter = Math.random() * 1000;
    return backoff + jitter;
  }

  /**
   * Adiciona um atraso assíncrono
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Busca um lote de produtos com paginação
   */
  async getBatchProdutos(params: {
    limit?: number;
    afterId?: number | null;
    alteradoApos?: string | null;
    orderBy?: 'id' | 'ultima_alteracao';
    orderDirection?: 'asc' | 'desc';
  } = {}): Promise<MercosProduto[]> {
    const { 
      limit = 100, 
      afterId = null, 
      alteradoApos = null,
      orderBy = 'id',
      orderDirection = 'asc',
    } = params;
    
    const queryParams = new URLSearchParams();

    // Adiciona filtro de alteração mínima se fornecido
    if (alteradoApos) {
      queryParams.append('alterado_apos', alteradoApos);
    }

    // Adiciona limite de resultados
    queryParams.append('limit', Math.min(limit, 200).toString()); // Limita a 200 itens por página

    // Adiciona ID maior que se fornecido
    if (afterId) {
      queryParams.append('id_maior_que', afterId.toString());
    }

    // Adiciona ordenação
    queryParams.append('order_by', orderBy);
    queryParams.append('order_direction', orderDirection);

    const endpoint = `/produtos?${queryParams.toString()}`;
    
    console.log(`[MercosAPI] Buscando produtos com parâmetros:`, {
      limit,
      afterId,
      alteradoApos,
      orderBy,
      orderDirection,
      endpoint
    });
    
    try {
      const raw = await this.request<any>(
        endpoint,
        { method: 'GET' }
      );

      // Desembrulhar envelope comum da Mercos { data, qtde_total_registros, ... }
      const response = (raw && typeof raw === 'object' && 'data' in raw && Array.isArray(raw.data))
        ? (raw.data as MercosProduto[])
        : raw;

      console.log(`[MercosAPI] Resposta recebida:`, {
        tipo: Array.isArray(response) ? 'array' : typeof response,
        tamanho: Array.isArray(response) ? response.length : 1,
        primeiroItem: Array.isArray(response) ? response[0] : response
      });

      // Garante que sempre retornamos um array
      if (!response) {
        console.log('[MercosAPI] Nenhum produto retornado na resposta');
        return [];
      }
      
      const produtos = Array.isArray(response) ? response as MercosProduto[] : [response as MercosProduto];
      console.log(`[MercosAPI] Retornando ${produtos.length} produtos`);
      
      // Log detalhado do primeiro produto para verificar a estrutura
      if (produtos.length > 0) {
        console.log('[MercosAPI] Exemplo de produto recebido:', {
          id: produtos[0].id,
          nome: produtos[0].nome,
          preco: produtos[0].preco_tabela,
          estoque: produtos[0].saldo_estoque,
          ativo: produtos[0].ativo,
          excluido: produtos[0].excluido,
          ultima_alteracao: produtos[0].ultima_alteracao
        });
      }
      
      return produtos;
    } catch (error) {
      console.error('[MercosAPI] Erro ao buscar lote de produtos:', error);
      throw error;
    }
  }

  /**
   * Busca todos os produtos com paginação automática
   */
  async *getAllProdutosGenerator(params: {
    batchSize?: number;
    alteradoApos?: string | null;
  } = {}): AsyncGenerator<MercosProduto[], void, void> {
    const { batchSize = 100, alteradoApos = null } = params;
    let lastId: number | null = null;
    let hasMore = true;

    while (hasMore) {
      try {
        const produtos = await this.getBatchProdutos({
          limit: batchSize,
          afterId: lastId,
          alteradoApos,
        });

        if (produtos.length === 0) {
          hasMore = false;
          return;
        }

        // Ordena por ID para garantir a ordem correta na paginação
        produtos.sort((a, b) => a.id - b.id);
        const newestId = produtos[produtos.length - 1].id;

        // Guarda para evitar loop infinito quando a API ignora o parâmetro de paginação
        if (lastId !== null && newestId <= lastId) {
          console.warn('[MercosAPI] Página retornou último ID não crescente; interrompendo paginação para evitar loop. lastId=', lastId, ' new=', newestId);
          yield produtos;
          return;
        }

        lastId = newestId;
        
        yield produtos;
        
        // Se recebemos menos itens que o solicitado, chegamos ao final
        if (produtos.length < batchSize) {
          hasMore = false;
        }
      } catch (error) {
        console.error('[MercosAPI] Erro ao buscar produtos:', error);
        throw error;
      }
    }
  }

  /**
   * Busca todos os produtos com paginação automática
   * @deprecated Use getBatchProdutos para melhor controle de paginação
   */
  async getAllProdutos(alteradoApos?: string): Promise<MercosProduto[]> {
    let allProdutos: MercosProduto[] = [];
    let lastId: number | null = null;
    let lastDate = alteradoApos || '2020-01-01T00:00:00';
    let hasMore = true;
    const batchSize = 100; // Tamanho do lote para cada requisição

    console.log(`[MERCOS] Iniciando busca de produtos a partir de ${lastDate}`);

    while (hasMore) {
      try {
        const produtos = await this.getBatchProdutos({
          limit: batchSize,
          afterId: lastId,
          alteradoApos: lastDate
        });

        console.log(`[MERCOS] Recebidos ${produtos.length} produtos no lote`);

        if (produtos.length === 0) {
          hasMore = false;
          console.log(`[MERCOS] Nenhum produto retornado, finalizando paginação`);
          break;
        }

        // Adiciona os produtos ao resultado
        allProdutos = [...allProdutos, ...produtos];

        // Atualiza o último ID e data para a próxima página
        const ultimoProduto = produtos[produtos.length - 1];
        lastId = ultimoProduto.id;
        lastDate = ultimoProduto.ultima_alteracao || lastDate;

        // Se recebemos menos itens que o tamanho do lote, não há mais itens
        if (produtos.length < batchSize) {
          hasMore = false;
          console.log(`[MERCOS] Menos itens que o tamanho do lote, finalizando paginação`);
        }

        console.log(`[MERCOS] Total acumulado: ${allProdutos.length} produtos`);

      } catch (error) {
        console.error('[MERCOS] Erro ao buscar produtos:', error);
        hasMore = false; // Interrompe em caso de erro
        throw error;
      }
    }

    console.log(`[MERCOS] ✅ Busca de produtos concluída. Total: ${allProdutos.length} produtos`);
    return allProdutos;
  }

  /**
   * Busca produto específico por ID
   */
  async getProduto(id: number): Promise<MercosProduto> {
    return this.request<MercosProduto>(`/produtos/${id}`);
  }

  /**
   * Busca todas as categorias
   */
  async getAllCategorias(): Promise<MercosCategoria[]> {
    console.log('[MERCOS-API] getAllCategorias - Iniciando busca de categorias');
    console.log('[MERCOS-API] ApplicationToken:', this.config.applicationToken?.substring(0, 20) + '...');
    console.log('[MERCOS-API] CompanyToken:', this.config.companyToken?.substring(0, 20) + '...');
    
    let allCategorias: MercosCategoria[] = [];
    let dataInicial = '2020-01-01T00:00:00';
    let hasMore = true;

    while (hasMore) {
      const endpoint = `/categorias?alterado_apos=${dataInicial}`;
      console.log('[MERCOS-API] Buscando:', `${this.baseUrl}${endpoint}`);
      
      // Fazer requisição e capturar headers
      const url = `${this.baseUrl}${endpoint}`;
      const headers = {
        'ApplicationToken': this.config.applicationToken,
        'CompanyToken': this.config.companyToken,
        'Content-Type': 'application/json',
      };

      console.log('[MERCOS-API] Headers sendo enviados:', {
        'ApplicationToken': headers['ApplicationToken']?.substring(0, 20) + '...',
        'CompanyToken': headers['CompanyToken']?.substring(0, 20) + '...',
      });

      const response = await fetch(url, { headers });

      console.log('[MERCOS-API] Response status:', response.status);
      console.log('[MERCOS-API] Response headers:', Object.fromEntries(response.headers.entries()));

      // Tratamento de throttling
      if (response.status === 429) {
        const throttleError = await response.json();
        const waitTime = throttleError.tempo_ate_permitir_novamente * 1000;
        
        console.log(`[MERCOS-API] Throttling detectado. Aguardando ${throttleError.tempo_ate_permitir_novamente}s...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[MERCOS-API] ❌ Erro na resposta:', errorText);
        throw new Error(`Erro Mercos API: ${response.status} - ${errorText}`);
      }

      const categorias = await response.json();
      const categoriasArray = Array.isArray(categorias) ? categorias : [];
      allCategorias = [...allCategorias, ...categoriasArray];

      console.log(`[MERCOS-API] Recebidas ${categoriasArray.length} categorias nesta página`);

      // CORREÇÃO CRÍTICA: Verificar headers corretamente
      const limitouRegistros = response.headers.get('MEUSPEDIDOS_LIMITOU_REGISTROS') === '1';
      
      if (limitouRegistros && categoriasArray.length > 0) {
        const ultimaCategoria = categoriasArray[categoriasArray.length - 1];
        dataInicial = ultimaCategoria.ultima_alteracao;
        console.log(`[MERCOS-API] Próxima página com alterado_apos: ${dataInicial}`);
      } else {
        hasMore = false;
        console.log(`[MERCOS-API] ✅ Paginação concluída. Total: ${allCategorias.length} categorias`);
      }
    }

    return allCategorias;
  }

  /**
   * Testa a conexão com a API
   */
  async testConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      // Tentar buscar produtos como teste (mais confiável)
      const response = await this.request<any>('/produtos?limit=1');
      return { success: true };
    } catch (error: any) {
      console.error('Erro ao testar conexão Mercos:', error);
      return { 
        success: false, 
        error: error.message || 'Erro desconhecido' 
      };
    }
  }
}
