# 🔐 RELATÓRIO DE INVESTIGAÇÃO: SISTEMA DE AUTENTICAÇÃO

**Data:** 24/11/2025  
**Status:** CRÍTICO - Múltiplos problemas identificados

---

## 📋 RESUMO EXECUTIVO

O sistema de autenticação possui **problemas graves de arquitetura** que causam:
- Erro React #310 (hidratação)
- Loops infinitos de redirecionamento
- Inconsistência entre sessões
- Falhas de segurança

---

## 🔴 PROBLEMAS CRÍTICOS IDENTIFICADOS

### 1. **ARQUITETURA FRAGMENTADA DE AUTENTICAÇÃO**

O sistema usa **3 métodos diferentes** de autenticação que não se comunicam:

| Área | Método | Problema |
|------|--------|----------|
| **Jornaleiro** | NextAuth + Supabase Auth | ✅ Correto, mas com bugs |
| **Admin** | localStorage hardcoded | ❌ CRÍTICO: Sem segurança real |
| **Cliente (minha-conta)** | localStorage manual | ❌ CRÍTICO: Sem autenticação real |

**Arquivo:** `app/admin/login/page.tsx` (linha 31-43)
```typescript
// PROBLEMA: Credenciais hardcoded no código!
if (email === "admin@guiadasbancas.com" && password === "admin123") {
  localStorage.setItem("gb:adminAuth", "1");
  // ...
}
```

**Arquivo:** `app/minha-conta/page.tsx` (linha 79)
```typescript
// PROBLEMA: Autenticação via localStorage, não é real auth
const raw = localStorage.getItem("gb:user");
if (raw) setUser(JSON.parse(raw));
```

---

### 2. **ERRO REACT #310 - HIDRATAÇÃO**

**Causa raiz:** Renderização condicional baseada em `user` que difere entre servidor e cliente.

**Arquivo:** `components/Navbar.tsx` (linha 669)
```typescript
// O servidor renderiza null (sem user)
// O cliente renderiza o menu (com user do localStorage)
{mounted && user ? (
  <div id="account-menu">...
```

**Problema:** O `user` é carregado do localStorage após montar, causando mismatch.

**Arquivos afetados:**
- `components/Navbar.tsx` - Usa localStorage para user
- `app/jornaleiro/layout.tsx` - Usa NextAuth + Supabase
- `app/admin/layout.tsx` - Usa localStorage

---

### 3. **LOOP INFINITO NO ONBOARDING**

**Fluxo problemático:**
1. Usuário faz login → sessão NextAuth criada
2. Redireciona para `/jornaleiro/dashboard`
3. Layout valida: tem sessão? ✅ Tem banca? ❌
4. Redireciona para `/jornaleiro/registrar`
5. Registrar vê que já tem sessão → volta pro dashboard
6. **LOOP!**

**Arquivo:** `app/jornaleiro/layout.tsx` (linha 324-326)
```typescript
if (!pathname?.startsWith('/jornaleiro/registrar')) {
  router.push('/jornaleiro/registrar');
}
```

---

### 4. **CONFLITO ENTRE useSession E useAuth**

**Problema:** Alguns componentes usam `useSession` do NextAuth diretamente, outros usam `useAuth` do contexto.

| Componente | Método | Fonte de Verdade |
|------------|--------|------------------|
| `JornaleiroLoginPage` | `useSession` | NextAuth direto |
| `JornaleiroLayout` | `useAuth` | AuthContext |
| `Navbar` | localStorage + `useAuth` | Ambos (conflito!) |

---

### 5. **CACHE PROBLEMÁTICO**

**localStorage keys usadas:**
```
gb:user           - Usuário cliente (manual)
gb:userProfile    - Perfil cliente (manual)
gb:adminAuth      - Flag admin (hardcoded)
gb:admin          - Dados admin (hardcoded)
gb:bancaData      - Dados da banca (wizard)
gb:orders         - Pedidos
gb:addresses      - Endereços
gb:wishlist       - Favoritos
```

**sessionStorage keys usadas:**
```
gb:banca:{userId} - Cache da banca (jornaleiro)
gb:branding       - Branding
```

**Problema:** Esses caches podem ficar dessincronizados com o estado real do NextAuth.

---

### 6. **REDIRECIONAMENTOS CONFLITANTES**

| Arquivo | Quando | Para Onde |
|---------|--------|-----------|
| `jornaleiro/page.tsx` | Já autenticado | `/jornaleiro/dashboard` |
| `jornaleiro/registrar/page.tsx` | Já é jornaleiro | `/jornaleiro/dashboard` |
| `jornaleiro/layout.tsx` | Sem banca | `/jornaleiro/registrar` |
| `jornaleiro/onboarding/page.tsx` | Já tem banca | `/jornaleiro/dashboard` |

**Conflito:** Se o usuário tem sessão mas não tem banca, o sistema fica em loop entre registrar e dashboard.

---

## 🛠️ PLANO DE CONTINGÊNCIA

### FASE 1: CORREÇÃO IMEDIATA (Hot Fix)

**Objetivo:** Resolver o erro #310 e loops imediatamente.

#### 1.1 Simplificar o fluxo de redirecionamento do jornaleiro

