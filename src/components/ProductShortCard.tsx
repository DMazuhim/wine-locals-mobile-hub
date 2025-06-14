
import React from 'react';
import { Share } from 'lucide-react';

interface ProductShortCardProps {
  product: {
    id: number;
    name: string;
    location: string; // Ex: "BENTO GONCALVES - RS"
    partnerName: string; // Vinícola Casa Valduga
    videoGallery: { playback_id: string; thumbUrl?: string }[];
    price: number; // valor mínimo ou preço de exibição
  };
}

const ProductShortCard: React.FC<ProductShortCardProps> = ({ product }) => {
  const thumb =
    product.videoGallery?.[0]?.thumbUrl ||
    `https://image.mux.com/${product.videoGallery?.[0]?.playback_id}/thumbnail.jpg?width=600&fit_mode=pad`;

  return (
    <div className="relative m-auto max-w-[360px] min-h-[480px] rounded-2xl overflow-hidden bg-white shadow-lg flex flex-col justify-between">
      {/* Imagem/Vídeo */}
      <div className="relative h-64 w-full">
        <img
          src={thumb}
          alt={product.name}
          className="object-cover w-full h-full"
        />
        <button className="absolute top-2 right-2 bg-white bg-opacity-70 rounded-full p-2 backdrop-blur hover-scale">
          <Share size={18} className="text-zinc-700" />
        </button>
      </div>
      {/* Detalhes */}
      <div className="p-4">
        <div className="text-xs font-semibold tracking-wide text-white rounded-md px-2 py-0.5 bg-black/60 w-fit mb-2">
          {product.location}
        </div>
        <div className="text-base font-bold leading-tight text-neutral-900 mb-0.5">{product.name}</div>
        <div className="text-sm text-neutral-600 font-medium mb-4">{product.partnerName}</div>

        {/* Navegação fake dos dots */}
        <div className="flex items-center space-x-1 mb-4">
          <span className="w-2 h-2 bg-primary rounded-full block" />
          <span className="w-2 h-2 bg-muted rounded-full block" />
          <span className="w-2 h-2 bg-muted rounded-full block" />
        </div>

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
  );
};

export default ProductShortCard;
