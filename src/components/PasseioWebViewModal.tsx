
import React from 'react';

interface PasseioWebViewModalProps {
  open: boolean;
  slug: string | null;
  onClose: () => void;
}

const PasseioWebViewModal: React.FC<PasseioWebViewModalProps> = ({ open, slug, onClose }) => {
  if (!open || !slug) return null;

  // O botão de fechar está agora fora da área da WebView/modal central
  return (
    <div className="fixed z-[10000] inset-0 flex items-center justify-center bg-black/70">
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-label="Fechar modal"
      />
      {/* Botão de fechar flutuante acima do modal, fora do conteúdo */}
      <button
        className="fixed top-5 right-5 bg-white rounded-full shadow p-2 z-50"
        onClick={onClose}
        aria-label="Fechar"
      >
        <span className="text-lg font-bold text-neutral-700">&times;</span>
      </button>
      <div className="relative bg-white rounded-lg shadow-xl max-w-[420px] w-[95vw] h-[80vh] flex flex-col overflow-hidden z-10">
        <iframe
          src={`https://www.wine-locals.com/passeios/${slug}`}
          title="Passeio Wine Locals"
          className="w-full h-full border-none rounded-lg"
          allow="autoplay; fullscreen"
        />
      </div>
    </div>
  );
};

export default PasseioWebViewModal;

