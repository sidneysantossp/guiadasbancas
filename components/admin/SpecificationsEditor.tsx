"use client";

import { useState } from "react";

interface Specification {
  key: string;
  value: string;
}

interface SpecificationsEditorProps {
  label?: string;
  value: string; // JSON string das especificações
  onChange: (specs: string) => void;
  placeholder?: string;
}

export default function SpecificationsEditor({ 
  label = "Especificações Técnicas", 
  value, 
  onChange, 
  placeholder 
}: SpecificationsEditorProps) {
  // Parse das especificações do JSON
  const parseSpecs = (jsonString: string): Specification[] => {
    try {
      const parsed = JSON.parse(jsonString || "{}");
      return Object.entries(parsed).map(([key, value]) => ({ 
        key, 
        value: String(value) 
      }));
    } catch {
      return [];
    }
  };

  const [specs, setSpecs] = useState<Specification[]>(() => parseSpecs(value));

  const updateSpecs = (newSpecs: Specification[]) => {
    setSpecs(newSpecs);
    // Converter para objeto e depois JSON
    const specsObject = newSpecs.reduce((acc, spec) => {
      if (spec.key.trim() && spec.value.trim()) {
        acc[spec.key.trim()] = spec.value.trim();
      }
      return acc;
    }, {} as Record<string, string>);
    
    onChange(JSON.stringify(specsObject));
  };

  const addSpec = () => {
    updateSpecs([...specs, { key: "", value: "" }]);
  };

  const removeSpec = (index: number) => {
    updateSpecs(specs.filter((_, i) => i !== index));
  };

  const updateSpec = (index: number, field: 'key' | 'value', newValue: string) => {
    const newSpecs = [...specs];
    newSpecs[index][field] = newValue;
    updateSpecs(newSpecs);
  };

  return (
    <div>
      {label && <label className="text-sm font-medium">{label}</label>}
      
      <div className="mt-1 space-y-2">
        {specs.length === 0 && (
          <div className="text-center py-8 text-gray-500 text-sm border-2 border-dashed border-gray-200 rounded-lg">
            <div className="mb-2">📋</div>
            <div>Nenhuma especificação adicionada</div>
            <div className="text-xs mt-1">Clique em "Adicionar" para começar</div>
          </div>
        )}
        
        {specs.map((spec, index) => (
          <div key={index} className="flex gap-2 items-start">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Nome da especificação (ex: Peso, Dimensões)"
                value={spec.key}
                onChange={(e) => updateSpec(index, 'key', e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#ff5c00] focus:ring-1 focus:ring-[#ff5c00]"
              />
            </div>
            <div className="flex-1">
              <input
                type="text"
                placeholder="Valor (ex: 250g, 15x10x2cm)"
                value={spec.value}
                onChange={(e) => updateSpec(index, 'value', e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#ff5c00] focus:ring-1 focus:ring-[#ff5c00]"
              />
            </div>
            <button
              type="button"
              onClick={() => removeSpec(index)}
              className="flex items-center justify-center w-9 h-9 text-red-600 hover:bg-red-50 rounded-md transition-colors"
              title="Remover especificação"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
          </div>
        ))}
        
        <button
          type="button"
          onClick={addSpec}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-[#ff5c00] hover:text-[#ff5c00] transition-colors"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
          Adicionar Especificação
        </button>
      </div>
      
      {specs.length > 0 && (
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-xs text-blue-700 font-medium mb-2">📋 Preview das Especificações:</div>
          <div className="space-y-1">
            {specs.filter(s => s.key.trim() && s.value.trim()).map((spec, index) => (
              <div key={index} className="flex justify-between text-xs">
                <span className="font-medium text-gray-700">{spec.key}:</span>
                <span className="text-gray-600">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
