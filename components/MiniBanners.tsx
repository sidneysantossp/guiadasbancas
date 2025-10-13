"use client";
import { useEffect, useMemo, useState } from "react";

const BANNERS: string[] = [
  "https://lh3.googleusercontent.com/gg/AAHar4eoY4u6VeIaMEGkO62QY9PolXlEA5dU1lOompZiCqOiT20YmS6YUQtFjX5aYWbntl1WnYMdvPZ1bgDFjEyCEn-pH6P-RcL-TbS8RNawwBLq71dAUb6m7sbJDfj_ZH45wonJtj0tSfjqGkkGR_ftNNANZ3CZK1IrwNNIGj-1gjRwtrytVwpW7EhMQ9tkl1z4Yx8PMh2RQtNdhe8ALMdM6l74JTm5UvbREEZmw5uwnxX8R6YC6e1coohFw1es17ryWgLCoKPaftxcrUniY_KuDWbzL9AWeFaO_M4=d",
  "https://lh3.googleusercontent.com/gg-dl/AJfQ9KRXZPZOwSnta-w0s-aYpjGrNQ_qFPhZnYtkqnWNHRM2D6mCtGsUVSQuIAfXpS4KSE7DMybluixnXSrsfpiplAI7Sys83Qn-wNWVSKHSxX4Lt-cfHygM4Uf1lhw35TJqPn2r5hB0aBipdNWp15uMxWiF3yFxYzyH2rvc5q5DRHtzsnL-lw=s1024",
  "https://lh3.googleusercontent.com/gg-dl/AJfQ9KRlnS7tH7XOyjruZck0E22jVuCuOVdBc4GSfWYZA81giUp2bbSKMRfOlwbZarwl7etLkG6awalcGmQI5L0dmKgc1I4pADr5ZLNY-6KcOCUvnw2UEOub3dL4dDoVAC_pP8wSv8ht9VHxeGsW3vs4RcBf4DJ-QXke7TkfS2tTw3AAn0_4lQ=s1024",
  "https://lh3.googleusercontent.com/rd-gg-dl/AJfQ9KRARQgiupHl1m07PY_d-X8ZjZ-ibJvZ0PSQT15zRRGbV1jcOGsZI02HQj1aV4hV6_i79GHm12PlQXy6rYxgKH3aenAEprhOq3aHAWmJb7rU1GKPa8r2FIwTtpOppPEyCkpUZLOtWKGkpyoSo92m5zmfS38CH6zpb91P7pFTzDcvkjB5rKv0oloCh_bSCoLf1ks7w7rqnHtnQTGYi718qXFwoPN5rYVvoHX6TSPQU_y_ODI0_5pkVObRlP34kqMRJgqJ6ac3zgum1q-oScGXSIB7DyCk-qhZNZJJU0ztqVqTZqmyp0zzH4aGGxgkpqd6d8wV5ieza00zcKziBnM77BDLeiD80bSFa5zMXGKwWACN12NpDn6TZNFWCzxB6025fYjbi9YJrmEiPL-ACYu6gZQabCGFM8BlddifcArE86hth03E4_vhzLiCdzFxrqdu1B6vmXL6mlun9L6Yrld7UPIq4yzL5TSPRGUrRatZb_DpkwtcUm20idpi0l932q45qwJAR09Hwui7PHXf2jxMT-TBor6MTXk1nA2Yf1q8zZHUF9BQkb9UQTGr0cyW4xF4kHBwASwFBSwWXrXBaZjWvE68EBc3SK-1RLa54gaML5HuJ8Fz-mkePf98ZCx4GnQYgci0Pcwpk0mT-LkSqdePT57fJjatlNHULCmvka9Sf1sJX95y4qUuVirdfThcPhXeAiA6mT2W2Wfoj6X7SFr4tL1q_Oh9Fc25WOYGGYCoKF-q-R0Q-jG-MWa5dm1OyW3tR_9W3FPXJmHH1v-4e4paDCF2gSQpPZK2PFcGLrWxgfEWGpnmtkR7TbEfHHFJ3GNm02k3h9QTRnyRN1NpzzXJq4HbypxX3iIBF8FqbAYEN0qQum24BUBwjRVqVWSw7_1oEqATgDeM1Lx8zyV8XAFxvPud7CuqRckJK_M9Yy7FPF0_9j0qwDgcPyIgykhjdOkCqta7ArxFBuWtA_Wb3L7nFfi6x5YWmStN309XG3Rc952Od0fGVp9GCbe61IOi124fFNwuHVfLfymgeFzLwj7WVWkPjvcyW_m3Oze-ErIvsPchuDFzR9I-ucCrjHKtyswG3vUrXeVUh8dNfgc8hUyyNQ_Xmhe9hAHjv_A2ZNkzXd7vQ8Yoj-O38HtNmrNzwMoF0rpzXPCx3apY3VSC0SXDVqabuFRdVPXUnJHqpNfml4Vjh-HQKWi-JkG8N2ia7WpeWMyg9-8vftGbcSYu12XJK7GE8nI5MFME_OOETvHX-W8JMyPbG52CqBe0xEIEbUnRV2HHgg6M311liGMs-XGDrie4XKl-98ZjVf2PcCPxD32_UJu3G2NiZJE4FaOL-jwMnmVNA8_3eVJQ9mdcS5FnhhKDaNZgQlKRIj8vFA=s1024",
  // duplicados
  "https://lh3.googleusercontent.com/gg/AAHar4eoY4u6VeIaMEGkO62QY9PolXlEA5dU1lOompZiCqOiT20YmS6YUQtFjX5aYWbntl1WnYMdvPZ1bgDFjEyCEn-pH6P-RcL-TbS8RNawwBLq71dAUb6m7sbJDfj_ZH45wonJtj0tSfjqGkkGR_ftNNANZ3CZK1IrwNNIGj-1gjRwtrytVwpW7EhMQ9tkl1z4Yx8PMh2RQtNdhe8ALMdM6l74JTm5UvbREEZmw5uwnxX8R6YC6e1coohFw1es17ryWgLCoKPaftxcrUniY_KuDWbzL9AWeFaO_M4=d",
  "https://lh3.googleusercontent.com/gg-dl/AJfQ9KRXZPZOwSnta-w0s-aYpjGrNQ_qFPhZnYtkqnWNHRM2D6mCtGsUVSQuIAfXpS4KSE7DMybluixnXSrsfpiplAI7Sys83Qn-wNWVSKHSxX4Lt-cfHygM4Uf1lhw35TJqPn2r5hB0aBipdNWp15uMxWiF3yFxYzyH2rvc5q5DRHtzsnL-lw=s1024",
  "https://lh3.googleusercontent.com/gg-dl/AJfQ9KRlnS7tH7XOyjruZck0E22jVuCuOVdBc4GSfWYZA81giUp2bbSKMRfOlwbZarwl7etLkG6awalcGmQI5L0dmKgc1I4pADr5ZLNY-6KcOCUvnw2UEOub3dL4dDoVAC_pP8wSv8ht9VHxeGsW3vs4RcBf4DJ-QXke7TkfS2tTw3AAn0_4lQ=s1024",
];

