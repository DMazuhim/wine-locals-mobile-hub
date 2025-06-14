
import React from "react";
import { Wine } from "lucide-react";

const ICON_SIZE = 88;
const WINE_COLOR = "#a200fc";

const WineGlassLoading: React.FC = () => {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white animate-fade-in"
      style={{
        width: "100vw",
        height: "100vh",
      }}
    >
      <div
        style={{
          width: ICON_SIZE,
          height: ICON_SIZE * 1.2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Wine
          size={ICON_SIZE}
          stroke={WINE_COLOR}
          strokeWidth={2.1}
          className="animate-spin"
          style={{
            display: "block",
            filter: "drop-shadow(0 2px 0px #eee)",
          }}
        />
      </div>
      <div className="mt-5 text-neutral-700 text-sm font-medium tracking-wide">
        Carregando experiências...
      </div>
      {/* Spin animation override (slower and smooth) */}
      <style>
        {`
          .animate-spin {
            animation: wine-spin 1s linear infinite;
          }
          @keyframes wine-spin {
            0% {transform: rotate(0deg);}
            100% {transform: rotate(360deg);}
          }
        `}
      </style>
    </div>
  );
};

export default WineGlassLoading;

