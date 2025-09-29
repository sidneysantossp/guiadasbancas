"use client";

import { useEffect, useRef } from "react";

interface RichTextEditorProps {
  label?: string;
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
}

const COMMANDS: { key: string; command: string; icon: string; label: string }[] = [
  { key: "bold", command: "bold", icon: "𝐁", label: "Negrito" },
  { key: "italic", command: "italic", icon: "𝐼", label: "Itálico" },
  { key: "underline", command: "underline", icon: "U", label: "Sublinhado" },
  { key: "strikeThrough", command: "strikeThrough", icon: "S", label: "Tachado" },
];

export default function RichTextEditor({ label, value, onChange, placeholder, className }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);

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

  return (
    <div className={className}>
      {label && <label className="text-sm font-medium">{label}</label>}
      <div className="mt-1 rounded-lg border border-gray-300 bg-white shadow-sm">
        <div className="flex items-center gap-1 border-b border-gray-200 px-2 py-1 text-xs text-gray-600">
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
