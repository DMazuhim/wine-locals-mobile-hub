
import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Share, Play } from 'lucide-react';

interface VideoGallery {
  playback_id: string;
  id: string | number;
  title: string | null;
}
// Produto conforme endpoint /api/products
interface ProductData {
  id: number;
  attributes: {
    name: string;
    slug: string;
    price: number | null;
    city: string | null;
    state: string | null;
    partner: {
      data: {
        attributes: {
          name: string | null;
        };
      };
    } | null;
    videoGallery: VideoGallery[] | null;
  };
}

interface ApiResponse {
  data: ProductData[];
}

const YouTubeShorts: React.FC = () => {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Busca os produtos com videoGallery
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          'https://api.guiawinelocals.com/api/products?filters[videoGallery][title][$notNull]=true&pagination[pageSize]=1000'
        );
        const data: ApiResponse = await response.json();
        // Filtra somente produtos com pelo menos 1 vídeo válido
        const filtered = data.data.filter(
          (p) => p.attributes?.videoGallery?.length && p.attributes.videoGallery[0].playback_id
        );
        setProducts(filtered);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Auto-play do primeiro produto
  useEffect(() => {
    if (products.length > 0 && !loading) {
      setPlayingIndex(0);
    }
  }, [products, loading]);

  // Auto-play ao mudar de produto/card
  useEffect(() => {
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
    // Abre o produto numa modal-like webview usando window.open (ou implementar modal conforme app)
    window.open(`https://www.wine-locals.com/passeios/${slug}`, '_blank');
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-white">
        {/* Fundo branco e sem texto */}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-black">
        <div className="text-white text-lg">Nenhum produto com vídeo encontrado</div>
      </div>
    );
  }

  // Helper para exibir preço formatado
  const formatPrice = (price: number | null) =>
    price ? `R$ ${price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '--';

  return (
    <div 
      ref={scrollContainerRef}
      className="h-full overflow-y-scroll snap-y snap-mandatory bg-black"
      onScroll={handleScroll}
      style={{ scrollBehavior: 'smooth' }}
    >
      {products.map((prod, index) => {
        const attr = prod.attributes;
        const video = attr.videoGallery?.[0];
        const srcVideo = video ? `https://stream.mux.com/${video.playback_id}.m3u8?redundant_streams=true&CMCD=cid%3D%22${video.playback_id}%22%2Csid%3D%225755b03b-d195-4d6c-a635-362031967d86%22` : undefined;
        const showPlay = playingIndex !== index;

        return (
          <div 
            key={prod.id}
            className="relative h-full w-full snap-start flex-shrink-0 flex flex-col items-center justify-center"
          >
            {/* Video player ou thumbnail */}
            <div className="absolute inset-0 flex items-center justify-center">
              {showPlay && !!srcVideo ? (
                <div 
                  className="relative w-full h-full cursor-pointer"
                  onClick={() => setPlayingIndex(index)}
                >
                  <div className="absolute w-full h-full bg-black opacity-60 z-0" />
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="bg-black bg-opacity-60 rounded-full p-4">
                      <Play className="w-12 h-12 text-white" fill="white" />
                    </div>
                  </div>
                  {/* Exibe thumbnail estática caso queira/consiga obter uma da Mux */}
                </div>
              ) : (
                !!srcVideo && (
                  // Abaixo pode-se usar um video.js player para hls, mas para simplificar usaremos tag <video> (mobile browsers suportam m3u8)
                  <video
                    className="w-full h-full object-cover"
                    src={srcVideo}
                    controls
                    autoPlay
                    muted
                    playsInline
                    loop
                    style={{background: '#000'}}
                  />
                )
              )}
            </div>
            {/* Card de info - estilo inspirado pelo print */}
            <div className="absolute bottom-24 left-0 right-0 flex justify-center z-20">
              <div className="bg-white rounded-xl shadow-xl w-11/12 mx-auto p-4 flex flex-col" style={{maxWidth: 370}}>
                <div className="text-[10px] text-gray-500 tracking-[1.5px] font-semibold uppercase mb-1">
                  {attr.city}{attr.state ? ` - ${attr.state}` : ''}
                </div>
                <div className="font-bold text-lg leading-tight mb-1 line-clamp-2">
                  {attr.name}
                </div>
                <div className="text-sm text-gray-600 mb-2 truncate">
                  {attr.partner?.data?.attributes?.name}
                </div>
                <div className="flex items-center my-2">
                  <div className="h-2 w-2 rounded-full bg-purple-500 mr-2"></div>
                  <span className="text-xs text-gray-600">Diariamente</span>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <span className="block text-xs text-gray-500">A partir de</span>
                    <span className="text-xl font-semibold text-gray-800">{formatPrice(attr.price)}</span>
                    <span className="block text-xs text-gray-600">/ 1 pessoa</span>
                  </div>
                  <button
                    onClick={() => handleOpenProduct(attr.slug)}
                    className="bg-purple-600 hover:bg-purple-700 rounded-full p-3 transition-colors shadow flex items-center justify-center"
                  >
                    <ShoppingBag className="w-6 h-6 text-white" />
                  </button>
                </div>
              </div>
            </div>
            {/* Share button no topo direito, apenas para referência visual */}
            <div className="absolute top-6 right-4 z-30">
              <button
                className="bg-white bg-opacity-75 hover:bg-purple-100 rounded-full p-2 shadow"
                onClick={() => navigator.clipboard.writeText(`https://www.wine-locals.com/passeios/${attr.slug}`)}
                aria-label="Compartilhar"
              >
                <Share className="w-5 h-5 text-gray-700" />
              </button>
            </div>
            {/* Indicador de progresso dos cards */}
            <div className="absolute top-4 left-4 right-4 z-10">
              <div className="flex space-x-1">
                {products.map((_, i) => (
                  <div 
                    key={i}
                    className={`h-0.5 flex-1 rounded-full ${
                      i === index ? 'bg-purple-600' : 'bg-gray-300 bg-opacity-30'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default YouTubeShorts;
