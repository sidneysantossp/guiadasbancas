"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import "react-quill-new/dist/quill.snow.css";

// Importar dinamicamente para evitar erros de SSR
const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
      <span className="text-gray-500">Carregando editor...</span>
    </div>
  ),
});

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: number;
}

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    ["blockquote"],
    ["link"],
    [{ align: [] }],
    ["clean"],
  ],
  clipboard: {
    matchVisual: true,
  },
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "indent",
  "blockquote",
  "link",
  "align",
];

export default function MarkdownEditor({
  value,
  onChange,
  placeholder = "Digite o conteúdo do seu artigo aqui...",
  height = 500,
}: RichTextEditorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
    <div className="rich-text-editor-wrapper">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        style={{ height: height - 42 }}
      />
      <style jsx global>{`
        .rich-text-editor-wrapper .ql-container {
          font-size: 16px;
          font-family: inherit;
          border-bottom-left-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
        }
        .rich-text-editor-wrapper .ql-toolbar {
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
          background: #f9fafb;
        }
        .rich-text-editor-wrapper .ql-toolbar button:hover,
        .rich-text-editor-wrapper .ql-toolbar button.ql-active {
          color: #ff5c00;
        }
        .rich-text-editor-wrapper .ql-toolbar button:hover .ql-stroke,
        .rich-text-editor-wrapper .ql-toolbar button.ql-active .ql-stroke {
          stroke: #ff5c00;
        }
        .rich-text-editor-wrapper .ql-toolbar button:hover .ql-fill,
        .rich-text-editor-wrapper .ql-toolbar button.ql-active .ql-fill {
          fill: #ff5c00;
        }
        .rich-text-editor-wrapper .ql-editor {
          min-height: ${height - 80}px;
          line-height: 1.8;
        }
        .rich-text-editor-wrapper .ql-editor h1 {
          font-size: 2em;
          font-weight: bold;
          margin-bottom: 0.5em;
        }
        .rich-text-editor-wrapper .ql-editor h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin-bottom: 0.5em;
        }
        .rich-text-editor-wrapper .ql-editor h3 {
          font-size: 1.25em;
          font-weight: bold;
          margin-bottom: 0.5em;
        }
        .rich-text-editor-wrapper .ql-editor p {
          margin-bottom: 1em;
        }
        .rich-text-editor-wrapper .ql-editor ul,
        .rich-text-editor-wrapper .ql-editor ol {
          margin-bottom: 1em;
          padding-left: 1.5em;
        }
        .rich-text-editor-wrapper .ql-editor blockquote {
          border-left: 4px solid #ff5c00;
          padding-left: 1em;
          margin: 1em 0;
          color: #666;
        }
      `}</style>
    </div>
  );
}
