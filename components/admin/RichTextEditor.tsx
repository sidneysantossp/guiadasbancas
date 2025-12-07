"use client";

import { useEffect, useRef, useState } from "react";

interface RichTextEditorProps {
  label?: string;
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
  aiContext?: {
    productName: string;
    productDescription?: string;
  };
}

const COMMANDS: { key: string; command: string; icon: string; label: string }[] = [
  { key: "bold", command: "bold", icon: "𝐁", label: "Negrito" },
  { key: "italic", command: "italic", icon: "𝐼", label: "Itálico" },
  { key: "underline", command: "underline", icon: "U", label: "Sublinhado" },
  { key: "strikeThrough", command: "strikeThrough", icon: "S", label: "Tachado" },
];

export default function RichTextEditor({ label, value, onChange, placeholder, className, aiContext }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (!editorRef.current) return;
    if (editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const exec = (command: string) => {
    if (typeof document === "undefined") return;
    document.execCommand(command);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleInput = () => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    onChange(html);
  };

  const handleAiGenerate = async () => {
    if (!aiContext?.productName) {
      alert("Preencha o nome do produto para usar a IA.");
      return;
    }
    
    if (!confirm("Isso substituirá o conteúdo atual. Deseja continuar?")) {
      return;
    }

    setIsGenerating(true);
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(aiContext),
      });
      const json = await res.json();
      
      if (json.success && json.html) {
        onChange(json.html);
      } else {
        console.error("Erro na resposta da IA:", json);
        alert("Não foi possível gerar a descrição. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao chamar API de IA:", error);
      alert("Erro ao conectar com o serviço de IA.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className={className}>
      {label && <label className="text-sm font-medium">{label}</label>}
      <div className="mt-1 rounded-lg border border-gray-300 bg-white shadow-sm">
        <div className="flex items-center gap-1 border-b border-gray-200 px-2 py-1 text-xs text-gray-600 flex-wrap">
          {COMMANDS.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => exec(item.command)}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md hover:bg-gray-100"
              title={item.label}
            >
              {item.icon}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              const url = prompt("Informe a URL", "https://");
              if (!url) return;
              document.execCommand("createLink", false, url);
              if (editorRef.current) onChange(editorRef.current.innerHTML);
            }}
            className="ml-1 inline-flex h-7 items-center rounded-md border border-gray-200 px-2 hover:bg-gray-100"
            title="Inserir link"
          >
            Link
          </button>

          {aiContext && (
            <button
              type="button"
              onClick={handleAiGenerate}
              disabled={isGenerating}
              className={`ml-1 inline-flex h-7 items-center gap-1 rounded-md border px-2 transition-colors ${
                isGenerating 
                  ? "border-gray-200 bg-gray-50 text-gray-400 cursor-wait" 
                  : "border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100"
              }`}
              title="Gerar descrição com IA"
            >
              {isGenerating ? (
                <>
                  <span className="animate-spin h-3 w-3 border-2 border-current border-t-transparent rounded-full" />
                  Gerando...
                </>
              ) : (
                <>
                  <span>✨</span>
                  Gerar com IA
                </>
              )}
            </button>
          )}

          <div className="ml-auto text-[11px] text-gray-400">Rich text simples</div>
        </div>
        <div
          ref={editorRef}
          className="min-h-[160px] w-full rounded-b-lg px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5c00] focus-visible:ring-offset-2"
          contentEditable
          data-placeholder={placeholder}
          onInput={handleInput}
          onBlur={handleInput}
          suppressContentEditableWarning
        />
      </div>
      <style jsx>{`
        [contenteditable][data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
        }
      `}</style>
    </div>
  );
}
