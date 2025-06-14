
import React from "react";
import { Wine } from "lucide-react";

const WINE_COLOR = "#a200fc";

// Tamanho e proporção ajustáveis para o loader
const ICON_SIZE = 88;

const WineGlassLoading: React.FC = () => {
  // A altura máxima relativa do "vinho" preenchendo a taça sobre o SVG
  // Usando CSS keyframes e inline style para controlar a animação
  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-white animate-fade-in">
      <div
        style={{
          position: "relative",
          width: ICON_SIZE,
          height: ICON_SIZE * 1.2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Wine glass icon */}
        <Wine
          size={ICON_SIZE}
          stroke="#444"
          strokeWidth={2.1}
          style={{
            display: "block",
            position: "relative",
            zIndex: 2,
            filter: "drop-shadow(0 2px 0px #eee)",
          }}
        />
        {/* O vinho enchendo a taça */}
        <div
          style={{
            position: "absolute",
            left: 0,
            bottom: 0,
            width: "100%",
            height: "100%",
            overflow: "hidden",
            pointerEvents: "none",
            zIndex: 1,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center"
          }}
          aria-hidden
        >
          <div
            className="wine-loader-bar"
            style={{
              width: ICON_SIZE * 0.53,
              height: ICON_SIZE * 0.63,
              background: `linear-gradient(180deg, ${WINE_COLOR} 80%, #480070 100%)`,
              borderRadius: `0 0 ${ICON_SIZE * 0.38}px ${ICON_SIZE * 0.38}px/0 0 ${ICON_SIZE * 0.39}px ${ICON_SIZE * 0.39}px `,
              boxShadow: `0 2px 6px 0 #c9a7f944`,
              transform: "translateY(100%)",
              animation: "wine-fillup 1.2s cubic-bezier(0.44, 1, 0.62, 1) forwards",
              // Bem centralizada na taça
              marginLeft: ICON_SIZE * 0.233,
              marginBottom: ICON_SIZE * 0.17,
            }}
          ></div>
        </div>
        {/* Keyframes animacao
          O keyframes está aqui inline, mas ideal seria no css global/tailwind config
        */}
        <style>
        {`
          @keyframes wine-fillup {
            0%   { transform: translateY(100%); opacity:0.4;}
            40%  { opacity: 1; }
            100% { transform: translateY(0); opacity:1;}
          }
        `}
        </style>
      </div>
      <div className="mt-5 text-neutral-700 text-sm font-medium tracking-wide">
        Carregando experiências...
      </div>
    </div>
  );
};
export default WineGlassLoading;
