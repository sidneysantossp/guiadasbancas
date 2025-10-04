-- Habilitar extensão para UUID (se ainda não estiver habilitada)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de distribuidores Mercos
CREATE TABLE IF NOT EXISTS distribuidores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(100) NOT NULL,
  application_token VARCHAR(100) NOT NULL,
  company_token VARCHAR(100) NOT NULL,
  base_url VARCHAR(200) DEFAULT 'https://app.mercos.com/api/v1',
  ativo BOOLEAN DEFAULT true,
  ultima_sincronizacao TIMESTAMP,
  total_produtos INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Adicionar campos na tabela products para vincular distribuidores
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS distribuidor_id UUID REFERENCES distribuidores(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS mercos_id INTEGER,
ADD COLUMN IF NOT EXISTS sincronizado_em TIMESTAMP,
ADD COLUMN IF NOT EXISTS origem VARCHAR(20) DEFAULT 'proprio' CHECK (origem IN ('proprio', 'mercos'));

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_products_distribuidor ON products(distribuidor_id);
CREATE INDEX IF NOT EXISTS idx_products_mercos_id ON products(mercos_id);
CREATE INDEX IF NOT EXISTS idx_products_origem ON products(origem);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_distribuidores_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_distribuidores_updated_at
BEFORE UPDATE ON distribuidores
FOR EACH ROW
EXECUTE FUNCTION update_distribuidores_updated_at();

-- Desabilitar RLS para distribuidores (somente admin)
ALTER TABLE distribuidores DISABLE ROW LEVEL SECURITY;

COMMENT ON TABLE distribuidores IS 'Tabela de distribuidores integrados com API Mercos';
COMMENT ON COLUMN products.distribuidor_id IS 'ID do distribuidor (se produto vier de catálogo Mercos)';
COMMENT ON COLUMN products.mercos_id IS 'ID do produto na API Mercos';
COMMENT ON COLUMN products.origem IS 'Origem do produto: proprio (cadastrado manualmente) ou mercos (sincronizado)';
