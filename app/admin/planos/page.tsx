"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Plan = {
  id: string;
  name: string;
  slug: string;
  description: string;
  type: "free" | "premium";
  price: number;
  billing_cycle: string;
  features: string[];
  limits: Record<string, any>;
  is_active: boolean;
  is_default: boolean;
  sort_order: number;
  created_at: string;
};

const BILLING_CYCLES: Record<string, string> = {
  monthly: "Mensal",
  quarterly: "Trimestral",
  semiannual: "Semestral",
  annual: "Anual",
};

export default function AdminPlanosPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<{
    name: string;
    slug: string;
    description: string;
    type: "free" | "premium";
    price: number;
    billing_cycle: string;
    features: string[];
    limits: Record<string, number>;
    is_active: boolean;
    is_default: boolean;
    sort_order: number;
  }>({
    name: "",
    slug: "",
    description: "",
    type: "premium",
    price: 0,
    billing_cycle: "monthly",
    features: [],
    limits: { max_products: 100, max_images_per_product: 10 },
    is_active: true,
    is_default: false,
    sort_order: 0,
  });

  const [newFeature, setNewFeature] = useState("");

  const loadPlans = async () => {
    try {
      const res = await fetch("/api/admin/plans");
      const data = await res.json();
      if (data.success) {
        setPlans(data.data || []);
      }
    } catch (error) {
      console.error("Erro ao carregar planos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlans();
  }, []);

  const openModal = (plan?: Plan) => {
    if (plan) {
      setEditingPlan(plan);
      setForm({
        name: plan.name,
        slug: plan.slug,
        description: plan.description || "",
        type: plan.type,
        price: plan.price,
        billing_cycle: plan.billing_cycle,
        features: plan.features || [],
        limits: plan.limits || { max_products: 100, max_images_per_product: 10 },
        is_active: plan.is_active,
        is_default: plan.is_default,
        sort_order: plan.sort_order,
      });
    } else {
      setEditingPlan(null);
      setForm({
        name: "",
        slug: "",
        description: "",
        type: "premium",
        price: 0,
        billing_cycle: "monthly",
        features: [],
        limits: { max_products: 100, max_images_per_product: 10 },
        is_active: true,
        is_default: false,
        sort_order: plans.length,
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPlan(null);
    setNewFeature("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = editingPlan 
        ? `/api/admin/plans/${editingPlan.id}` 
        : "/api/admin/plans";
      const method = editingPlan ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (data.success) {
        closeModal();
        loadPlans();
      } else {
        alert(data.error || "Erro ao salvar plano");
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar plano");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (plan: Plan) => {
    if (!confirm(`Excluir o plano "${plan.name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/plans/${plan.id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        loadPlans();
      } else {
        alert(data.error || "Erro ao excluir");
      }
    } catch (error) {
      alert("Erro ao excluir plano");
    }
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setForm({ ...form, features: [...form.features, newFeature.trim()] });
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setForm({ ...form, features: form.features.filter((_, i) => i !== index) });
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Planos</h1>
          <p className="text-gray-600 mt-1">Gerencie os planos de assinatura dos jornaleiros</p>
        </div>
        <button
          onClick={() => openModal()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Novo Plano
        </button>
      </div>

      {/* Cards dos Planos */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`bg-white rounded-xl border-2 p-6 relative ${
              plan.is_default ? "border-blue-500" : "border-gray-200"
            } ${!plan.is_active ? "opacity-60" : ""}`}
          >
            {plan.is_default && (
              <span className="absolute -top-3 left-4 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                Padrão
              </span>
            )}
            {!plan.is_active && (
              <span className="absolute -top-3 right-4 bg-gray-500 text-white text-xs px-2 py-1 rounded">
                Inativo
              </span>
            )}

            <div className="flex items-start justify-between">
              <div>
                <span className={`text-xs font-medium px-2 py-1 rounded ${
                  plan.type === "free" ? "bg-green-100 text-green-700" : "bg-purple-100 text-purple-700"
                }`}>
                  {plan.type === "free" ? "Gratuito" : "Premium"}
                </span>
                <h3 className="text-xl font-bold mt-2">{plan.name}</h3>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => openModal(plan)}
                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(plan)}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="mt-4">
              <span className="text-3xl font-bold">
                {plan.price === 0 ? "Grátis" : `R$ ${plan.price.toFixed(2)}`}
              </span>
              {plan.price > 0 && (
                <span className="text-gray-500 text-sm">/{BILLING_CYCLES[plan.billing_cycle]?.toLowerCase()}</span>
              )}
            </div>

            {plan.description && (
              <p className="text-gray-600 text-sm mt-2">{plan.description}</p>
            )}

            <ul className="mt-4 space-y-2">
              {plan.features?.slice(0, 5).map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                  <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
              {plan.features?.length > 5 && (
                <li className="text-sm text-gray-500">+{plan.features.length - 5} recursos</li>
              )}
            </ul>

            <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
              Slug: <code className="bg-gray-100 px-1 rounded">{plan.slug}</code>
            </div>
          </div>
        ))}
      </div>

      {plans.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <p className="text-gray-500">Nenhum plano cadastrado</p>
          <button
            onClick={() => openModal()}
            className="mt-4 text-blue-600 hover:underline"
          >
            Criar primeiro plano
          </button>
        </div>
      )}

      {/* Link para configurações */}
      <div className="mt-8 p-4 bg-gray-50 rounded-xl">
        <h3 className="font-semibold text-gray-800">Configurações de Pagamento</h3>
        <p className="text-sm text-gray-600 mt-1">
          Configure a API Key do Asaas para processar pagamentos.
        </p>
        <Link
          href="/admin/configuracoes"
          className="inline-flex items-center gap-2 mt-3 text-blue-600 hover:underline text-sm"
        >
          Ir para Configurações
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold">
                {editingPlan ? "Editar Plano" : "Novo Plano"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Plano *
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      setForm({
                        ...form,
                        name,
                        slug: editingPlan ? form.slug : generateSlug(name),
                      });
                    }}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ex: Premium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Slug *
                  </label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="premium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Descrição breve do plano"
                />
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo
                  </label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value as "free" | "premium" })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="free">Gratuito</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preço (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ciclo de Cobrança
                  </label>
                  <select
                    value={form.billing_cycle}
                    onChange={(e) => setForm({ ...form, billing_cycle: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="monthly">Mensal</option>
                    <option value="quarterly">Trimestral</option>
                    <option value="semiannual">Semestral</option>
                    <option value="annual">Anual</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Benefícios/Recursos
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ex: Produtos ilimitados"
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                  >
                    Adicionar
                  </button>
                </div>
                <ul className="space-y-1">
                  {form.features.map((feature, i) => (
                    <li key={i} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                      <span className="text-sm">{feature}</span>
                      <button
                        type="button"
                        onClick={() => removeFeature(i)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Limite de Produtos
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.limits.max_products || 0}
                    onChange={(e) => setForm({
                      ...form,
                      limits: { ...form.limits, max_products: parseInt(e.target.value) || 0 }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0 = ilimitado"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Imagens por Produto
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={form.limits.max_images_per_product || 5}
                    onChange={(e) => setForm({
                      ...form,
                      limits: { ...form.limits, max_images_per_product: parseInt(e.target.value) || 5 }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Plano ativo</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.is_default}
                    onChange={(e) => setForm({ ...form, is_default: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Plano padrão (atribuído a novos cadastros)</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {saving ? "Salvando..." : "Salvar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
