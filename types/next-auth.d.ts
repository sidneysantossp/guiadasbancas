import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name?: string | null;
    role?: string;
    banca_id?: string | null;
    avatar_url?: string | null;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      role?: string;
      banca_id?: string | null;
      avatar_url?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
    banca_id?: string | null;
    avatar_url?: string | null;
  }
}
