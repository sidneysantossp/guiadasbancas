"use client";

import { useState } from "react";

type Categoria = {
  id: number;
  nome: string;
  categoria_pai_id?: number | null;
  ultima_alteracao?: string;
  excluido?: boolean;
};

type StepResult = {
  success: boolean;
  error?: string;
  details?: any;
  status_code?: number;
  message?: string;
  categoria?: any;
  total_categorias?: number;
  encontradas?: number;
  matchMode?: string;
  scan_completo?: boolean;
  categorias?: Categoria[];
  log?: any;
};

const SANDBOX_COMPANY_TOKEN = "4b866744-a086-11f0-ada6-5e65486a6283";

function formatDate(value?: string) {
  if (!value) return "-";
  const date = new Date(value.replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function LogBox({ log }: { log: any }) {
  const [copied, setCopied] = useState(false);
  const text = JSON.stringify(log, null, 2);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="mt-4">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-600">📋 Log JSON (para o suporte Mercos)</span>
        <button
          onClick={copy}
          className="rounded bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200"
        >
          {copied ? "✅ Copiado!" : "Copiar JSON"}
        </button>
      </div>
      <pre className="max-h-72 overflow-auto rounded-lg border bg-gray-950 p-4 text-xs text-green-400 leading-relaxed">
        {text}
      </pre>
    </div>
  );
}

function StepBadge({ step, current }: { step: number; current: number }) {
  const done = current > step;
  const active = current === step;
  return (
    <div
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
        done
          ? "bg-green-500 text-white"
          : active
          ? "bg-indigo-600 text-white"
          : "bg-gray-200 text-gray-500"
      }`}
    >
      {done ? "✓" : step}
    </div>
  );
}

function ResultBox({ result }: { result: StepResult }) {
  const isOk = result.success;
  return (
    <div
      className={`mt-4 rounded-lg border p-4 text-sm ${
        isOk
          ? "border-green-200 bg-green-50"
          : "border-red-200 bg-red-50"
      }`}
    >
      <p className={`font-semibold ${isOk ? "text-green-700" : "text-red-700"}`}>
        {isOk ? "✅ Sucesso" : "❌ Erro"}
        {result.status_code ? ` — HTTP ${result.status_code}` : ""}
      </p>
      {result.message && (
        <p className="mt-1 text-gray-700">{result.message}</p>
      )}
      {result.error && (
        <p className="mt-1 text-red-600">{result.error}</p>
      )}
      {result.details && (
        <pre className="mt-2 max-h-40 overflow-auto rounded border bg-white p-2 text-xs text-gray-700">
          {typeof result.details === "string"
            ? result.details
            : JSON.stringify(result.details, null, 2)}
        </pre>
      )}
      {result.categoria && (
        <pre className="mt-2 max-h-40 overflow-auto rounded border bg-white p-2 text-xs text-gray-700">
          {JSON.stringify(result.categoria, null, 2)}
        </pre>
      )}
    </div>
  );
}

export default function HomologacaoMercosPage() {
  const [useSandbox, setUseSandbox] = useState(true);
  const [companyToken, setCompanyToken] = useState(SANDBOX_COMPANY_TOKEN);

  // Etapa 1 - GET
  const [step1Prefix, setStep1Prefix] = useState("");
  const [step1AlteradoApos, setStep1AlteradoApos] = useState(() => {
    // Default: now minus 1 minute, in local datetime-local format
    const d = new Date(Date.now() - 60_000);
    return d.toISOString().slice(0, 16);
  });
  const [step1Loading, setStep1Loading] = useState(false);
  const [step1Result, setStep1Result] = useState<StepResult | null>(null);

  // Etapa 2 - POST
  const [step2Nome, setStep2Nome] = useState("");
  const [step2PaiId, setStep2PaiId] = useState("");
  const [step2Loading, setStep2Loading] = useState(false);
  const [step2Result, setStep2Result] = useState<StepResult | null>(null);

  // Etapa 3 - PUT
  const [step3Id, setStep3Id] = useState("");
  const [step3Nome, setStep3Nome] = useState("");
  const [step3Loading, setStep3Loading] = useState(false);
  const [step3Result, setStep3Result] = useState<StepResult | null>(null);

  const currentStep =
    step3Result?.success
      ? 4
      : step2Result?.success
      ? 3
      : step1Result?.success
      ? 2
      : 1;

  async function handleStep1() {
    if (!step1Prefix.trim() || !step1AlteradoApos.trim()) return;
    setStep1Loading(true);
    setStep1Result(null);
    try {
      // Convert datetime-local value ("2026-02-19T14:00") to full ISO without timezone
      const alteradoApos = step1AlteradoApos.length === 16
        ? step1AlteradoApos + ":00"
        : step1AlteradoApos;
      const params = new URLSearchParams({
        prefix: step1Prefix.trim(),
        alterado_apos: alteradoApos,
        useSandbox: String(useSandbox),
        companyToken,
      });
      const res = await fetch(`/api/admin/mercos/categorias?${params}`);
      const text = await res.text();
      let json: any;
      try { json = JSON.parse(text); } catch {
        json = { success: false, error: `Resposta inválida do servidor (HTTP ${res.status}). Possível timeout — tente novamente.`, raw: text.slice(0, 200) };
      }
      setStep1Result(json);
    } catch (e: any) {
      setStep1Result({ success: false, error: e.message });
    } finally {
      setStep1Loading(false);
    }
  }

  async function handleStep2() {
    if (!step2Nome.trim()) return;
    setStep2Loading(true);
    setStep2Result(null);
    try {
      const body: any = { nome: step2Nome.trim(), useSandbox, companyToken };
      if (step2PaiId.trim()) body.categoria_pai_id = Number(step2PaiId.trim());
      const res = await fetch("/api/admin/mercos/categorias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const text = await res.text();
      let json: any;
      try { json = JSON.parse(text); } catch {
        json = { success: false, error: `Resposta inválida do servidor (HTTP ${res.status}). Tente novamente.`, raw: text.slice(0, 200) };
      }
      setStep2Result(json);
      if (json.success && json.categoria?.id) {
        setStep3Id(String(json.categoria.id));
        setStep3Nome(json.categoria.nome || step2Nome.trim());
      }
    } catch (e: any) {
      setStep2Result({ success: false, error: e.message });
    } finally {
      setStep2Loading(false);
    }
  }

  async function handleStep3() {
    if (!step3Id.trim() || !step3Nome.trim()) return;
    setStep3Loading(true);
    setStep3Result(null);
    try {
      const res = await fetch("/api/admin/mercos/categorias", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: Number(step3Id),
          nome: step3Nome.trim(),
          useSandbox,
          companyToken,
        }),
      });
      const text = await res.text();
      let json: any;
      try { json = JSON.parse(text); } catch {
        json = { success: false, error: `Resposta inválida do servidor (HTTP ${res.status}). Tente novamente.`, raw: text.slice(0, 200) };
      }
      setStep3Result(json);
    } catch (e: any) {
      setStep3Result({ success: false, error: e.message });
    } finally {
      setStep3Loading(false);
    }
  }

  return (
    <div className="p-6 max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Homologação Mercos — Categorias de Produto
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Complete as 3 etapas abaixo para homologar a integração de categorias
          com a Mercos. Tire print de cada resultado para enviar no portal de
          homologação.
        </p>
      </div>

      {/* Configuração global */}
      <div className="mb-6 rounded-xl border bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-gray-700">
          ⚙️ Configuração
        </h2>
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={useSandbox}
              onChange={(e) => setUseSandbox(e.target.checked)}
              className="h-4 w-4 rounded"
            />
            <span>
              Usar ambiente <strong>Sandbox</strong>
            </span>
          </label>
          <div className="flex flex-1 min-w-60 items-center gap-2">
            <label className="whitespace-nowrap text-sm font-medium text-gray-700">
              Company Token:
            </label>
            <input
              type="text"
              value={companyToken}
              onChange={(e) => setCompanyToken(e.target.value)}
              className="flex-1 rounded-lg border px-3 py-1.5 font-mono text-xs"
              placeholder="Company Token do Mercos"
            />
          </div>
        </div>
        <p className="mt-2 text-xs text-gray-400">
          Sandbox URL: https://sandbox.mercos.com/api/v1 · App Token fixo do
          sandbox
        </p>
      </div>

      {/* Stepper */}
      <div className="mb-6 flex items-center gap-2">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <StepBadge step={s} current={currentStep} />
            <span
              className={`text-sm font-medium ${
                currentStep === s
                  ? "text-indigo-700"
                  : currentStep > s
                  ? "text-green-600"
                  : "text-gray-400"
              }`}
            >
              {s === 1
                ? "GET Categorias"
                : s === 2
                ? "POST Categoria"
                : "PUT Categoria"}
            </span>
            {s < 3 && <div className="h-px w-8 bg-gray-300" />}
          </div>
        ))}
        {currentStep === 4 && (
          <span className="ml-4 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
            ✅ Homologação completa!
          </span>
        )}
      </div>

      {/* ── ETAPA 1 — GET ── */}
      <div className="mb-4 overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b bg-gray-50 px-5 py-3">
          <StepBadge step={1} current={currentStep} />
          <div>
            <h2 className="font-semibold text-gray-800">
              Etapa 1/3 — Categoria de Produto: GET
            </h2>
            <p className="text-xs text-gray-500">
              Localize a categoria pelo prefixo do nome informado pela Mercos
            </p>
          </div>
          <span className="ml-auto rounded bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-700">
            GET
          </span>
        </div>
        <div className="p-5">
          <p className="mb-4 text-sm text-gray-600">
            A Mercos cria os registros no momento em que você inicia o processo.
            Informe o <strong>horário de início</strong> (ou 1 minuto antes) e o
            <strong> prefixo</strong> indicado no portal de homologação. A busca
            pagina automaticamente com <code className="rounded bg-gray-100 px-1">id_maior_que</code> até trazer todos os registros.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700">
                Prefixo do campo{" "}
                <code className="rounded bg-gray-100 px-1">nome</code>{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={step1Prefix}
                onChange={(e) => setStep1Prefix(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleStep1()}
                placeholder="Ex.: e8f7df45"
                className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700">
                Horário de início do processo{" "}
                <span className="text-red-500">*</span>
                <span className="ml-1 font-normal text-gray-400">(ou 1 min antes)</span>
              </label>
              <input
                type="datetime-local"
                value={step1AlteradoApos}
                onChange={(e) => setStep1AlteradoApos(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          </div>
          <button
            onClick={handleStep1}
            disabled={step1Loading || !step1Prefix.trim() || !step1AlteradoApos.trim()}
            className="mt-3 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-700 disabled:opacity-50"
          >
            {step1Loading ? "Buscando..." : "Buscar"}
          </button>

          {step1Result && (
            <>
              {step1Result.success ? (
                <div className="mt-4">
                  {step1Result.encontradas === 0 && (
                    <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-800">
                      ⚠️ Nenhuma categoria encontrada com esse prefixo no período informado.
                      Verifique se o <strong>horário de início</strong> está correto e se a Mercos já criou os registros.
                    </div>
                  )}
                  <div className="mb-2 flex flex-wrap items-center gap-4 text-xs text-gray-500">
                    <span>
                      Total no Mercos:{" "}
                      <strong className="text-gray-700">
                        {step1Result.total_categorias}
                      </strong>
                    </span>
                    <span>
                      Encontradas com prefixo:{" "}
                      <strong className="text-gray-700">
                        {step1Result.encontradas}
                      </strong>
                    </span>
                    {step1Result.matchMode &&
                      step1Result.matchMode !== "startsWith" && (
                        <span className="text-amber-600">
                          Modo: {step1Result.matchMode}
                        </span>
                      )}
                  </div>
                  <div className="overflow-auto rounded-lg border bg-white">
                    <table className="min-w-full text-xs">
                      <thead className="border-b bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left font-semibold text-gray-600">
                            ID
                          </th>
                          <th className="px-3 py-2 text-left font-semibold text-gray-600">
                            Nome completo
                          </th>
                          <th className="px-3 py-2 text-left font-semibold text-gray-600">
                            Categoria Pai ID
                          </th>
                          <th className="px-3 py-2 text-left font-semibold text-gray-600">
                            Última alteração
                          </th>
                          <th className="px-3 py-2 text-left font-semibold text-gray-600">
                            Excluído
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {step1Result.categorias &&
                        step1Result.categorias.length > 0 ? (
                          step1Result.categorias.map((cat) => (
                            <tr
                              key={cat.id}
                              className="border-b last:border-0 hover:bg-gray-50"
                            >
                              <td className="px-3 py-2 font-mono text-gray-700">
                                {cat.id}
                              </td>
                              <td className="px-3 py-2 font-medium text-gray-900">
                                {cat.nome}
                              </td>
                              <td className="px-3 py-2 text-gray-500">
                                {cat.categoria_pai_id ?? "—"}
                              </td>
                              <td className="px-3 py-2 text-gray-500">
                                {formatDate(cat.ultima_alteracao)}
                              </td>
                              <td className="px-3 py-2">
                                <span
                                  className={`rounded px-1.5 py-0.5 text-xs font-medium ${
                                    cat.excluido
                                      ? "bg-red-100 text-red-700"
                                      : "bg-green-100 text-green-700"
                                  }`}
                                >
                                  {cat.excluido ? "Sim" : "Não"}
                                </span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={5}
                              className="px-3 py-6 text-center text-gray-400"
                            >
                              Nenhuma categoria encontrada com esse prefixo.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  {step1Result.categorias &&
                    step1Result.categorias.length > 0 && (
                      <p className="mt-2 text-xs text-green-600">
                        ✅ Copie o <strong>nome completo</strong> acima e
                        informe no portal de homologação da Mercos.
                      </p>
                    )}
                </div>
              ) : (
                <ResultBox result={step1Result} />
              )}
              {step1Result?.log && <LogBox log={step1Result.log} />}
            </>
          )}
        </div>
      </div>

      {/* ── ETAPA 2 — POST ── */}
      <div className="mb-4 overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b bg-gray-50 px-5 py-3">
          <StepBadge step={2} current={currentStep} />
          <div>
            <h2 className="font-semibold text-gray-800">
              Etapa 2/3 — Categoria de Produto: POST
            </h2>
            <p className="text-xs text-gray-500">
              Crie uma nova categoria no Mercos Sandbox
            </p>
          </div>
          <span className="ml-auto rounded bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700">
            POST
          </span>
        </div>
        <div className="p-5">
          <p className="mb-4 text-sm text-gray-600">
            Informe o nome da categoria que a Mercos solicita para criar no
            sandbox. O ID gerado será preenchido automaticamente na Etapa 3.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700">
                Nome da categoria <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={step2Nome}
                onChange={(e) => setStep2Nome(e.target.value)}
                placeholder="Ex.: Bebidas Alcoólicas"
                className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700">
                ID da categoria pai (opcional)
              </label>
              <input
                type="number"
                value={step2PaiId}
                onChange={(e) => setStep2PaiId(e.target.value)}
                placeholder="Ex.: 12345"
                className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
          </div>
          <button
            onClick={handleStep2}
            disabled={step2Loading || !step2Nome.trim()}
            className="mt-3 rounded-lg bg-green-600 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-green-700 disabled:opacity-50"
          >
            {step2Loading ? "Criando..." : "Criar categoria"}
          </button>

          {step2Result && <ResultBox result={step2Result} />}
          {step2Result?.log && <LogBox log={step2Result.log} />}
        </div>
      </div>

      {/* ── ETAPA 3 — PUT ── */}
      <div className="mb-4 overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b bg-gray-50 px-5 py-3">
          <StepBadge step={3} current={currentStep} />
          <div>
            <h2 className="font-semibold text-gray-800">
              Etapa 3/3 — Categoria de Produto: PUT
            </h2>
            <p className="text-xs text-gray-500">
              Edite/renomeie uma categoria existente no Mercos Sandbox
            </p>
          </div>
          <span className="ml-auto rounded bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700">
            PUT
          </span>
        </div>
        <div className="p-5">
          <p className="mb-4 text-sm text-gray-600">
            Informe o ID da categoria (preenchido automaticamente se criada na
            Etapa 2) e o novo nome para atualizar.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700">
                ID da categoria <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={step3Id}
                onChange={(e) => setStep3Id(e.target.value)}
                placeholder="Ex.: 98765"
                className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700">
                Novo nome <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={step3Nome}
                onChange={(e) => setStep3Nome(e.target.value)}
                placeholder="Ex.: Bebidas Alcoólicas Importadas"
                className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>
          <button
            onClick={handleStep3}
            disabled={step3Loading || !step3Id.trim() || !step3Nome.trim()}
            className="mt-3 rounded-lg bg-amber-500 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-amber-600 disabled:opacity-50"
          >
            {step3Loading ? "Atualizando..." : "Atualizar categoria"}
          </button>

          {step3Result && <ResultBox result={step3Result} />}
          {step3Result?.log && <LogBox log={step3Result.log} />}
        </div>
      </div>

      {/* Instruções */}
      <div className="rounded-xl border bg-indigo-50 p-4 text-sm text-indigo-800">
        <h3 className="mb-2 font-semibold">📋 Como usar</h3>
        <ol className="list-decimal space-y-1 pl-4">
          <li>
            <strong>Etapa 1 (GET):</strong> Cole o prefixo informado pela Mercos
            e clique em Buscar. Copie o nome completo da categoria encontrada e
            informe no portal de homologação.
          </li>
          <li>
            <strong>Etapa 2 (POST):</strong> Digite o nome da categoria que a
            Mercos solicita criar. Clique em Criar e tire print do resultado
            (ID + nome retornados).
          </li>
          <li>
            <strong>Etapa 3 (PUT):</strong> O ID é preenchido automaticamente
            após a Etapa 2. Digite o novo nome solicitado e clique em Atualizar.
            Tire print do resultado.
          </li>
        </ol>
      </div>
    </div>
  );
}