const FALLBACK_BANNER =
  "https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1200&auto=format&fit=crop";

export default function MiniBanners() {
  const [w, setW] = useState<number>(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const onResize = () => setW(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  const perView = w < 640 ? 1 : w < 1024 ? 2 : 3; // 3 por visualização em desktop
  const ITEM_W = 370;
  const ITEM_H = 175;
  const GAP = 16; // gap-4

  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [remote, setRemote] = useState<string[] | null>(null);

  // Load from API with fallback
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/mini-banners', { cache: 'no-store' });
        const j = await res.json();
        const list: string[] = Array.isArray(j?.data)
          ? (j.data as Array<{ image_url: string }>).map((it) => it.image_url).filter(Boolean)
          : [];
        if (list.length) setRemote(list);
      } catch {
        // silent fallback
      }
    })();
  }, []);

  const items = useMemo(() => {
    const base = (remote && remote.length ? remote : BANNERS);
    return base.length < 6 ? [...base, ...base].slice(0, 6) : base;
  }, [remote]);
  const track = useMemo(() => [...items, ...items], [items]);

  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(() => {
      setIndex((i) => i + 1);
      setAnimating(true);
    }, 4000);
    return () => clearInterval(id);
  }, [isPaused]);

  const maxIndex = Math.max(0, items.length - perView);
  
  const prev = () => {
    const currentIndex = index % items.length;
    const newIndex = currentIndex === 0 ? maxIndex : currentIndex - 1;
    setIndex(newIndex);
    setAnimating(true);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 8000);
  };
  
  const next = () => {
    setIndex((i) => i + 1);
    setAnimating(true);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 8000);
  };

  return (
    <section className="w-full">
      <div className="container-max">
        <div className="relative md:px-6">
          <div className="overflow-hidden">
            <div
              className="flex gap-4"
              style={{
                transform: `translateX(-${index * (ITEM_W + GAP)}px)`,
                transition: animating ? "transform 600ms ease" : "none",
              }}
              onTransitionEnd={() => {
                if (index >= items.length) {
                  setAnimating(false);
                  setIndex(0);
                  requestAnimationFrame(() => setAnimating(true));
                }
              }}
            >
              {track.map((src, i) => (
                <div
                  key={`${i}-${src}`}
                  className="shrink-0"
                  style={{ flex: `0 0 ${ITEM_W}px`, width: `${ITEM_W}px`, height: `${ITEM_H}px` }}
                >
                  <img
                    src={src}
                    alt={`Mini banner ${i + 1}`}
                    className="w-full h-full rounded-xl shadow-sm object-cover"
                    loading="lazy"
                    onError={(e) => {
                      const el = e.currentTarget as HTMLImageElement;
                      if (el.src !== FALLBACK_BANNER) el.src = FALLBACK_BANNER;
                    }}
                  />
                </div>
              ))}
            </div>
            
            {/* Desktop arrows */}
            {items.length > perView && (
              <>
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Anterior"
                  className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-20 h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-50 transition-all duration-200"
                >
                  <svg viewBox="0 0 24 24" className="h-6 w-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M15 18l-6-6 6-6"/>
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={next}
                  aria-label="Próximo"
                  className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-50 transition-all duration-200"
                >
                  <svg viewBox="0 0 24 24" className="h-6 w-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
