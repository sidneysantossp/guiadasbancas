import "server-only";

import { supabaseAdmin } from "@/lib/supabase";

function normalizeSearchTerm(value: string) {
  return String(value || "")
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
}

function buildSearchVariants(value: string): string[] {
  const normalized = normalizeSearchTerm(value);
  const base = String(value || "").trim().toLowerCase();
  const variants = new Set<string>();
  if (base) variants.add(base);
  if (normalized) variants.add(normalized);

  const vowels = ['a', 'e', 'i', 'o', 'u'] as const;
  const acuteMap: Record<typeof vowels[number], string> = {
    a: 'á', e: 'é', i: 'í', o: 'ó', u: 'ú'
  };
  for (const v of vowels) {
    const idx = normalized.indexOf(v);
    if (idx !== -1) {
      variants.add(normalized.slice(0, idx) + acuteMap[v] + normalized.slice(idx + 1));
      break;
    }
  }

  return Array.from(variants).filter((v) => v.length >= 2).slice(0, 4);
}

export async function getSearchProducts(query: string, limit = 20): Promise<any[]> {
  const term = String(query || "").trim();
  if (!term) return [];
  
  try {
    const normalized = normalizeSearchTerm(term);
    const words = normalized
      .split(/\s+/)
      .filter(word => word.length >= 2)
      .slice(0, 5);
    
    if (words.length === 0) return [];
    
    const allConditions: string[] = [];
    for (const word of words) {
      const variants = buildSearchVariants(word);
      const terms = variants.length ? variants : [word];
      for (const t of terms) {
        allConditions.push(`name.ilike.%${t}%`);
        allConditions.push(`codigo_mercos.ilike.%${t}%`);
      }
    }
    
    let query_builder = supabaseAdmin
      .from('products')
      .select(`
        id,
        name,
        price,
        price_original,
        discount_percent,
        images,
        banca_id,
        distribuidor_id,
        category_id,
        description,
        stock_qty,
        track_stock
      `)
      .eq('active', true)
      .or(allConditions.join(','))
      .limit(limit * 3);
    
    const { data: items, error } = await query_builder;
    
    if (error || !items) return [];
    
    const bancaIds = Array.from(new Set(items.map(p => p.banca_id).filter(Boolean)));
    const categoryIds = Array.from(new Set(items.map(p => p.category_id).filter(Boolean)));
    
    const [bancasRes, categoriesRes] = await Promise.all([
      bancaIds.length
        ? supabaseAdmin.from('bancas').select('id, name, cover_image, whatsapp, lat, lng, is_cotista, cotista_id').in('id', bancaIds)
        : { data: [] },
      categoryIds.length
        ? supabaseAdmin.from('categories').select('id, name').in('id', categoryIds)
        : { data: [] }
    ]);
    
    const bancaMap = new Map((bancasRes.data || []).map((b: any) => [b.id, b]));
    const categoryMap = new Map((categoriesRes.data || []).map((c: any) => [c.id, c]));
    
    const isActiveCotistaBanca = (b: any) => (b?.is_cotista === true || !!b?.cotista_id);
    
    const results = items
      .map(p => {
        const bancaData = p.banca_id ? bancaMap.get(p.banca_id) : null;
        if (!isActiveCotistaBanca(bancaData)) return null;
        
        const categoryData = p.category_id ? categoryMap.get(p.category_id) : null;
        
        return {
          id: p.id,
          name: p.name,
          price: p.price,
          price_original: p.price_original,
          images: p.images || [],
          banca_id: p.banca_id,
          distribuidor_id: p.distribuidor_id,
          category_id: p.category_id,
          category: categoryData?.name || '',
          description: p.description || '',
          discount_percent: p.discount_percent,
          banca: {
            id: p.banca_id,
            name: bancaData?.name || 'Banca',
            avatar: bancaData?.cover_image || null,
            phone: bancaData?.whatsapp || null,
            lat: bancaData?.lat ? parseFloat(bancaData.lat) : null,
            lng: bancaData?.lng ? parseFloat(bancaData.lng) : null
          }
        };
      })
      .filter(Boolean)
      .slice(0, limit);
    
    return results;
  } catch (e) {
    console.error('[getSearchProducts] Error:', e);
    return [];
  }
}

export async function getPromoProducts(limit = 20): Promise<any[]> {
  try {
    // Buscar produtos com desconto diretamente do Supabase
    const { data: items, error } = await supabaseAdmin
      .from('products')
      .select(`
        id,
        name,
        price,
        price_original,
        discount_percent,
        images,
        banca_id,
        category_id,
        description
      `)
      .eq('active', true)
      .not('discount_percent', 'is', null)
      .gt('discount_percent', 0)
      .order('discount_percent', { ascending: false })
      .limit(limit * 2);
    
    if (error || !items) return [];
    
    const bancaIds = Array.from(new Set(items.map(p => p.banca_id).filter(Boolean)));
    
    const bancasRes = bancaIds.length
      ? await supabaseAdmin.from('bancas').select('id, name, cover_image, whatsapp, is_cotista, cotista_id').in('id', bancaIds)
      : { data: [] };
    
    const bancaMap = new Map((bancasRes.data || []).map((b: any) => [b.id, b]));
    const isActiveCotistaBanca = (b: any) => (b?.is_cotista === true || !!b?.cotista_id);
    
    const results = items
      .map(p => {
        const bancaData = p.banca_id ? bancaMap.get(p.banca_id) : null;
        if (!isActiveCotistaBanca(bancaData)) return null;
        
        return {
          id: p.id,
          name: p.name,
          price: p.price,
          price_original: p.price_original,
          images: p.images || [],
          discount_percent: p.discount_percent,
          banca: {
            id: p.banca_id,
            name: bancaData?.name || 'Banca',
            avatar: bancaData?.cover_image || null,
            phone: bancaData?.whatsapp || null
          }
        };
      })
      .filter(Boolean)
      .slice(0, limit);
    
    return results;
  } catch (e) {
    console.error('[getPromoProducts] Error:', e);
    return [];
  }
}
