
import React, { useState } from 'react';
import { Heart, ShoppingBag } from 'lucide-react';

interface ProductShortCardProps {
  product: {
    id: number;
    slug?: string;
    name: string;
    location: string;
    partnerName: string;
    videoGallery: { playback_id: string; thumbUrl?: string }[];
    price: number;
  };
  onShoppingBagClick: (slug: string) => void;
}

const ProductShortCard: React.FC<ProductShortCardProps> = ({ product, onShoppingBagClick }) => {
  const [liked, setLiked] = useState(false);
  const thumb =
    product.videoGallery?.[0]?.thumbUrl ||
    `https://image.mux.com/${product.videoGallery?.[0]?.playback_id}/thumbnail.jpg?width=600&fit_mode=pad`;

  const handleLikeToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked((x) => !x);
  };

  const handleShoppingBagClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.slug) {
      onShoppingBagClick(product.slug);
    }
  };

  return (
    <div
      className="relative m-auto bg-white rounded-2xl shadow-lg flex flex-col justify-between max-w-[420px] min-h-[540px] w-[95vw] h-[540px] sm:h-[600px] overflow-hidden"
      style={{
        boxSizing: 'border-box',
      }}
    >
      {/* Imagem Expandida */}
      <div className="relative w-full h-[65%]">
        <img
          src={thumb}
          alt={product.name}
          className="object-cover w-full h-full"
        />
        {/* Botão compartilhar foi removido, substituído pelos dois pedidos */}
        <div className="absolute top-3 right-3 flex flex-col items-end gap-4 z-10">
          {/* Botão Curtir */}
          <button
            aria-label={liked ? "Descurtir" : "Curtir"}
            onClick={handleLikeToggle}
            className="rounded-full p-2 bg-white/80 hover:bg-white transition"
          >
            <Heart size={24} className={liked ? 'text-red-500 fill-red-500' : 'text-neutral-700'} />
          </button>
          {/* Botão Sacolinha */}
          <button
            aria-label="Ver passeio"
            onClick={handleShoppingBagClick}
            className="rounded-full p-2 bg-white/80 hover:bg-white transition"
          >
            <ShoppingBag size={24} className="text-neutral-700" />
          </button>
        </div>
      </div>
      {/* Detalhes */}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          <div className="text-xs font-semibold tracking-wide text-white rounded-md px-2 py-0.5 bg-black/60 w-fit mb-2">
            {product.location}
          </div>
          <div className="text-base font-bold leading-tight text-neutral-900 mb-0.5">{product.name}</div>
          <div className="text-sm text-neutral-600 font-medium mb-4">{product.partnerName}</div>
        </div>
        <div>
          <div className="text-xs text-neutral-500 font-medium mb-1">Diariamente</div>
          <div>
            <div className="text-xs text-neutral-600">A partir de</div>
            <div className="text-lg font-bold text-black">
              R$ {Number(product.price).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              <span className="text-xs font-normal text-neutral-700"> / 1 pessoa</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductShortCard;
