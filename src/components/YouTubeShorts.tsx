
import React, { useState, useEffect, useRef } from 'react';
import ProductShortCard from './ProductShortCard';

type Product = {
  id: number;
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

  // Ref para impedir múltiplos scroll updates simultâneos
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
      } catch (err) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Scroll behavior
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
      const node = containerRef.current.children[currentIndex] as HTMLElement;
      if (node) {
        node.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [currentIndex]);

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
      style={{ scrollBehavior: 'smooth' }}
    >
      {products.map((product, idx) => (
        <div
          key={product.id}
          className="relative h-full w-full snap-start flex-shrink-0 flex items-center justify-center"
          style={{
            minHeight: '100%',
            height: '100vh',
            maxHeight: '100vh'
          }}
        >
          <ProductShortCard product={product} />
        </div>
      ))}
    </div>
  );
};

export default YouTubeShorts;
