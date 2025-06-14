
import React, { useState, useRef } from 'react';
import YouTubeShortsCard from './YouTubeShortsCard';
import { useYouTubeShortsProducts } from '@/hooks/useYouTubeShortsProducts';

const YouTubeShorts: React.FC = () => {
  const { products, loading } = useYouTubeShortsProducts();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-play do primeiro produto
  React.useEffect(() => {
    if (products.length > 0 && !loading) {
      setPlayingIndex(0);
    }
  }, [products, loading]);

  // Auto-play ao mudar de produto/card
  React.useEffect(() => {
    if (products.length > 0) {
      setPlayingIndex(currentIndex);
    }
  }, [currentIndex, products.length]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollTop = container.scrollTop;
    const itemHeight = container.clientHeight;
    const newIndex = Math.round(scrollTop / itemHeight);
    if (newIndex !== currentIndex && newIndex < products.length) {
      setCurrentIndex(newIndex);
    }
  };

  const handleOpenProduct = (slug: string) => {
    window.open(`https://www.wine-locals.com/passeios/${slug}`, '_blank');
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-white" />
    );
  }

  if (products.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-black">
        <div className="text-white text-lg">Nenhum produto com vídeo encontrado</div>
      </div>
    );
  }

  return (
    <div 
      ref={scrollContainerRef}
      className="h-full overflow-y-scroll snap-y snap-mandatory bg-black"
      onScroll={handleScroll}
      style={{ scrollBehavior: 'smooth' }}
    >
      {products.map((prod, index) => (
        <YouTubeShortsCard
          key={prod.id}
          prod={prod}
          index={index}
          playingIndex={playingIndex}
          setPlayingIndex={setPlayingIndex}
          handleOpenProduct={handleOpenProduct}
          productsLen={products.length}
          currentIndex={currentIndex}
        />
      ))}
    </div>
  );
};

export default YouTubeShorts;
