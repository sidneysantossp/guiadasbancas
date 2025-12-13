"use client";

import { useState, useEffect } from "react";
import {
  IconPercentage,
  IconCurrencyReal,
  IconPlus,
  IconTrash,
  IconDeviceFloppy,
  IconAlertCircle,
  IconCheck,
  IconSearch,
  IconCategory,
  IconPackage,
  IconInfoCircle,
} from "@tabler/icons-react";

type MarkupCategoria = {
  id?: string;
  category_id: string;
  category_name: string;
  markup_percentual: number;
  markup_fixo: number;
};

type MarkupProduto = {
  id?: string;
  product_id: string;
  product_name: string;
  product_codigo: string;
  markup_percentual: number;
  markup_fixo: number;
};

type CategoriaDisponivel = {
  id: string;
  name: string;
};

export default function MarkupConfigPage() {
  const [distribuidor, setDistribuidor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Markup global
  const [globalPercentual, setGlobalPercentual] = useState(0);
  const [globalFixo, setGlobalFixo] = useState(0);
  const [globalMargem, setGlobalMargem] = useState(0);
  const [globalDivisor, setGlobalDivisor] = useState(1);
  const [tipoCalculo, setTipoCalculo] = useState<'markup' | 'margem'>('markup');

  // Markups por categoria
  const [markupCategorias, setMarkupCategorias] = useState<MarkupCategoria[]>([]);
  const [categoriasDisponiveis, setCategoriasDisponiveis] = useState<CategoriaDisponivel[]>([]);
  const [selectedCategoria, setSelectedCategoria] = useState("");
  const [newCatPercentual, setNewCatPercentual] = useState(0);
  const [newCatFixo, setNewCatFixo] = useState(0);

  // Markups por produto
  const [markupProdutos, setMarkupProdutos] = useState<MarkupProduto[]>([]);
  const [searchProduto, setSearchProduto] = useState("");
  const [produtosEncontrados, setProdutosEncontrados] = useState<any[]>([]);
  const [selectedProduto, setSelectedProduto] = useState<any>(null);
  const [newProdPercentual, setNewProdPercentual] = useState(0);
  const [newProdFixo, setNewProdFixo] = useState(0);

  useEffect(() => {
    const raw = localStorage.getItem("gb:distribuidor");
    if (raw) {
      setDistribuidor(JSON.parse(raw));
    }
  }, []);

  useEffect(() => {
    if (distribuidor?.id) {
      fetchMarkupConfig();
    }
  }, [distribuidor]);

  const fetchMarkupConfig = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/distribuidor/markup?id=${distribuidor.id}`);
      const json = await res.json();

      if (json.success) {
        setGlobalPercentual(json.data.global.markup_percentual || 0);
        setGlobalFixo(json.data.global.markup_fixo || 0);
        setGlobalMargem(json.data.global.margem_percentual || 0);
        setGlobalDivisor(json.data.global.margem_divisor || 1);
        setTipoCalculo(json.data.global.tipo_calculo || 'markup');
        setMarkupCategorias(json.data.categorias || []);
        setMarkupProdutos(json.data.produtos || []);
        setCategoriasDisponiveis(json.data.categorias_disponiveis || []);
      }
    } catch (error) {
      console.error('Erro ao buscar configurações:', error);
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const saveGlobalMarkup = async () => {
    try {
      setSaving(true);
      const res = await fetch('/api/distribuidor/markup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          distribuidor_id: distribuidor.id,
          tipo: 'global',
          tipo_calculo: tipoCalculo,
          markup_percentual: globalPercentual,
          markup_fixo: globalFixo,
          margem_percentual: globalMargem,
          margem_divisor: globalDivisor,
        }),
      });

      const json = await res.json();
      if (json.success) {
        showMessage('success', 'Configuração salva com sucesso!');
        fetchMarkupConfig();
      } else {
        showMessage('error', json.error || 'Erro ao salvar');
      }
    } catch (error) {
      showMessage('error', 'Erro ao salvar configuração');
    } finally {
      setSaving(false);
    }
  };

  const addCategoriaMarkup = async () => {
    if (!selectedCategoria) return;

    try {
      setSaving(true);
      const res = await fetch('/api/distribuidor/markup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          distribuidor_id: distribuidor.id,
          tipo: 'categoria',
          category_id: selectedCategoria,
          markup_percentual: newCatPercentual,
          markup_fixo: newCatFixo,
        }),
      });

      const json = await res.json();
      if (json.success) {
        showMessage('success', 'Markup da categoria salvo!');
        setSelectedCategoria("");
        setNewCatPercentual(0);
        setNewCatFixo(0);
        fetchMarkupConfig();
      } else {
        showMessage('error', json.error || 'Erro ao salvar');
      }
    } catch (error) {
      showMessage('error', 'Erro ao salvar markup da categoria');
    } finally {
      setSaving(false);
    }
  };

  const deleteCategoriaMarkup = async (id: string) => {
    try {
      const res = await fetch(`/api/distribuidor/markup?tipo=categoria&id=${id}`, {
        method: 'DELETE',
      });

      const json = await res.json().catch(() => ({} as any));
      if (!res.ok || json?.success === false) {
        showMessage('error', json?.error || 'Erro ao remover markup');
        return;
      }

      showMessage('success', 'Markup removido!');
      fetchMarkupConfig();
    } catch (error) {
      showMessage('error', 'Erro ao remover markup');
    }
  };

  const searchProducts = async (termo?: string) => {
    const searchTerm = termo ?? searchProduto;
    if (!searchTerm || searchTerm.length < 2) {
      setProdutosEncontrados([]);
      return;
    }

    try {
      const res = await fetch(`/api/distribuidor/products?id=${distribuidor.id}&search=${searchTerm}&limit=20`);
      const json = await res.json();

      if (json.success) {
        setProdutosEncontrados(json.data || []);
      }
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    }
  };

  // Busca automática com debounce ao digitar
  useEffect(() => {
    if (!distribuidor?.id || !searchProduto || searchProduto.length < 2) {
      setProdutosEncontrados([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/distribuidor/products?id=${distribuidor.id}&search=${searchProduto}&limit=20`);
        const json = await res.json();
        if (json.success) {
          setProdutosEncontrados(json.data || []);
        }
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      }
    }, 300); // 300ms de debounce

    return () => clearTimeout(timer);
  }, [searchProduto, distribuidor?.id]);

  const addProdutoMarkup = async () => {
    if (!selectedProduto) return;

    try {
      setSaving(true);
      const res = await fetch('/api/distribuidor/markup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          distribuidor_id: distribuidor.id,
          tipo: 'produto',
          product_id: selectedProduto.id,
          markup_percentual: newProdPercentual,
          markup_fixo: newProdFixo,
        }),
      });

      const json = await res.json();
      if (json.success) {
        showMessage('success', 'Markup do produto salvo!');
        setSelectedProduto(null);
        setSearchProduto("");
        setProdutosEncontrados([]);
        setNewProdPercentual(0);
        setNewProdFixo(0);
        fetchMarkupConfig();
      } else {
        showMessage('error', json.error || 'Erro ao salvar');
      }
    } catch (error) {
      showMessage('error', 'Erro ao salvar markup do produto');
    } finally {
      setSaving(false);
    }
  };

  const deleteProdutoMarkup = async (id: string) => {
    try {
      const res = await fetch(`/api/distribuidor/markup?tipo=produto&id=${id}`, {
        method: 'DELETE',
      });

      const json = await res.json().catch(() => ({} as any));
      if (!res.ok || json?.success === false) {
        showMessage('error', json?.error || 'Erro ao remover markup');
        return;
      }

      showMessage('success', 'Markup removido!');
      fetchMarkupConfig();
    } catch (error) {
      showMessage('error', 'Erro ao remover markup');
    }
  };

  const formatPrice = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  // Cálculo de preço final
  const calcularPrecoFinal = (precoBase: number, percentual: number, fixo: number) => {
    return precoBase * (1 + percentual / 100) + fixo;
  };

  // Cálculo com margem (divisor)
  const calcularPrecoComMargem = (precoBase: number, divisor: number) => {
    if (divisor <= 0 || divisor >= 1) return precoBase;
    return precoBase / divisor;
  };

  // Calcula divisor a partir da margem percentual
  const calcularDivisorDaMargem = (margem: number) => {
    if (margem <= 0 || margem >= 100) return 1;
    return 1 - (margem / 100);
  };

  // Quando margem muda, atualiza o divisor automaticamente
  const handleMargemChange = (valor: number) => {
    setGlobalMargem(valor);
    if (valor > 0 && valor < 100) {
      setGlobalDivisor(Number((1 - valor / 100).toFixed(2)));
    }
  };

  // Quando divisor muda, atualiza a margem automaticamente
  const handleDivisorChange = (valor: number) => {
    setGlobalDivisor(valor);
    if (valor > 0 && valor < 1) {
      setGlobalMargem(Number(((1 - valor) * 100).toFixed(1)));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configuração de Markup</h1>
        <p className="text-gray-600 mt-1">
          Defina a margem de lucro que será adicionada aos seus preços quando exibidos para os jornaleiros.
        </p>
      </div>

      {/* Mensagem de feedback */}
      {message && (
        <div className={`p-4 rounded-lg flex items-center gap-2 ${
          message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {message.type === 'success' ? <IconCheck size={20} /> : <IconAlertCircle size={20} />}
          {message.text}
        </div>
      )}

      {/* Explicação */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <IconInfoCircle className="text-blue-600 flex-shrink-0" size={24} />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Como funciona o markup:</p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Markup Global:</strong> Aplicado a todos os produtos que não têm markup específico</li>
              <li><strong>Markup por Categoria:</strong> Sobrescreve o global para produtos da categoria</li>
              <li><strong>Markup por Produto:</strong> Tem prioridade máxima, sobrescreve categoria e global</li>
              <li>O jornaleiro pode customizar o preço final se desejar</li>
            </ul>
            <p className="mt-2">
              <strong>Exemplo:</strong> Preço base R$ 100,00 + 30% markup = R$ 130,00 para o jornaleiro
            </p>
          </div>
        </div>
      </div>

      {/* Configuração de Preços Global */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <IconPercentage className="text-blue-600" size={24} />
          Configuração Global de Preços
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Escolha o método de cálculo e configure os valores. Esta configuração será aplicada a todos os produtos.
        </p>

        {/* Toggle de método */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTipoCalculo('margem')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
              tipoCalculo === 'margem'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            📊 Margem sobre Venda (Divisor)
          </button>
          <button
            onClick={() => setTipoCalculo('markup')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
              tipoCalculo === 'markup'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            ➕ Markup Simples (Adição)
          </button>
        </div>

        {/* Método: Margem sobre Venda */}
        {tipoCalculo === 'margem' && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
              <p className="font-medium text-blue-900 mb-1">Fórmula: Preço Final = Preço Base ÷ Divisor</p>
              <p className="text-blue-800">
                Para 40% de margem, use divisor 0,60. Para 50% de margem, use divisor 0,50.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Margem Desejada (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={globalMargem}
                    onChange={(e) => handleMargemChange(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ex: 40"
                    min="0"
                    max="99"
                    step="1"
                  />
                  <span className="absolute right-3 top-2.5 text-gray-500">%</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Digite a margem e o divisor será calculado</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Divisor
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={globalDivisor}
                    onChange={(e) => handleDivisorChange(parseFloat(e.target.value) || 1)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ex: 0.60"
                    min="0.01"
                    max="0.99"
                    step="0.01"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Ou digite o divisor diretamente</p>
              </div>
            </div>

            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="text-sm space-y-1">
                <p><strong>Simulação com Margem {globalMargem}%:</strong></p>
                <p>Produto de <strong>R$ 100,00</strong> ÷ {globalDivisor} = <strong className="text-green-700">{formatPrice(calcularPrecoComMargem(100, globalDivisor))}</strong></p>
                <p>Produto de <strong>R$ 50,00</strong> ÷ {globalDivisor} = <strong className="text-green-700">{formatPrice(calcularPrecoComMargem(50, globalDivisor))}</strong></p>
              </div>
            </div>
          </div>
        )}

        {/* Método: Markup Simples */}
        {tipoCalculo === 'markup' && (
          <div className="space-y-4">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm">
              <p className="font-medium text-gray-900 mb-1">Fórmula: Preço Final = Preço Base × (1 + %) + Fixo</p>
              <p className="text-gray-700">
                Adiciona um percentual e/ou valor fixo ao preço base.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Markup Percentual (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={globalPercentual}
                    onChange={(e) => setGlobalPercentual(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ex: 30"
                    min="0"
                    max="500"
                    step="0.5"
                  />
                  <span className="absolute right-3 top-2.5 text-gray-500">%</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Markup Fixo (R$)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-500">R$</span>
                  <input
                    type="number"
                    value={globalFixo}
                    onChange={(e) => setGlobalFixo(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ex: 5.00"
                    min="0"
                    step="0.10"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="text-sm space-y-1">
                <p><strong>Simulação com Markup {globalPercentual}% + {formatPrice(globalFixo)}:</strong></p>
                <p>Produto de <strong>R$ 100,00</strong> → <strong>{formatPrice(calcularPrecoFinal(100, globalPercentual, globalFixo))}</strong></p>
                <p>Produto de <strong>R$ 50,00</strong> → <strong>{formatPrice(calcularPrecoFinal(50, globalPercentual, globalFixo))}</strong></p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={saveGlobalMarkup}
            disabled={saving}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 font-medium"
          >
            <IconDeviceFloppy size={18} />
            Salvar Configuração
          </button>
        </div>
      </div>

      {/* Markup por Categoria */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <IconCategory className="text-purple-600" size={24} />
          Markup por Categoria
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Defina markups específicos para categorias. Estes sobrescrevem o markup global.
        </p>

        {/* Lista de markups de categoria existentes */}
        {markupCategorias.length > 0 && (
          <div className="mb-4 space-y-2">
            {markupCategorias.map((mc) => (
              <div key={mc.id} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div>
                  <span className="font-medium text-gray-900">{mc.category_name}</span>
                  <span className="ml-2 text-sm text-gray-600">
                    {mc.markup_percentual > 0 && `${mc.markup_percentual}%`}
                    {mc.markup_percentual > 0 && mc.markup_fixo > 0 && ' + '}
                    {mc.markup_fixo > 0 && formatPrice(mc.markup_fixo)}
                  </span>
                </div>
                <button
                  onClick={() => mc.id && deleteCategoriaMarkup(mc.id)}
                  className="p-1.5 text-red-600 hover:bg-red-100 rounded"
                >
                  <IconTrash size={18} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Adicionar novo markup de categoria */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-2">
            <select
              value={selectedCategoria}
              onChange={(e) => setSelectedCategoria(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Selecione uma categoria</option>
              {categoriasDisponiveis
                .filter(c => !markupCategorias.some(mc => mc.category_id === c.id))
                .map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
            </select>
          </div>
          <div>
            <input
              type="number"
              value={newCatPercentual}
              onChange={(e) => setNewCatPercentual(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="% markup"
              min="0"
              step="0.5"
            />
            <p className="text-xs text-gray-500 mt-1">Percentual sobre o preço base</p>
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <input
                type="number"
                value={newCatFixo}
                onChange={(e) => setNewCatFixo(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="R$ fixo"
                min="0"
                step="0.10"
              />
              <p className="text-xs text-gray-500 mt-1">Valor fixo adicional (R$)</p>
            </div>
            <button
              onClick={addCategoriaMarkup}
              disabled={!selectedCategoria || saving}
              className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 h-fit"
            >
              <IconPlus size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Markup por Produto */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <IconPackage className="text-orange-600" size={24} />
          Markup por Produto
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Defina markups específicos para produtos individuais. Estes têm a maior prioridade.
        </p>

        {/* Lista de markups de produto existentes */}
        {markupProdutos.length > 0 && (
          <div className="mb-4 space-y-2 max-h-60 overflow-y-auto">
            {markupProdutos.map((mp) => (
              <div key={mp.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div>
                  <span className="font-medium text-gray-900">{mp.product_name}</span>
                  {mp.product_codigo && (
                    <span className="ml-2 text-xs text-gray-500 font-mono">{mp.product_codigo}</span>
                  )}
                  <span className="ml-2 text-sm text-gray-600">
                    {mp.markup_percentual > 0 && `${mp.markup_percentual}%`}
                    {mp.markup_percentual > 0 && mp.markup_fixo > 0 && ' + '}
                    {mp.markup_fixo > 0 && formatPrice(mp.markup_fixo)}
                  </span>
                </div>
                <button
                  onClick={() => mp.id && deleteProdutoMarkup(mp.id)}
                  className="p-1.5 text-red-600 hover:bg-red-100 rounded"
                >
                  <IconTrash size={18} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Buscar produto */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <IconSearch className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input
                type="text"
                value={searchProduto}
                onChange={(e) => setSearchProduto(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && searchProducts()}
                className="w-full px-3 py-2 pl-10 border rounded-lg"
                placeholder="Buscar produto por nome ou código..."
              />
            </div>
            <button
              onClick={() => searchProducts()}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Buscar
            </button>
          </div>

          {/* Resultados da busca */}
          {produtosEncontrados.length > 0 && !selectedProduto && (
            <div className="border rounded-lg max-h-60 overflow-y-auto">
              {produtosEncontrados.map((prod) => (
                <button
                  key={prod.id}
                  onClick={() => setSelectedProduto(prod)}
                  className="w-full px-3 py-2 text-left hover:bg-gray-50 border-b last:border-b-0 flex items-center gap-3"
                >
                  {/* Thumbnail do produto */}
                  <div className="w-10 h-10 flex-shrink-0 rounded overflow-hidden bg-gray-100">
                    {prod.image_url || prod.images?.[0] ? (
                      <img 
                        src={prod.image_url || prod.images?.[0]} 
                        alt={prod.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <IconPackage size={20} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-medium block truncate">{prod.name}</span>
                    <div className="flex items-center gap-2 text-sm">
                      {prod.codigo_mercos && (
                        <span className="text-xs text-gray-500 font-mono">{prod.codigo_mercos}</span>
                      )}
                      <span className="text-gray-600">{formatPrice(prod.price)}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Produto selecionado */}
          {selectedProduto && (
            <div className="p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="font-medium">{selectedProduto.name}</span>
                  <span className="ml-2 text-sm text-gray-600">{formatPrice(selectedProduto.price)}</span>
                </div>
                <button
                  onClick={() => setSelectedProduto(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <input
                    type="number"
                    value={newProdPercentual}
                    onChange={(e) => setNewProdPercentual(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="% markup"
                    min="0"
                    step="0.5"
                  />
                  <p className="text-xs text-gray-500 mt-1">Percentual sobre o preço base</p>
                </div>
                <div>
                  <input
                    type="number"
                    value={newProdFixo}
                    onChange={(e) => setNewProdFixo(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="R$ fixo"
                    min="0"
                    step="0.10"
                  />
                  <p className="text-xs text-gray-500 mt-1">Valor fixo adicional (R$)</p>
                </div>
                <button
                  onClick={addProdutoMarkup}
                  disabled={saving}
                  className="px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 flex items-center justify-center gap-2 h-fit"
                >
                  <IconPlus size={18} />
                  Adicionar
                </button>
              </div>
              
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>Preço final para o consumidor:</strong> {formatPrice(calcularPrecoFinal(selectedProduto.price, newProdPercentual, newProdFixo))}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  Este é o valor que será exibido para o cliente final no perfil da banca.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
