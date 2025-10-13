import type { MercosProduto, MercosCategoria, MercosThrottleError } from '@/types/distribuidor';

interface MercosConfig {
  applicationToken: string;
  companyToken: string;
  baseUrl?: string;
}

export class MercosAPI {
  private config: MercosConfig;
  private baseUrl: string;

  constructor(config: MercosConfig) {
    this.config = config;
    this.baseUrl = config.baseUrl || 'https://app.mercos.com/api/v1';
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers = {
      'ApplicationToken': this.config.applicationToken,
      'CompanyToken': this.config.companyToken,
      'Content-Type': 'application/json',
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Tratamento de throttling (429)
      if (response.status === 429) {
        const throttleError: MercosThrottleError = await response.json();
        const waitTime = throttleError.tempo_ate_permitir_novamente * 1000;
        
        console.log(`Throttling detectado. Aguardando ${throttleError.tempo_ate_permitir_novamente}s...`);
        
        await new Promise(resolve => setTimeout(resolve, waitTime));
        
        // Tentar novamente
        return this.request<T>(endpoint, options);
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro Mercos API: ${response.status} - ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro na requisição Mercos:', error);
      throw error;
    }
  }

  /**
   * Busca produtos com paginação automática
   */
  async getAllProdutos(alteradoApos?: string): Promise<MercosProduto[]> {
    let allProdutos: MercosProduto[] = [];
    let dataInicial = alteradoApos || '2020-01-01T00:00:00';
    let hasMore = true;

    while (hasMore) {
      const endpoint = `/produtos?alterado_apos=${dataInicial}`;
      
      // Fazer requisição e capturar headers
      const url = `${this.baseUrl}${endpoint}`;
      const headers = {
        'ApplicationToken': this.config.applicationToken,
        'CompanyToken': this.config.companyToken,
        'Content-Type': 'application/json',
      };

      const response = await fetch(url, { headers });

      // Tratamento de throttling
      if (response.status === 429) {
        const throttleError = await response.json();
        const waitTime = throttleError.tempo_ate_permitir_novamente * 1000;
        
        console.log(`Throttling detectado. Aguardando ${throttleError.tempo_ate_permitir_novamente}s...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue; // Tentar novamente
      }

      if (!response.ok) {
        throw new Error(`Erro Mercos API: ${response.status}`);
      }

      const produtos = await response.json();
      const produtosArray = Array.isArray(produtos) ? produtos : [];
      allProdutos = [...allProdutos, ...produtosArray];

      // CORREÇÃO CRÍTICA: Verificar headers corretamente
      const limitouRegistros = response.headers.get('MEUSPEDIDOS_LIMITOU_REGISTROS') === '1';
      
      console.log(`[PAGINAÇÃO] Produtos recebidos: ${produtosArray.length}`);
      console.log(`[PAGINAÇÃO] Header limitou: ${response.headers.get('MEUSPEDIDOS_LIMITOU_REGISTROS')}`);
      console.log(`[PAGINAÇÃO] Requisições extras: ${response.headers.get('MEUSPEDIDOS_REQUISICOES_EXTRAS')}`);
      
      if (limitouRegistros && produtosArray.length > 0) {
        // Usar a última alteração do último produto para próxima requisição
        const ultimoProduto = produtosArray[produtosArray.length - 1];
        dataInicial = ultimoProduto.ultima_alteracao;
        
        console.log(`[PAGINAÇÃO] Próxima página com alterado_apos: ${dataInicial}`);
        console.log(`[PAGINAÇÃO] Total acumulado: ${allProdutos.length} produtos`);
      } else {
        hasMore = false;
        console.log(`[PAGINAÇÃO] ✅ Paginação concluída. Total: ${allProdutos.length} produtos`);
      }
    }

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
    let allCategorias: MercosCategoria[] = [];
    let dataInicial = '2020-01-01T00:00:00';
    let hasMore = true;

    while (hasMore) {
      const endpoint = `/categorias?alterado_apos=${dataInicial}`;
      
      // Fazer requisição e capturar headers
      const url = `${this.baseUrl}${endpoint}`;
      const headers = {
        'ApplicationToken': this.config.applicationToken,
        'CompanyToken': this.config.companyToken,
        'Content-Type': 'application/json',
      };

      const response = await fetch(url, { headers });

      // Tratamento de throttling
      if (response.status === 429) {
        const throttleError = await response.json();
        const waitTime = throttleError.tempo_ate_permitir_novamente * 1000;
        
        console.log(`Throttling detectado. Aguardando ${throttleError.tempo_ate_permitir_novamente}s...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }

      if (!response.ok) {
        throw new Error(`Erro Mercos API: ${response.status}`);
      }

      const categorias = await response.json();
      const categoriasArray = Array.isArray(categorias) ? categorias : [];
      allCategorias = [...allCategorias, ...categoriasArray];

      // CORREÇÃO CRÍTICA: Verificar headers corretamente
      const limitouRegistros = response.headers.get('MEUSPEDIDOS_LIMITOU_REGISTROS') === '1';
      
      if (limitouRegistros && categoriasArray.length > 0) {
        const ultimaCategoria = categoriasArray[categoriasArray.length - 1];
        dataInicial = ultimaCategoria.ultima_alteracao;
        console.log(`[CATEGORIAS] Próxima página com alterado_apos: ${dataInicial}`);
      } else {
        hasMore = false;
        console.log(`[CATEGORIAS] ✅ Paginação concluída. Total: ${allCategorias.length} categorias`);
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
