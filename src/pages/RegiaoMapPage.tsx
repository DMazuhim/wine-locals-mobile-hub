
import React, { useState } from "react";
import RegiaoMap from "@/components/RegiaoMap";
import PasseioWebViewModal from "@/components/PasseioWebViewModal";
import ProductShortCard from "@/components/ProductShortCard";
import WineGlassLoading from "@/components/WineGlassLoading";

export default function RegiaoMapPage() {
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  const handlePinClick = (product: any) => {
    setSelectedProduct(product);
  };

  const handleComprarClick = (slug: string) => {
    setSelectedSlug(slug);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedSlug(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white overflow-hidden">
      <RegiaoMap
        onPinClick={handlePinClick}
        selectedProduct={selectedProduct}
      />
      {/* Card flutuante quando seleciona um produto */}
      {selectedProduct && (
        <div className="fixed left-1/2 bottom-[100px] -translate-x-1/2 z-[60] max-w-[420px] w-[94vw]">
          <ProductShortCard
            product={selectedProduct}
            onShoppingBagClick={handleComprarClick}
            isActive
            height="260px"
            width="100%"
          />
          <button
            className="block w-full bg-primary text-white rounded-b-lg py-3 text-lg font-bold tracking-wide shadow focus:outline-none focus:ring"
            onClick={() => handleComprarClick(selectedProduct.slug)}
          >
            Comprar
          </button>
        </div>
      )}
      {/* Modal do passeio igual trends */}
      <PasseioWebViewModal
        open={modalOpen}
        slug={selectedSlug}
        onClose={handleCloseModal}
      />
    </div>
  );
}