```typescript
// app/jornaleiro/layout.tsx - NOVA LÓGICA
// 1. Se isAuthRoute (login, registrar, onboarding) → permitir
// 2. Se não tem sessão → redirecionar para /jornaleiro
// 3. Se tem sessão mas não tem banca → mostrar aviso, NÃO redirecionar em loop
// 4. Se tem sessão e tem banca → permitir acesso
```

#### 1.2 Remover o uso de localStorage no Navbar para user

```typescript
// components/Navbar.tsx - ANTES
const [user, setUser] = useState<...>(null);
useEffect(() => {
  const raw = localStorage.getItem("gb:user");
  if (raw) setUser(JSON.parse(raw));
}, []);

// DEPOIS - Usar apenas useSession do NextAuth
const { data: session } = useSession();
const user = session?.user || null;
```

---

### FASE 2: REFATORAÇÃO ESTRUTURAL (1-2 dias)

#### 2.1 Unificar sistema de autenticação

**Implementar NextAuth para TODAS as áreas:**

| Área | Mudança |
|------|---------|
| Jornaleiro | ✅ Já usa NextAuth |
| Admin | 🔄 Migrar para NextAuth com role="admin" |
| Cliente | 🔄 Migrar para NextAuth com role="cliente" |

#### 2.2 Criar middleware de proteção de rotas

```typescript
// middleware.ts - NOVO
import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ req, token }) => {
      const path = req.nextUrl.pathname;
      
      if (path.startsWith("/admin")) {
        return token?.role === "admin";
      }
      if (path.startsWith("/jornaleiro")) {
        // Permitir login/registrar sem token
        if (path === "/jornaleiro" || path.startsWith("/jornaleiro/registrar")) {
          return true;
        }
        return token?.role === "jornaleiro" || token?.role === "seller";
      }
      return true;
    },
  },
});

export const config = {
  matcher: ["/admin/:path*", "/jornaleiro/:path*"],
};
```

#### 2.3 Remover localStorage para autenticação

**Manter apenas para:**
- Preferências do usuário (tema, etc)
- Cache de carrinho
- Cache de localização

**Remover completamente:**
- `gb:user` → Usar sessão NextAuth
- `gb:adminAuth` → Usar sessão NextAuth
- `gb:admin` → Usar sessão NextAuth

---

### FASE 3: MIGRAÇÃO DO ADMIN (2-3 dias)

#### 3.1 Criar autenticação real para admin

```typescript
// lib/auth.ts - MODIFICAR authorize()
async authorize(credentials) {
  // ... auth existente ...
  
  // Verificar se é admin
  if (profile.role === 'admin') {
    return {
      id: authData.user.id,
      email: authData.user.email,
      role: 'admin',
      // ...
    };
  }
}
```

#### 3.2 Atualizar admin login

```typescript
// app/admin/login/page.tsx - NOVO
const result = await signIn("credentials", {
  redirect: false,
  email,
  password,
});

if (result?.ok) {
  // Verificar se é admin
  const session = await getSession();
  if (session?.user?.role === 'admin') {
    router.replace("/admin/dashboard");
  } else {
    setError("Acesso negado. Apenas administradores.");
  }
}
```

---

## 📊 MATRIZ DE RISCOS

| Problema | Impacto | Probabilidade | Prioridade |
|----------|---------|---------------|------------|
| Erro #310 | Alto | 100% | 🔴 CRÍTICO |
| Loop infinito | Alto | 80% | 🔴 CRÍTICO |
| Admin hardcoded | Crítico | 100% | 🔴 SEGURANÇA |
| Cache desatualizado | Médio | 60% | 🟡 MÉDIO |
| Sessões conflitantes | Alto | 40% | 🟡 MÉDIO |

---

## ✅ AÇÕES IMEDIATAS

### Para resolver AGORA o erro #310:

1. **Simplificar Navbar** - Remover localStorage para user
2. **Proteger renderização condicional** - Usar `mounted` em TODOS os lugares que usam dados do cliente
3. **Unificar loading states** - Mesma mensagem em servidor e cliente
4. **Remover onboarding como rota de redirecionamento** - Usar apenas `registrar`

---

## 📁 ARQUIVOS PARA MODIFICAR

### Prioridade CRÍTICA:
1. `components/Navbar.tsx` - Remover localStorage, usar useSession
2. `app/jornaleiro/layout.tsx` - Simplificar lógica de redirecionamento
3. `app/jornaleiro/onboarding/page.tsx` - Remover ou simplificar drasticamente

### Prioridade ALTA:
4. `app/admin/login/page.tsx` - Migrar para NextAuth
5. `app/admin/layout.tsx` - Migrar para NextAuth
6. `app/minha-conta/page.tsx` - Migrar para NextAuth

### Prioridade MÉDIA:
7. `lib/auth/AuthContext.tsx` - Limpar lógica redundante
8. `middleware.ts` - Criar proteção centralizada

---

## 🔧 PRÓXIMOS PASSOS

1. **Aprovar este relatório** com o usuário
2. **Implementar FASE 1** - Hot fix (30min - 1h)
3. **Testar exaustivamente** em ambiente de desenvolvimento
4. **Implementar FASE 2** - Refatoração (1-2 dias)
5. **Implementar FASE 3** - Migração admin (2-3 dias)

---

*Relatório gerado automaticamente por Cascade*
