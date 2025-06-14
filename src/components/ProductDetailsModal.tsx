
import React from "react";
import type { ProductData } from "@/hooks/useYouTubeShortsProducts";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "./ui/dialog";
import { Button } from "./ui/button";

interface ProductDetailsModalProps {
  open: boolean;
  product: ProductData | null;
  onClose: () => void;
}

const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({ open, product, onClose }) => {
  if (!product) return null;
  const attr = product.attributes;
  const video = attr.videoGallery?.find(v => !!v.playback_id);
  const srcVideo = video
    ? `https://stream.mux.com/${video.playback_id}.m3u8?redundant_streams=true&CMCD=cid%3D%22${video.playback_id}%22%2Csid%3D%225755b03b-d195-4d6c-a635-362031967d86%22`
    : undefined;
  const formatPrice = (price: number | null) =>
    price ? `R$ ${price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '--';

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-sm p-0 md:p-0">
        <DialogHeader>
          <DialogTitle className="p-4">{attr.name}</DialogTitle>
          <DialogClose className="absolute right-4 top-4" />
        </DialogHeader>
        {srcVideo && (
          <video
            src={srcVideo}
            className="w-full h-60 object-cover rounded-t-lg"
            controls
            autoPlay
            muted
            playsInline
            loop
            style={{ background: "#000" }}
          />
        )}
        <div className="p-4">
          <div className="text-xs font-semibold text-purple-700 uppercase mb-1">
            {attr.city}{attr.state ? ` - ${attr.state}` : ''}
          </div>
          <div className="text-sm text-gray-600 mb-2">
            {attr.partner?.data?.attributes?.name}
          </div>
          <div className="mb-3 flex items-center">
            <div className="h-2 w-2 rounded-full bg-purple-500 mr-2" />
            <span className="text-xs">Diariamente</span>
          </div>
          <div>
            <span className="block text-xs text-gray-500">A partir de</span>
            <span className="text-xl font-semibold text-gray-800">{formatPrice(attr.price)}</span>
            <span className="block text-xs text-gray-600">/ 1 pessoa</span>
          </div>
          <a
            className="block mt-4"
            href={`https://www.wine-locals.com/passeios/${attr.slug}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="w-full">Reservar no site</Button>
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailsModal;
