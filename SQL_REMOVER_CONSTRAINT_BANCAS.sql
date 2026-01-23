-- Execute este SQL no Supabase Dashboard (SQL Editor)
-- URL: https://rgqlncxrzwgjreggrjcq.supabase.co/project/_/sql

-- Remover constraint que impede múltiplas bancas por usuário
ALTER TABLE bancas DROP CONSTRAINT IF EXISTS unique_bancas_user_id;
