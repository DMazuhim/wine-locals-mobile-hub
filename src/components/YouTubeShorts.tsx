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

  // Novo estado: animação ao passar card
  const [animationClass, setAnimationClass] = useState<string>("");

  // Direção do último scroll (1=baixo, -1=cima)
  const directionRef = useRef<number>(1);

  // For touch/swipe navigation
  const touchStartY = useRef<number | null>(null);
  const touchEndY = useRef<number | null>(null);

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

  // Scroll-to-next/prev helpers
  const goToNext = () => {
    if (currentIndex < products.length - 1) {
      directionRef.current = 1;
      setAnimationClass("animate-slide-in-right");
      setCurrentIndex(idx => idx + 1);
      isScrolling.current = true;
      setTimeout(() => { isScrolling.current = false; }, 400);
    }
  };
  const goToPrev = () => {
    if (currentIndex > 0) {
      directionRef.current = -1;
      setAnimationClass("animate-slide-in-left");
      setCurrentIndex(idx => idx - 1);
      isScrolling.current = true;
      setTimeout(() => { isScrolling.current = false; }, 400);
    }
  };

  // Wheel navigation (desktop/laptop)
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (isScrolling.current) return;
    if (e.deltaY > 30) goToNext();
    if (e.deltaY < -30) goToPrev();
  };

  // Touch/swipe navigation (mobile)
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length !== 1) return;
    touchStartY.current = e.touches[0].clientY;
    touchEndY.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!touchStartY.current) return;
    touchEndY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    if (!touchStartY.current || !touchEndY.current) return;
    const deltaY = touchStartY.current - touchEndY.current;
    if (Math.abs(deltaY) > 45) { // Swipe threshold
      if (deltaY > 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }
    touchStartY.current = null;
    touchEndY.current = null;
  };

  useEffect(() => {
    // Remove a classe de animação após exibir
    if (animationClass) {
      const timeout = setTimeout(() => setAnimationClass(""), 400);
      return () => clearTimeout(timeout);
    }
  }, [animationClass, currentIndex]);

  useEffect(() => {
    // Scroll para o card atual quando currentIndex muda
    if (containerRef.current) {
      const node = containerRef.current.children[currentIndex] as HTMLElement;
      if (node) {
        node.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [currentIndex]);

  // Altura visível: ocupar tudo MENOS o menu fixo de 80px
  const VISIBLE_HEIGHT = 'calc(100vh - 80px)';
  const VISIBLE_WIDTH = '100vw';

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
      className="h-full overflow-y-hidden snap-y snap-mandatory bg-neutral-950 youtube-container"
      ref={containerRef}
      tabIndex={0}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        scrollBehavior: 'smooth',
        height: VISIBLE_HEIGHT,
        width: VISIBLE_WIDTH,
        paddingBottom: '0px', // Não precisamos de espaço extra se o card encaixar
        touchAction: 'pan-y'
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
          <ProductShortCard
            product={product}
            onShoppingBagClick={(slug) => setWebviewSlug(slug)}
            animationClass={idx === currentIndex ? animationClass : ""}
            height={VISIBLE_HEIGHT}
            width={VISIBLE_WIDTH}
          />
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
