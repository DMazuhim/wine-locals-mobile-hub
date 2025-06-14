
import React from "react";

// O SVG abaixo utiliza uma máscara para animar o vinho "enchendo".
// A animação aumenta o height do vinho de 0 a 52 ao carregar.
const WineGlassLoading: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-white animate-fade-in">
      {/* Copo SVG com vinho animando */}
      <svg
        width="76"
        height="120"
        viewBox="0 0 76 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block" }}
      >
        {/* Copo contorno */}
        <ellipse cx="38" cy="16" rx="29" ry="11" stroke="#444" strokeWidth="2" fill="#fff" />
        <path
          d="M9 16c0 50 20 90 29 90s29-40 29-90"
          stroke="#444"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M19 24c5-8 33-8 38 0"
          stroke="#ccc"
          strokeLinecap="round"
          strokeWidth="4"
          fill="none"
        />
        {/* Vinho */}
        <g>
          <clipPath id="wine-fill-clip">
            <ellipse cx="38" cy="16" rx="29" ry="11"/>
            <path d="M9 16c0 50 20 90 29 90s29-40 29-90" />
          </clipPath>
          {/* Vinho que 'sobe' */}
          <rect
            x="9"
            y="60"
            width="58"
            height="52"
            fill="#a21caf"
            clipPath="url(#wine-fill-clip)"
            className="wine-fill"
          >
            <animate
              attributeName="y"
              from="104"
              to="60"
              dur="1.2s"
              fill="freeze"
              repeatCount="1"
            />
            <animate
              attributeName="height"
              from="0"
              to="52"
              dur="1.2s"
              fill="freeze"
              repeatCount="1"
            />
          </rect>
        </g>
        {/* Borda inferior */}
        <ellipse
          cx="38"
          cy="106"
          rx="8"
          ry="2"
          fill="#fff"
          stroke="#ddd"
          strokeWidth="1"
        />
      </svg>
      {/* Text optional */}
      <div className="mt-5 text-neutral-700 text-sm font-medium tracking-wide">
        Carregando experiências...
      </div>
    </div>
  );
};

export default WineGlassLoading;

