
import React, { useState } from 'react';
import { Heart, ShoppingBag, Pause, Play, Share2 } from 'lucide-react';
import MuxOrYoutubePlayer from './MuxOrYoutubePlayer';
import { toast } from "@/hooks/use-toast";

interface ProductShortCardProps {
  product: {
    id: number;
    slug?: string;
    name: string;
    location: string;
    partnerName: string;
    videoGallery: { playback_id?: string; youtubeId?: string; videoUrl?: string; thumbUrl?: string }[];
    price: number;
  };
  onShoppingBagClick: (slug: string) => void;
  animationClass?: string;
  height?: string;
  width?: string;
  isActive?: boolean;
}

const ProductShortCard: React.FC<ProductShortCardProps> = ({
  product,
  onShoppingBagClick,
  animationClass = "",
  height = "100vh",
  width = "100vw",
  isActive = false,
}) => {
  const [liked, setLiked] = useState(false);
  const [paused, setPaused] = useState(false);
  const [showControls, setShowControls] = useState<boolean>(false);

  // Seleciona primeiro item do videoGallery
  const videoItem = product.videoGallery?.[0];

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

  // Atualiza para esconder os controles ao dar play novamente
  const handlePauseToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isActive) return;
    setPaused((prev) => {
      // Se estava pausado, agora está tocando: ocultar controles
      if (prev) {
        setShowControls(false);
        return false;
      } else {
        return true;
      }
    });
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.slug) return;
    const url = `https://wine-locals.com/passeios/${product.slug}`;
    const shareData = {
      title: product.name,
      text: `${product.name} em ${product.location} por R$ ${Number(product.price).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      url,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // Ignora se o usuário cancelar
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        toast({
          title: "Link copiado!",
          description: "O link do passeio foi copiado para a área de transferência.",
        });
      } catch {
        alert('Não foi possível copiar o link. Acesse: ' + url);
      }
    }
  };

  // Evento que exibe botões de controle ao clicar no vídeo
  const handlePlayerClick = (e: React.MouseEvent) => {
    if (!isActive) return;
    setShowControls(true);
    // Propaga clique para pausar/play se clicar diretamente no botão
  };

  return (
    <div
      className={`relative bg-black w-full h-full min-h-0 min-w-0 overflow-hidden flex flex-col justify-end ${animationClass}`}
      style={{
        height,
        width,
      }}
    >
      {/* Vídeo em destaque */}
      <div className="absolute inset-0 z-0" onClick={handlePlayerClick}>
        <MuxOrYoutubePlayer
          item={videoItem}
          autoPlay={isActive}
          muted={!isActive}
          play={isActive && !paused}
          paused={paused}
          height="100%"
          width="100%"
          className=""
        />
      </div>

      {/* Overlay de gradiente na parte inferior */}
      <div className="absolute inset-x-0 bottom-0 h-2/5 pointer-events-none z-10" style={{
        background: 'linear-gradient(0deg, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.2) 70%, rgba(0,0,0,0.00) 100%)'
      }} />

      {/* Botões no topo */}
      <div className="absolute top-4 right-4 flex flex-col items-end gap-3 z-20">
        <button
          aria-label={liked ? "Descurtir" : "Curtir"}
          onClick={handleLikeToggle}
          className="rounded-full p-2 bg-white/80 hover:bg-white transition"
        >
          <Heart size={24} className={liked ? 'text-red-500 fill-red-500' : 'text-neutral-700'} />
        </button>
        <button
          aria-label="Ver passeio"
          onClick={handleShoppingBagClick}
          className="rounded-full p-2 bg-white/80 hover:bg-white transition"
        >
          <ShoppingBag size={24} className="text-neutral-700" />
        </button>
        <button
          aria-label="Compartilhar"
          onClick={handleShare}
          className="rounded-full p-2 bg-white/80 hover:bg-white transition"
        >
          <Share2 size={22} className="text-neutral-700" />
        </button>
      </div>

      {/* Botão Play/Pause central, só no card ativo e sobre o vídeo.
          Só aparece se showControls for true */}
      {isActive && showControls && (
        <button
          onClick={handlePauseToggle}
          aria-label={paused ? "Tocar vídeo" : "Pausar vídeo"}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 bg-black/60 hover:bg-black/80 text-white rounded-full p-4"
          style={{ transition: 'background 0.2s' }}
        >
          {paused ? <Play size={36} /> : <Pause size={36} />}
        </button>
      )}

      {/* Infos pequenas no rodapé, sobre o vídeo */}
      <div className="relative z-20 w-full px-4 pb-6 select-none">
        <div className="bg-black/65 rounded-lg px-3 py-2 flex flex-col gap-0.5 max-w-[94vw] sm:max-w-[420px] mx-auto">
          <span className="text-xs font-semibold tracking-wide text-white mb-0.5">
            {product.location}
          </span>
          <span className="text-base font-bold leading-tight text-white mb-0.5 line-clamp-2">{product.name}</span>
          <span className="text-xs text-neutral-200 font-medium mb-1 truncate">{product.partnerName}</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-neutral-400 font-medium">Diariamente</span>
            <span className="text-sm text-white font-bold ml-2">
              R$ {Number(product.price).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              <span className="text-xs font-normal text-neutral-300"> / 1 pessoa</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductShortCard;

