
import React, { useState, useEffect, useRef } from 'react';
import ProductShortCard from './ProductShortCard';
import PasseioWebViewModal from './PasseioWebViewModal';

type Product = {
  id: number;
  slug?: string;
  name: string;
  location: string;
  partnerName: string;
  videoGallery: { playback_id: string; thumbUrl?: string }[];
  price: number;
};

function extractProductFields(raw: any): Product {
  const location = `${raw?.city ? raw.city : ''}${raw?.state_code ? ' - ' + raw.state_code : ''}`.trim().toUpperCase();
  return {
    id: raw.id,
    slug: raw.slug,
    name: raw.title || raw.name,
    location,
    partnerName: raw?.partner?.name ?? '',
    videoGallery: Array.isArray(raw.videoGallery) ? raw.videoGallery : [],
    price: (raw?.price || raw?.price_from || raw?.price_min || 0),
  };
}

const YouTubeShorts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [webviewSlug, setWebviewSlug] = useState<string | null>(null);

  // Ref para bloquear múltiplos scrolls rápidos
  const isScrolling = useRef(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const url =
          "https://api.guiawinelocals.com/api/products?filters[videoGallery][title][$notNull]=true&pagination[pageSize]=1000";
        const response = await fetch(url);
        const result = await response.json();
        const formatted = (result.data || [])
          .filter((item: any) => !!item.videoGallery && item.videoGallery.length > 0)
          .map(extractProductFields);
        setProducts(formatted);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Snap scroll vertical
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (isScrolling.current) return;
    if (e.deltaY > 30 && currentIndex < products.length - 1) {
      setCurrentIndex((idx) => idx + 1);
      isScrolling.current = true;
      setTimeout(() => { isScrolling.current = false; }, 400);
    }
    if (e.deltaY < -30 && currentIndex > 0) {
      setCurrentIndex((idx) => idx - 1);
      isScrolling.current = true;
      setTimeout(() => { isScrolling.current = false; }, 400);
    }
  };

  useEffect(() => {
    // Scroll para o card atual quando currentIndex muda
    if (containerRef.current) {
      const node = containerRefRef.current?.children[currentIndex] as HTMLElement;
      if (node) {
        node.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [currentIndex]);

  // Altura visível: ocupar tudo MENOS o menu fixo de 80px
  // O card já está limitado para caber nessa área; vamos garantir padding bottom extra na lista para que o card nunca fique sob o menu.
  const VISIBLE_HEIGHT = 'calc(100vh - 80px)';

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-black">
        <span className="text-white text-lg">Carregando experiências...</span>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="h-full flex items-center justify-center bg-black">
        <span className="text-white text-lg">Nenhum produto com vídeo encontrado</span>
      </div>
    );
  }

  return (
    <div
      className="h-full overflow-y-scroll snap-y snap-mandatory bg-neutral-950 youtube-container"
      ref={containerRef}
      tabIndex={0}
      onWheel={handleWheel}
      style={{
        scrollBehavior: 'smooth',
        height: VISIBLE_HEIGHT,
        paddingBottom: '80px', // Espaço extra para o menu sempre ficar fora do card
      }}
    >
      {products.map((product, idx) => (
        <div
          key={product.id}
          className="relative w-full snap-start flex-shrink-0 flex items-center justify-center"
          style={{
            minHeight: VISIBLE_HEIGHT,
            height: VISIBLE_HEIGHT,
            maxHeight: VISIBLE_HEIGHT,
          }}
        >
          <ProductShortCard product={product} onShoppingBagClick={(slug) => setWebviewSlug(slug)} />
        </div>
      ))}
      <PasseioWebViewModal
        open={!!webviewSlug}
        slug={webviewSlug}
        onClose={() => setWebviewSlug(null)}
      />
    </div>
  );
};

export default YouTubeShorts;
