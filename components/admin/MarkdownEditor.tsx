"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import "react-markdown-editor-lite/lib/index.css";

// Importar dinamicamente para evitar erros de SSR
const MdEditor = dynamic(() => import("react-markdown-editor-lite"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
      <span className="text-gray-500">Carregando editor...</span>
    </div>
  ),
});

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: number;
}

export default function MarkdownEditor({
  value,
  onChange,
  placeholder = "Digite o conteúdo do seu artigo aqui...",
  height = 500,
}: MarkdownEditorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleEditorChange = ({ text }: { text: string }) => {
    onChange(text);
  };

  const renderHTML = (text: string) => {
    return <ReactMarkdown>{text}</ReactMarkdown>;
  };

  if (!mounted) {
    return (
      <div className="w-full bg-gray-100 rounded-lg animate-pulse" style={{ height }}>
        <div className="flex items-center justify-center h-full">
          <span className="text-gray-500">Carregando editor...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="markdown-editor-wrapper">
      <MdEditor
        value={value}
        style={{ height }}
        renderHTML={renderHTML}
        onChange={handleEditorChange}
        placeholder={placeholder}
        config={{
          view: {
            menu: true,
            md: true,
            html: true,
          },
          canView: {
            menu: true,
            md: true,
            html: true,
            fullScreen: true,
            hideMenu: true,
          },
          markdownClass: "prose max-w-none",
          htmlClass: "prose max-w-none",
        }}
      />
      <style jsx global>{`
        .markdown-editor-wrapper .rc-md-editor {
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          overflow: hidden;
        }
        .markdown-editor-wrapper .rc-md-editor .rc-md-navigation {
          background: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
        }
        .markdown-editor-wrapper .rc-md-editor .button-wrap .button {
          color: #374151;
        }
        .markdown-editor-wrapper .rc-md-editor .button-wrap .button:hover {
          color: #ff5c00;
        }
        .markdown-editor-wrapper .rc-md-editor .editor-container .sec-md .input {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size: 14px;
          line-height: 1.6;
        }
        .markdown-editor-wrapper .rc-md-editor .editor-container .sec-html {
          padding: 16px;
        }
      `}</style>
    </div>
  );
}
