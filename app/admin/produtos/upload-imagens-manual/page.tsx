"use client";

import { useState } from "react";
import Link from "next/link";

interface Produto {
  id: string;
  name: string;
  mercos_id: number;
  codigo_mercos: string | null;
  distribuidor_name: string;
  images: string[];
}

export default function UploadImagensManualPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [distribuidorId, setDistribuidorId] = useState("");
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);

  const searchProdutos = async () => {
    if (!searchTerm.trim()) {
      alert("Digite um termo de busca");
      return;
    }

    setLoading(true);
    try {
      const url = `/api/admin/produtos/search-sem-codigo?q=${encodeURIComponent(
        searchTerm
      )}${distribuidorId ? `&distribuidor_id=${distribuidorId}` : ""}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.success) {
        setProdutos(data.produtos || []);
      } else {
        alert(data.error || "Erro ao buscar produtos");
      }
    } catch (err: any) {
      alert(err.message || "Erro ao buscar produtos");
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (produtoId: string, file: File) => {
    setUploading(produtoId);
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("produto_id", produtoId);

      const res = await fetch("/api/admin/produtos/upload-imagem-manual", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        alert("Imagem enviada com sucesso!");
        // Atualizar lista
        setProdutos((prev) =>
          prev.map((p) =>
            p.id === produtoId ? { ...p, images: data.images } : p
          )
        );
      } else {
        alert(data.error || "Erro ao enviar imagem");
      }
    } catch (err: any) {
      alert(err.message || "Erro ao enviar imagem");
    } finally {
      setUploading(null);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <Link
          href="/admin/produtos"
          className="text-sm text-blue-600 hover:underline"
        >
          ← Voltar para produtos
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold mb-2">Upload Manual de Imagens</h1>
        <p className="text-gray-600 mb-6">
          Use esta ferramenta para adicionar imagens a produtos que não têm
          codigo_mercos ou quando o upload em massa falhar
        </p>

        {/* Busca */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buscar produto (nome, mercos_id ou código)
            </label>
            <input
              type="text"
              placeholder="Ex: TJ02, 123456, Nome do Produto"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && searchProdutos()}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ID do Distribuidor (opcional)
            </label>
            <input
              type="text"
              placeholder="UUID"
              value={distribuidorId}
              onChange={(e) => setDistribuidorId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <button
          onClick={searchProdutos}
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 mb-6"
        >
          {loading ? "Buscando..." : "Buscar Produtos"}
        </button>

        {/* Resultados */}
        {produtos.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">
              {produtos.length} produto(s) encontrado(s)
            </h2>
            {produtos.map((produto) => (
              <div
                key={produto.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <h3 className="font-semibold text-lg">{produto.name}</h3>
                    <div className="text-sm text-gray-600 space-y-1 mt-2">
                      <div>
                        <strong>Mercos ID:</strong> {produto.mercos_id}
                      </div>
                      <div>
                        <strong>Código Mercos:</strong>{" "}
                        {produto.codigo_mercos || (
                          <span className="text-red-600">(vazio)</span>
                        )}
                      </div>
                      <div>
                        <strong>Distribuidor:</strong>{" "}
                        {produto.distribuidor_name}
                      </div>
                      <div>
                        <strong>Imagens:</strong> {produto.images.length}
                      </div>
                    </div>

                    {produto.images.length > 0 && (
                      <div className="flex gap-2 mt-3">
                        {produto.images.slice(0, 3).map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt=""
                            className="w-16 h-16 object-cover rounded border"
                          />
                        ))}
                        {produto.images.length > 3 && (
                          <div className="w-16 h-16 bg-gray-100 rounded border flex items-center justify-center text-xs text-gray-600">
                            +{produto.images.length - 3}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center">
                    <label
                      className={`w-full px-4 py-3 border-2 border-dashed rounded-lg text-center cursor-pointer transition ${
                        uploading === produto.id
                          ? "bg-gray-100 border-gray-400"
                          : "hover:bg-blue-50 hover:border-blue-400 border-gray-300"
                      }`}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        disabled={uploading === produto.id}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) uploadImage(produto.id, file);
                        }}
                        className="hidden"
                      />
                      <div className="text-sm">
                        {uploading === produto.id ? (
                          <span className="text-gray-600">
                            Enviando...
                          </span>
                        ) : (
                          <>
                            <div className="text-blue-600 font-medium">
                              📤 Adicionar Imagem
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              Clique para selecionar
                            </div>
                          </>
                        )}
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {produtos.length === 0 && searchTerm && !loading && (
          <div className="text-center py-8 text-gray-500">
            Nenhum produto encontrado
          </div>
        )}
      </div>
    </div>
  );
}
