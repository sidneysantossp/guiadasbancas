"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signOut as nextAuthSignOut, useSession } from "next-auth/react";
import MinhaContaSidebar from "@/components/minha-conta/MinhaContaSidebar";

type AccountOrder = {
  id: string;
  total: number;
  status: string;
  created_at: string;
};

type AccountAddress = {
  id: string;
  label: string;
  recipient_name: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  uf: string;
  cep: string;
  phone: string;
  instructions: string;
  is_default: boolean;
};

type AccountProfile = {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  cpf: string;
  avatar_url: string;
  created_at: string | null;
  updated_at: string | null;
  email_editable: boolean;
};

function MinhaContaPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const sessionUser = session?.user
    ? {
        name: session.user.name || "",
        email: session.user.email || "",
        avatar: ((session.user as any)?.avatar_url as string | null) || "",
      }
    : null;

  const [orders, setOrders] = useState<AccountOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [addresses, setAddresses] = useState<AccountAddress[]>([]);
  const [addressesLoading, setAddressesLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [userCreatedAt, setUserCreatedAt] = useState<string | null>(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [profileCPF, setProfileCPF] = useState("");
  const [profileAvatar, setProfileAvatar] = useState("");
  const [profileMsg, setProfileMsg] = useState<string | null>(null);
  const [profileErr, setProfileErr] = useState<string | null>(null);
  const [avatarDragOver, setAvatarDragOver] = useState(false);

  const cancelledStatuses = useMemo(() => ["cancelled", "cancelado", "canceled"], []);
  const finalStatuses = useMemo(() => ["completed", "entregue"], []);

  const inProgressOrders = useMemo(
    () =>
      orders.filter((order) => {
        const statusValue = String(order.status || "").toLowerCase();
        return !finalStatuses.includes(statusValue) && !cancelledStatuses.includes(statusValue);
      }),
    [cancelledStatuses, finalStatuses, orders],
  );

  const totalSpent = useMemo(
    () =>
      orders
        .filter((order) => !cancelledStatuses.includes(String(order.status || "").toLowerCase()))
        .reduce((sum, order) => sum + Number(order.total || 0), 0),
    [cancelledStatuses, orders],
  );

  const recentOrders = useMemo(() => orders.slice(0, 3), [orders]);
  const sidebarUserName = profileName || sessionUser?.name || "Usuario";
  const sidebarUserEmail = profileEmail || sessionUser?.email || "";
  const sidebarMeta =
    profilePhone || userCreatedAt
      ? [profilePhone, userCreatedAt ? formatJoined(userCreatedAt) : null].filter(Boolean).join(" · ")
      : null;

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      const redirectParam = searchParams?.get("redirect");
      let loginUrl = "/entrar/cliente";

      if (redirectParam) {
        loginUrl += `?redirect=${encodeURIComponent(redirectParam)}`;
      } else {
        loginUrl += `?redirect=${encodeURIComponent("/minha-conta/perfil")}`;
      }

      router.replace(loginUrl);
    }
  }, [router, searchParams, status]);

  useEffect(() => {
    const editFlag = searchParams?.get("editar");
    if (editFlag !== null) {
      setEditingProfile(editFlag === "1" || editFlag === "true");
    } else {
      setEditingProfile(false);
    }
  }, [searchParams]);

  useEffect(() => {
    if (status !== "authenticated" || !session?.user) return;

    let active = true;

    const loadProfileModule = async () => {
      setProfileLoading(true);
      setOrdersLoading(true);
      setAddressesLoading(true);

      let localProfileFallback: any = null;
      let localAddressesFallback: AccountAddress[] = [];

      try {
        const rawProfile = localStorage.getItem("gb:userProfile");
        if (rawProfile) localProfileFallback = JSON.parse(rawProfile);
        const rawAddresses = localStorage.getItem("gb:addresses");
        if (rawAddresses) {
          const parsedAddresses = JSON.parse(rawAddresses);
          if (Array.isArray(parsedAddresses)) localAddressesFallback = parsedAddresses;
        }
      } catch {}

      try {
        const [profileResponse, addressesResponse, ordersResponse] = await Promise.all([
          fetch("/api/minha-conta/profile", {
            credentials: "include",
            cache: "no-store",
          }),
          fetch("/api/minha-conta/addresses", {
            credentials: "include",
            cache: "no-store",
          }),
          fetch("/api/orders?limit=20&sort=created_at&order=desc", {
            credentials: "include",
            cache: "no-store",
          }),
        ]);

        const [profileJson, addressesJson, ordersJson] = await Promise.all([
          profileResponse.json().catch(() => null),
          addressesResponse.json().catch(() => null),
          ordersResponse.json().catch(() => null),
        ]);

        if (!active) return;

        if (profileResponse.ok && profileJson?.success) {
          const profile = profileJson.data?.profile as AccountProfile;
          setProfileName(profile?.full_name || session.user.name || "");
          setProfileEmail(profile?.email || session.user.email || "");
          setProfilePhone(profile?.phone || "");
          setProfileCPF(maskCPF(profile?.cpf || ""));
          setProfileAvatar(profile?.avatar_url || sessionUser?.avatar || "");
          setUserCreatedAt(profile?.created_at || null);
        } else {
          setProfileName(session.user.name || "");
          setProfileEmail(session.user.email || "");
          setProfilePhone(localProfileFallback?.phone || "");
          setProfileCPF(maskCPF(localProfileFallback?.cpf || ""));
          setProfileAvatar(sessionUser?.avatar || localProfileFallback?.avatar || "");
        }

        if (addressesResponse.ok && addressesJson?.success && Array.isArray(addressesJson.data)) {
          setAddresses(addressesJson.data);
        } else {
          setAddresses(localAddressesFallback);
        }

        if (ordersResponse.ok && Array.isArray(ordersJson?.items)) {
          setOrders(ordersJson.items);
        } else {
          setOrders([]);
        }
      } finally {
        if (active) {
          setProfileLoading(false);
          setOrdersLoading(false);
          setAddressesLoading(false);
        }
      }
    };

    loadProfileModule();

    return () => {
      active = false;
    };
  }, [session, sessionUser?.avatar, status]);

  async function logout() {
    try {
      sessionStorage.clear();
      localStorage.removeItem("gb:userProfile");
      localStorage.removeItem("gb:userCreatedAt");
      localStorage.removeItem("gb:dashboardActiveMenu");
    } catch {}
    await nextAuthSignOut({ callbackUrl: "/" });
  }

  function setEditMode(value: boolean) {
    setEditingProfile(value);
    try {
      const params = new URLSearchParams(searchParams?.toString() || "");
      if (value) params.set("editar", "1");
      else params.delete("editar");
      const nextUrl = params.toString() ? `/minha-conta/perfil?${params.toString()}` : "/minha-conta/perfil";
      router.replace(nextUrl, { scroll: false });
    } catch {}
  }

  async function saveProfile() {
    setProfileErr(null);
    setProfileMsg(null);

    const cpfDigits = (profileCPF || "").replace(/\D+/g, "");
    if (cpfDigits && !isValidCPF(cpfDigits)) {
      setProfileErr("CPF invalido");
      return;
    }

    try {
      const response = await fetch("/api/minha-conta/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          full_name: profileName,
          phone: profilePhone,
          cpf: cpfDigits,
          avatar_url: profileAvatar,
        }),
      });

      const json = await response.json().catch(() => null);
      if (!response.ok || !json?.success) {
        throw new Error(json?.error || "Nao foi possivel salvar o perfil");
      }

      const nextProfile = json.data?.profile as AccountProfile | undefined;
      setProfileName(nextProfile?.full_name || profileName);
      setProfileEmail(nextProfile?.email || profileEmail);
      setProfilePhone(nextProfile?.phone || profilePhone);
      setProfileCPF(maskCPF(nextProfile?.cpf || cpfDigits));
      setProfileAvatar(nextProfile?.avatar_url || profileAvatar);
      setUserCreatedAt(nextProfile?.created_at || userCreatedAt);

      try {
        localStorage.setItem(
          "gb:userProfile",
          JSON.stringify({
            phone: nextProfile?.phone || profilePhone,
            cpf: nextProfile?.cpf || cpfDigits,
            avatar: nextProfile?.avatar_url || profileAvatar,
          }),
        );
      } catch {}

      setProfileMsg("Perfil salvo com sucesso.");
      setEditMode(false);
    } catch (error: any) {
      setProfileErr(error?.message || "Nao foi possivel salvar o perfil");
    }
  }

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-orange-600" />
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!sessionUser) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-orange-600" />
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="container-max py-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <MinhaContaSidebar
          currentKey="perfil"
          userName={sidebarUserName}
          userEmail={sidebarUserEmail}
          userMeta={sidebarMeta}
          avatarUrl={profileAvatar || sessionUser.avatar}
          onLogout={logout}
        />

        <main className="space-y-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-md lg:col-span-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#ff5c00]">Conta do cliente</p>
            <h1 className="mt-1 text-2xl font-bold text-gray-900">Perfil e dados</h1>
            <p className="mt-2 text-sm text-gray-600">
              A base da sua conta para comprar com menos atrito: identidade, contato, endereco e sinais principais de relacionamento.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Pedidos" value={orders.length} description="Compras registradas na plataforma." />
            <MetricCard label="Em andamento" value={inProgressOrders.length} description="Pedidos que ainda exigem acompanhamento." />
            <MetricCard label="Enderecos" value={addresses.length} description="Bases salvas para checkout e entrega." />
            <MetricCard
              label="Total gasto"
              value={new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(totalSpent)}
              description="Volume financeiro ja movimentado pela sua conta."
            />
          </div>

          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
            <div className="font-semibold">Objetivo desta area</div>
            <p className="mt-2 text-blue-800">
              Manter seus dados corretos, seus enderecos prontos para checkout e sua conta preparada para comprar com clareza.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-base font-semibold text-gray-900">Dados pessoais</h2>
              <button
                type="button"
                onClick={() => setEditMode(!editingProfile)}
                className="rounded-full border border-gray-300 bg-white px-3 py-1.5 text-sm font-semibold hover:bg-gray-50"
              >
                {editingProfile ? "Cancelar" : "Editar perfil"}
              </button>
            </div>

            {!editingProfile ? (
              <div className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                <InfoPill label="Nome" value={profileName || "-"} />
                <InfoPill label="Telefone" value={profilePhone || "-"} />
                <InfoPill label="E-mail" value={profileEmail || "-"} full />
                <InfoPill label="CPF" value={profileCPF || "-"} />
                <InfoPill label="Enderecos salvos" value={addressesLoading ? "..." : String(addresses.length)} />
              </div>
            ) : (
              <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div
                  className={`grid place-items-center rounded-xl border bg-gray-50 p-4 text-center ${
                    avatarDragOver ? "border-orange-400 ring-2 ring-orange-200" : "border-gray-200"
                  }`}
                  onDragOver={(event) => {
                    event.preventDefault();
                    setAvatarDragOver(true);
                  }}
                  onDragLeave={() => setAvatarDragOver(false)}
                  onDrop={(event) => {
                    event.preventDefault();
                    setAvatarDragOver(false);
                    const file = event.dataTransfer?.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = () => setProfileAvatar(String(reader.result || ""));
                    reader.readAsDataURL(file);
                  }}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="relative h-28 w-28 overflow-hidden rounded-lg border border-dashed border-gray-300 bg-white/70">
                      {profileAvatar ? (
                        <Image src={profileAvatar} alt="Avatar" fill sizes="112px" className="object-cover" />
                      ) : (
                        <div className="grid h-full w-full place-items-center text-xs text-gray-400">Sem foto</div>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      Arraste uma imagem ou escolha um arquivo.
                      <label className="ml-1 inline-flex cursor-pointer items-center justify-center rounded-md border border-gray-300 bg-white px-2 py-1 text-xs font-semibold hover:bg-gray-50">
                        selecionar
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(event) => {
                            const file = event.target.files?.[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = () => setProfileAvatar(String(reader.result || ""));
                            reader.readAsDataURL(file);
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 lg:col-span-2 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="text-sm text-gray-700">Nome</label>
                    <input className="input mt-1" value={profileName} onChange={(event) => setProfileName(event.target.value)} placeholder="Seu nome" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-700">Telefone</label>
                    <input className="input mt-1" value={profilePhone} onChange={(event) => setProfilePhone(maskPhone(event.target.value))} placeholder="(11) 99999-9999" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-700">E-mail da conta</label>
                    <input className="input mt-1 bg-gray-50 text-gray-500" type="email" value={profileEmail} readOnly disabled />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-sm text-gray-700">CPF</label>
                    <input className="input mt-1" value={profileCPF} onChange={(event) => setProfileCPF(maskCPF(event.target.value))} placeholder="000.000.000-00" />
                  </div>
                  <div className="sm:col-span-2 text-xs text-gray-500">
                    O e-mail da conta continua sendo o identificador principal de acesso. Alteracoes cadastrais mais sensiveis ficam fora deste modulo.
                  </div>
                  {(profileErr || profileMsg) ? (
                    <div className={`sm:col-span-2 rounded-md px-3 py-2 text-sm ${profileErr ? "border border-red-200 bg-red-50 text-red-700" : "border border-green-200 bg-green-50 text-green-700"}`}>
                      {profileErr || profileMsg}
                    </div>
                  ) : null}
                  <div className="sm:col-span-2 flex items-center justify-end gap-2">
                    <button type="button" onClick={() => setEditMode(false)} className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold hover:bg-gray-50">
                      Cancelar
                    </button>
                    <button
                      type="button"
                      className="rounded-md bg-[#ff5c00] px-4 py-2 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-60"
                      disabled={profileLoading}
                      onClick={saveProfile}
                    >
                      {profileLoading ? "Salvando..." : "Salvar perfil"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-base font-semibold text-gray-900">Enderecos salvos</h2>
              <Link href="/minha-conta/enderecos" className="rounded-full border border-gray-300 bg-white px-3 py-1.5 text-sm font-semibold hover:bg-gray-50">
                Gerenciar enderecos
              </Link>
            </div>

            {addressesLoading ? (
              <div className="mt-4 text-sm text-gray-500">Carregando enderecos...</div>
            ) : addresses.length === 0 ? (
              <div className="mt-4 text-sm text-gray-500">Nenhum endereco cadastrado ainda.</div>
            ) : (
              <div className="mt-4 grid gap-3">
                {addresses.slice(0, 2).map((address) => (
                  <div key={address.id} className="rounded-xl border border-gray-200 p-3 text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-semibold text-gray-900">
                        {address.street}
                        {address.number ? `, ${address.number}` : ""}
                      </div>
                      {address.is_default ? (
                        <span className="rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700">
                          Principal
                        </span>
                      ) : null}
                    </div>
                    <div className="text-gray-600">
                      {address.neighborhood} · {address.city} - {address.uf} {address.cep ? `(CEP: ${address.cep})` : ""}
                    </div>
                    {address.complement ? <div className="text-gray-500">Comp.: {address.complement}</div> : null}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-base font-semibold text-gray-900">Pedidos recentes</h2>
                <Link href="/minha-conta/pedidos" className="text-sm font-semibold text-[#ff5c00] hover:opacity-80">
                  Ver pedidos
                </Link>
              </div>
              <div className="mt-3 space-y-3">
                {ordersLoading ? (
                  <div className="text-sm text-gray-500">Carregando pedidos...</div>
                ) : recentOrders.length === 0 ? (
                  <div className="text-sm text-gray-500">Sua conta ainda nao possui pedidos.</div>
                ) : (
                  recentOrders.map((order) => (
                    <Link key={order.id} href={`/minha-conta/pedidos/${order.id}`} className="block rounded-xl border border-gray-200 p-3 hover:bg-gray-50">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold text-gray-900">Pedido {order.id}</div>
                          <div className="text-xs text-gray-500">{new Date(order.created_at).toLocaleString("pt-BR")}</div>
                        </div>
                        <div className="text-sm font-semibold text-gray-900">
                          {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(order.total || 0))}
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <h2 className="text-base font-semibold text-gray-900">Proximos passos</h2>
              <div className="mt-3 space-y-3 text-sm text-gray-600">
                <div className="rounded-xl border border-gray-200 p-3">
                  <div className="font-semibold text-gray-900">Revise sua central de compras</div>
                  <p className="mt-1">Acompanhe historico, recorrencia e incentivos disponiveis na sua conta.</p>
                  <Link href="/minha-conta/inteligencia" className="mt-3 inline-flex text-sm font-semibold text-[#ff5c00] hover:opacity-80">
                    Abrir central
                  </Link>
                </div>
                <div className="rounded-xl border border-gray-200 p-3">
                  <div className="font-semibold text-gray-900">Mantenha enderecos atualizados</div>
                  <p className="mt-1">Isso reduz erro no checkout e acelera compras futuras.</p>
                  <Link href="/minha-conta/enderecos" className="mt-3 inline-flex text-sm font-semibold text-[#ff5c00] hover:opacity-80">
                    Revisar enderecos
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </section>
  );
}

export default function MinhaContaPageClient() {
  return (
    <Suspense
      fallback={
        <div className="container-max py-8">
          <div className="animate-pulse">
            <div className="mb-4 h-8 w-48 rounded bg-gray-200" />
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
              <div className="h-64 rounded-xl bg-gray-200" />
              <div className="h-64 rounded-xl bg-gray-200 lg:col-span-3" />
            </div>
          </div>
        </div>
      }
    >
      <MinhaContaPageContent />
    </Suspense>
  );
}

function MetricCard({ label, value, description }: { label: string; value: string | number; description: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">{label}</div>
      <div className="mt-3 text-2xl font-semibold text-gray-900">{value}</div>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
    </div>
  );
}

function InfoPill({ label, value, full = false }: { label: string; value: string; full?: boolean }) {
  return (
    <div className={`flex items-center gap-2 rounded-md bg-gray-50 px-3 py-2 ${full ? "sm:col-span-2" : ""}`}>
      <span className="text-gray-600">{label}</span>
      <span className="truncate font-medium">{value}</span>
    </div>
  );
}

function maskCPF(value: string) {
  const digits = (value || "").replace(/\D+/g, "").slice(0, 11);
  return digits.replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function isValidCPF(cpf: string) {
  const digits = (cpf || "").replace(/\D+/g, "");
  if (!digits || digits.length !== 11 || /^(\d)\1{10}$/.test(digits)) return false;

  let sum = 0;
  for (let index = 0; index < 9; index += 1) sum += parseInt(digits.charAt(index), 10) * (10 - index);
  let remainder = 11 - (sum % 11);
  if (remainder >= 10) remainder = 0;
  if (remainder !== parseInt(digits.charAt(9), 10)) return false;

  sum = 0;
  for (let index = 0; index < 10; index += 1) sum += parseInt(digits.charAt(index), 10) * (11 - index);
  remainder = 11 - (sum % 11);
  if (remainder >= 10) remainder = 0;

  return remainder === parseInt(digits.charAt(10), 10);
}

function maskPhone(value: string) {
  const digits = (value || "").replace(/\D+/g, "").slice(0, 11);
  if (digits.length <= 10) {
    return digits.replace(/(\d{2})(\d{4})(\d{0,4})/, (match, area, start, end) => (end ? `(${area}) ${start}-${end}` : `(${area}) ${start}`));
  }
  return digits.replace(/(\d{2})(\d{5})(\d{0,4})/, (match, area, start, end) => (end ? `(${area}) ${start}-${end}` : `(${area}) ${start}`));
}

function formatJoined(dateStr: string) {
  try {
    const date = new Date(dateStr);
    const formatted = date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
    return `Entrou em ${formatted.replace(/\./g, "")}`;
  } catch {
    return "";
  }
}
