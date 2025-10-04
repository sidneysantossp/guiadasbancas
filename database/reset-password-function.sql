-- Função para buscar user_id por email (para reset de senha local)
-- Execute este SQL no Supabase SQL Editor

CREATE OR REPLACE FUNCTION public.get_user_id_by_email(user_email text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_id uuid;
BEGIN
  SELECT id INTO user_id
  FROM auth.users
  WHERE email ILIKE user_email
  LIMIT 1;
  
  RETURN user_id;
END;
$$;

-- Permitir execução da função
GRANT EXECUTE ON FUNCTION public.get_user_id_by_email(text) TO anon, authenticated, service_role;
