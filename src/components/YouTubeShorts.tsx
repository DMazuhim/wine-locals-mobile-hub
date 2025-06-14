
import React, { useState, useEffect } from 'react';
import ProductShortCard from './ProductShortCard';

type Product = {
  id: number;
  name: string;
  location: string;
  partnerName: string;
  videoGallery: { playback_id: string; thumbUrl?: string }[];
  price: number;
};

// Helper: extrair local e nome parceiro de um produto
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

  // Fetch produtos do novo endpoint
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const url =
          "https://api.guiawinelocals.com/api/products?filters[videoGallery][title][$notNull]=true&pagination[pageSize]=1000";
        const response = await fetch(url);
        const result = await response.json();
        // formata produtos válidos (com videoGallery)
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

  // Snap scroll vertical - TikTok style
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const itemHeight = container.clientHeight;
    const newIndex = Math.round(container.scrollTop / itemHeight);
    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < products.length) {
      setCurrentIndex(newIndex);
    }
  };

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
      onScroll={handleScroll}
      style={{ scrollBehavior: 'smooth' }}
    >
      {products.map((product, idx) => (
        <div
          key={product.id}
          className="relative h-full w-full snap-start flex-shrink-0 flex items-center justify-center"
        >
          <ProductShortCard product={product} />
        </div>
      ))}
    </div>
  );
};

export default YouTubeShorts;
