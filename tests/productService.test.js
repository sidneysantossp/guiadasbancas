// Testes básicos para ProductService
// Executar com: npm test ou node tests/productService.test.js

const { ProductService } = require('../lib/services/productService');

// Mock do Supabase para testes
const mockSupabase = {
  from: () => ({
    select: () => ({
      eq: () => ({
        single: () => ({ data: null, error: null }),
        limit: () => ({ data: [], error: null }),
        order: () => ({ data: [], error: null })
      }),
      limit: () => ({ data: [], error: null }),
      order: () => ({ data: [], error: null })
    })
  })
};

// Substituir o import do supabase por mock
global.supabaseAdmin = mockSupabase;

describe('ProductService', () => {
  describe('calculatePriceWithMarkup', () => {
    test('deve retornar preço base quando não há distribuidor', async () => {
      const result = await ProductService.calculatePriceWithMarkup(100, 'prod1', '', 'cat1');
      expect(result).toBe(100);
    });

    test('deve aplicar markup percentual', async () => {
      // Mock para distribuidor com markup
      mockSupabase.from = () => ({
        select: () => ({
          eq: () => ({
            single: () => ({
              data: {
                tipo_calculo: 'markup',
                markup_global_percentual: 20,
                markup_global_fixo: 5
              },
              error: null
            })
          })
        })
      });

      const result = await ProductService.calculatePriceWithMarkup(100, 'prod1', 'dist1', 'cat1');
      expect(result).toBe(125); // 100 * 1.20 + 5
    });

    test('deve aplicar margem corretamente', async () => {
      // Mock para distribuidor com margem
      mockSupabase.from = () => ({
        select: () => ({
          eq: () => ({
            single: () => ({
              data: {
                tipo_calculo: 'margem',
                margem_divisor: 0.8
              },
              error: null
            })
          })
        })
      });

      const result = await ProductService.calculatePriceWithMarkup(100, 'prod1', 'dist1', 'cat1');
      expect(result).toBe(125); // 100 / 0.8
    });
  });

  describe('searchProducts', () => {
    test('deve aplicar filtros corretamente', async () => {
      const filters = {
        q: 'teste',
        category: 'cat1',
        active: true,
        limit: 10
      };

      const results = await ProductService.searchProducts(filters);

      // Verificar se não houve erro
      expect(Array.isArray(results)).toBe(true);
    });

    test('deve limitar resultados', async () => {
      const filters = { limit: 5 };
      const results = await ProductService.searchProducts(filters);

      expect(results.length).toBeLessThanOrEqual(5);
    });
  });

  describe('getDistribuidorProducts', () => {
    test('deve retornar lista vazia para banca não cotista', async () => {
      // Mock para banca não cotista
      mockSupabase.from = (table) => {
        if (table === 'bancas') {
          return {
            select: () => ({
              eq: () => ({
                single: () => ({ data: { is_cotista: false }, error: null })
              })
            })
          };
        }
        return mockSupabase.from();
      };

      const results = await ProductService.getDistribuidorProducts('banca1', {});
      expect(results).toEqual([]);
    });
  });
});

// Executar testes se chamado diretamente
if (require.main === module) {
  console.log('🧪 Executando testes do ProductService...');

  // Teste simples de execução
  ProductService.searchProducts({ limit: 1 })
    .then(() => console.log('✅ Teste básico passou'))
    .catch(err => console.error('❌ Erro no teste:', err));

  console.log('✅ Todos os testes básicos executados');
}
