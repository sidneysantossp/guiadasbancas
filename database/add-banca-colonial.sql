-- Script para adicionar Banca Colonial se não existir
-- Execute no SQL Editor do Supabase

-- Primeiro verificar se já existe
DO $$
BEGIN
    -- Verificar se a Banca Colonial já existe
    IF NOT EXISTS (
        SELECT 1 FROM bancas 
        WHERE name ILIKE '%colonial%' 
           OR name ILIKE '%colonical%'
    ) THEN
        -- Inserir a Banca Colonial com todos os campos obrigatórios
        INSERT INTO bancas (
            name,
            cep,
            address,
            lat,
            lng,
            cover_image,
            active,
            created_at,
            updated_at
        ) VALUES (
            'Banca Colonial',
            '01000-000', -- CEP padrão (substitua pelo correto)
            'Endereço da Banca Colonial', -- Substitua pelo endereço correto
            -23.5505, -- Latitude (exemplo São Paulo)
            -46.6333, -- Longitude (exemplo São Paulo)
            NULL, -- Adicione URL da imagem se tiver
            true,
            NOW(),
            NOW()
        );
        
        RAISE NOTICE 'Banca Colonial adicionada com sucesso!';
    ELSE
        RAISE NOTICE 'Banca Colonial já existe no banco de dados.';
    END IF;
END $$;

-- Verificar o resultado
SELECT id, name, cep, address, active, created_at 
FROM bancas 
WHERE name ILIKE '%colonial%' 
   OR name ILIKE '%colonical%';

-- Verificar se existem produtos órfãos da Banca Colonial
SELECT p.id, p.name, p.banca_id, p.created_at
FROM products p
LEFT JOIN bancas b ON p.banca_id = b.id
WHERE b.id IS NULL
   AND (p.name ILIKE '%colonial%' OR p.description ILIKE '%colonial%')
ORDER BY p.created_at;
