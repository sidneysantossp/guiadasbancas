# 🔐 Criar Usuário de Teste no Supabase

## Problema Atual
O login está retornando "invalid login credentials" porque:
1. O usuário pode não ter sido criado no Supabase Auth
2. A senha pode estar incorreta
3. O email pode não ter sido confirmado

## Solução Rápida

### Opção 1: Via SQL Editor do Supabase

Execute este SQL no Supabase SQL Editor:

```sql
-- 1. Verificar se o usuário existe
SELECT * FROM auth.users WHERE email = 'seu@email.com';

-- 2. Se não existir, você precisa criar via interface ou desabilitar confirmação de email
```

### Opção 2: Desabilitar Confirmação de Email (RECOMENDADO para desenvolvimento)

1. Vá para o Supabase Dashboard
2. Authentication → Settings
3. **Email Auth** → Desmarque "Enable email confirmations"
4. Salve

Agora tente registrar novamente em: `http://localhost:3000/jornaleiro/registrar`

### Opção 3: Criar Usuário Manualmente via Dashboard

1. Supabase Dashboard → Authentication → Users
2. Clique em "Add user"
3. Preencha:
   - **Email:** teste@jornaleiro.com
   - **Password:** senha123
   - **Auto Confirm User:** ✅ SIM
4. Clique em "Create user"

5. Depois, execute este SQL para criar o perfil:

```sql
-- Criar perfil do jornaleiro
INSERT INTO public.user_profiles (id, role, full_name, phone)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'teste@jornaleiro.com'),
  'jornaleiro',
  'Jornaleiro Teste',
  '11999999999'
);

-- Criar banca de teste
INSERT INTO public.bancas (
  user_id,
  name,
  cep,
  address,
  lat,
  lng,
  whatsapp,
  email,
  delivery_fee,
  min_order_value,
  delivery_radius,
  preparation_time,
  payment_methods,
  active,
  approved
)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'teste@jornaleiro.com'),
  'Banca Teste',
  '01310-100',
  'Av. Paulista, 1000 - Bela Vista, São Paulo - SP',
  -23.5505,
  -46.6333,
  '11999999999',
  'teste@jornaleiro.com',
  5.00,
  10.00,
  5,
  30,
  ARRAY['pix', 'dinheiro'],
  true,
  true
);

-- Atualizar perfil com banca_id
UPDATE public.user_profiles
SET banca_id = (SELECT id FROM public.bancas WHERE user_id = (SELECT id FROM auth.users WHERE email = 'teste@jornaleiro.com'))
WHERE id = (SELECT id FROM auth.users WHERE email = 'teste@jornaleiro.com');
```

### Opção 4: Usar API de Teste

Criei uma API para facilitar:

```bash
# Criar usuário de teste
curl -X POST http://localhost:3000/api/test/create-user \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@jornaleiro.com",
    "password": "senha123",
    "full_name": "Jornaleiro Teste",
    "role": "jornaleiro"
  }'
```

## Credenciais de Teste

Após criar o usuário:

- **Email:** teste@jornaleiro.com
- **Senha:** senha123

## Verificar se Funcionou

1. Acesse: http://localhost:3000/login
2. Entre com as credenciais acima
3. Deve redirecionar para: http://localhost:3000/jornaleiro/dashboard

## Troubleshooting

### "Email not confirmed"
- Vá em Authentication → Users
- Clique no usuário
- Clique em "Confirm email"

### "Invalid login credentials"
- Verifique se o email está correto
- Verifique se a senha tem pelo menos 6 caracteres
- Tente resetar a senha via "Esqueci a senha"

### "User already registered"
- O usuário já existe
- Use "Esqueci a senha" para resetar
- Ou delete o usuário e crie novamente

## Próximos Passos

Depois de conseguir fazer login:
1. Complete o perfil da banca
2. Adicione produtos
3. Configure formas de pagamento
4. Configure entrega

---

**Última Atualização:** 30/09/2025 09:15
