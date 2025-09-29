import { NextRequest, NextResponse } from "next/server";
import { readBancas, writeBancas, type AdminBanca } from "@/lib/server/bancasStore";
function verifyAdminAuth(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  return Boolean(authHeader && authHeader === "Bearer admin-token");
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const includeInactive = searchParams.get("all") === "true";
  const id = searchParams.get("id");
  const latStr = searchParams.get("lat");
  const lngStr = searchParams.get("lng");
  const maxKmStr = searchParams.get("maxKm");
  const items = await readBancas();
  const list = includeInactive ? items : items.filter((c) => c.active);

  // GET by ID (exact or endsWith for slug-id URLs)
  if (id) {
    const it = list.find((b) => b.id === id || b.id.endsWith(id));
    if (!it) return NextResponse.json({ success: false, error: "Banca não encontrada" }, { status: 404 });
    return NextResponse.json({ success: true, data: it });
  }

  // Optional nearby filtering (server-side)
  const lat = latStr ? Number(latStr) : undefined;
  const lng = lngStr ? Number(lngStr) : undefined;
  const maxKm = maxKmStr ? Math.max(0, Number(maxKmStr)) : 50;
  if (typeof lat === 'number' && isFinite(lat) && typeof lng === 'number' && isFinite(lng)) {
    const toRad = (v: number) => (v * Math.PI) / 180;
    const haversine = (a: {lat:number,lng:number}, b: {lat:number,lng:number}) => {
      const R = 6371; // km
      const dLat = toRad(b.lat - a.lat);
      const dLng = toRad(b.lng - a.lng);
      const sa = Math.sin(dLat/2)**2 + Math.cos(toRad(a.lat))*Math.cos(toRad(b.lat))*Math.sin(dLng/2)**2;
      return 2 * R * Math.asin(Math.min(1, Math.sqrt(sa)));
    };
    const withDist = list.map((b) => {
      const bl = typeof b.lat === 'number' ? b.lat : (b.location?.lat ?? undefined);
      const bg = typeof b.lng === 'number' ? b.lng : (b.location?.lng ?? undefined);
      const distance = (typeof bl === 'number' && typeof bg === 'number') ? haversine({lat, lng}, {lat: bl, lng: bg}) : Number.POSITIVE_INFINITY;
      return { item: b, distance };
    });
    const filtered = withDist.filter((r) => r.distance <= maxKm).sort((a,b)=>a.distance-b.distance).map((r)=>({ ...r.item, _distanceKm: r.distance }));
    return NextResponse.json({ success: true, data: filtered });
  }

  return NextResponse.json({ success: true, data: list.sort((a,b)=>a.order-b.order) });
}

export async function POST(request: NextRequest) {
  try {
    if (!verifyAdminAuth(request)) {
      return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
    }
    const body = await request.json();
    const data = body?.data as Partial<AdminBanca>;
    const items = await readBancas();
    const newItem: AdminBanca = {
      id: `banca-${Date.now()}`,
      name: (data.name || "").toString(),
      // legacy fallbacks
      address: (data.address || "").toString(),
      lat: typeof data.lat === 'number' ? data.lat : (data.location?.lat ?? undefined),
      lng: typeof data.lng === 'number' ? data.lng : (data.location?.lng ?? undefined),
      cover: (data.cover || data.images?.cover || "").toString(),
      avatar: (data.avatar || data.images?.avatar || "").toString(),
      // structured
      images: data.images,
      addressObj: data.addressObj,
      location: data.location,
      contact: data.contact,
      socials: data.socials,
      hours: Array.isArray(data.hours) ? data.hours : undefined,
      rating: typeof data.rating === 'number' ? data.rating : undefined,
      tags: Array.isArray(data.tags) ? data.tags.map(String) : undefined,
      payments: Array.isArray(data.payments) ? data.payments.map(String) : undefined,
      gallery: Array.isArray(data.gallery) ? data.gallery.map(String) : undefined,
      featured: Boolean(data.featured ?? false),
      ctaUrl: typeof data.ctaUrl === 'string' ? data.ctaUrl : undefined,
      description: (data.description || "").toString(),
      categories: Array.isArray(data.categories) ? data.categories.map(String) : [],
      active: Boolean(data.active ?? true),
      order: items.length + 1,
    };
    const updated = [...items, newItem];
    await writeBancas(updated);
    return NextResponse.json({ success: true, data: newItem });
  } catch (e) {
    return NextResponse.json({ success: false, error: "Erro ao criar banca" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!verifyAdminAuth(request)) {
      return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
    }
    const body = await request.json();
    const { type, data } = body || {};
    const items = await readBancas();

    if (type === "bulk") {
      await writeBancas(data as AdminBanca[]);
      return NextResponse.json({ success: true, data });
    }

    const idx = items.findIndex((c) => c.id === data?.id);
    if (idx === -1) return NextResponse.json({ success: false, error: "Banca não encontrada" }, { status: 404 });
    const incoming = data as AdminBanca;
    // merge with legacy compatibility
    items[idx] = {
      ...items[idx],
      ...incoming,
      cover: incoming.cover || incoming.images?.cover || items[idx].cover,
      avatar: incoming.avatar || incoming.images?.avatar || items[idx].avatar,
      lat: typeof incoming.lat === 'number' ? incoming.lat : (incoming.location?.lat ?? items[idx].lat),
      lng: typeof incoming.lng === 'number' ? incoming.lng : (incoming.location?.lng ?? items[idx].lng),
    };
    await writeBancas(items);
    return NextResponse.json({ success: true, data: items[idx] });
  } catch (e) {
    return NextResponse.json({ success: false, error: "Erro ao atualizar banca" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!verifyAdminAuth(request)) {
      return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, error: "ID é obrigatório" }, { status: 400 });
    const items = await readBancas();
    const idx = items.findIndex((c) => c.id === id);
    if (idx === -1) return NextResponse.json({ success: false, error: "Banca não encontrada" }, { status: 404 });
    items.splice(idx, 1);
    items.forEach((c, i) => (c.order = i + 1));
    await writeBancas(items);
    return NextResponse.json({ success: true, data: items });
  } catch (e) {
    return NextResponse.json({ success: false, error: "Erro ao excluir banca" }, { status: 500 });
  }
}
