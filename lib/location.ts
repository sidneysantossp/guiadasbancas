export type UserLocation = {
  cep: string;
  lat: number;
  lng: number;
  city?: string;
  state?: string;
  street?: string;
  neighborhood?: string;
  houseNumber?: string;
  source?: 'geolocation' | 'cep' | 'manual' | 'ip';
  accuracy?: 'precise' | 'approx';
};

export function formatCep(cep: string) {
  const digits = cep.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

export async function reverseGeocodeByCoords(lat: number, lng: number) {
  const url = new URL('https://nominatim.openstreetmap.org/reverse');
  url.searchParams.set('format', 'json');
  url.searchParams.set('lat', String(lat));
  url.searchParams.set('lon', String(lng));
  // Zoom maior para tentar obter número e bairro
  url.searchParams.set('zoom', '18');
  url.searchParams.set('addressdetails', '1');
  const res = await fetch(url.toString(), {
    headers: { "Accept-Language": "pt-BR", "User-Agent": "guiadasbancas/0.1" },
    cache: 'no-store'
  });
  if (!res.ok) return null;
  const data = await res.json();
  const addr = data?.address || {};
  return {
    street: addr.road || addr.pedestrian || addr.residential || addr.cycleway || undefined,
    houseNumber: addr.house_number || undefined,
    neighborhood: addr.suburb || addr.neighbourhood || addr.quarter || addr.city_district || addr.village || addr.town || undefined,
    city: addr.city || addr.town || addr.village || undefined,
    state: addr.state || addr.region || undefined,
    cep: addr.postcode || undefined,
  } as Partial<UserLocation>;
}

export async function buildLocationFromCoords(lat: number, lng: number): Promise<UserLocation> {
  const rev = await reverseGeocodeByCoords(lat, lng);
  return {
    cep: rev?.cep ? formatCep(String(rev.cep)) : '',
    lat, lng,
    city: rev?.city,
    state: rev?.state,
    street: rev?.street,
    neighborhood: rev?.neighborhood,
    houseNumber: rev?.houseNumber,
    source: 'geolocation',
    accuracy: 'precise',
  };
}

export async function saveCoordsAsLocation(lat: number, lng: number): Promise<UserLocation> {
  const loc = await buildLocationFromCoords(lat, lng);
  saveStoredLocation(loc);
  return loc;
}

export function isValidCep(cep: string) {
  return /^\d{5}-?\d{3}$/.test(cep);
}

export async function fetchCepBrasilAPI(cep: string) {
  const clean = cep.replace(/\D/g, "");
  const url = `https://brasilapi.com.br/api/cep/v2/${clean}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("CEP não encontrado");
  return res.json();
}

export async function geocodeByAddressNominatim(address: string) {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", address);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "1");
  const res = await fetch(url.toString(), {
    headers: { "Accept-Language": "pt-BR", "User-Agent": "guiadasbancas/0.1" },
  });
  if (!res.ok) return null;
  const data = await res.json();
  if (Array.isArray(data) && data[0]) {
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  }
  return null;
}

export function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371; // km
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const sinDLat = Math.sin(dLat / 2);
  const sinDLon = Math.sin(dLon / 2);
  const c = 2 * Math.asin(Math.sqrt(sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLon * sinDLon));
  return R * c;
}

// Storage helpers (client-side only)
const STORAGE_KEY = "gdb_location";

export function loadStoredLocation(): UserLocation | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as UserLocation;
  } catch (_) {
    return null;
  }
}

export function saveStoredLocation(loc: UserLocation) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(loc));
  console.log('[Location] 💾 Salvando localização:', { source: loc.source, lat: loc.lat, lng: loc.lng });
  
  // 🔒 Se for CEP manual, marcar como prioritário para evitar sobrescrita por geolocalização
  if (loc.source === 'cep') {
    sessionStorage.setItem('gdb_location_manual', 'true');
    console.log('[Location] 🔒 Localização manual (CEP) - bloqueando geolocalização automática');
  }
  
  try {
    const ev = new CustomEvent('gdb:location-updated', { detail: loc });
    window.dispatchEvent(ev);
    console.log('[Location] 📡 Evento gdb:location-updated disparado');
  } catch (e) {
    console.error('[Location] ❌ Erro ao disparar evento:', e);
  }
}

// Resolve CEP to lat/lng using BrasilAPI; fallback to Nominatim by city+state if coordinates missing
export async function resolveCepToLocation(cep: string): Promise<UserLocation> {
  const cepFormatted = formatCep(cep);
  const data = await fetchCepBrasilAPI(cepFormatted);
  let lat: number | null = null;
  let lng: number | null = null;
  if (data && data.location && data.location.coordinates) {
    const c = data.location.coordinates;
    lat = parseFloat(c.latitude);
    lng = parseFloat(c.longitude);
  }
  if (lat == null || lng == null) {
    const address = `${data.city || data.location?.city || ""}, ${data.state}`;
    const coords = await geocodeByAddressNominatim(address);
    if (coords) {
      lat = coords.lat;
      lng = coords.lng;
    }
  }
  if (lat == null || lng == null) throw new Error("Não foi possível obter coordenadas para o CEP informado.");
  return {
    cep: cepFormatted,
    lat,
    lng,
    city: data.city,
    state: data.state,
    street: data.street || data.address || undefined,
    neighborhood: data.neighborhood || data.district || undefined,
    source: 'cep',
    accuracy: 'approx',
  };
}
