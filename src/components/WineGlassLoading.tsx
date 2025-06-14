
import React from "react";

// O SVG abaixo utiliza uma máscara para animar o vinho "enchendo".
// Agora o copo ficou mais oval (achatado/largo).
const WineGlassLoading: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-white animate-fade-in">
      {/* Copo SVG com vinho animando */}
      <svg
        width="90"
        height="120"
        viewBox="0 0 90 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block" }}
      >
        {/* Copo contorno - mais oval */}
        <ellipse cx="45" cy="16" rx="36" ry="8.5" stroke="#444" strokeWidth="2" fill="#fff" />
        <path
          d="M9 16c0 50 25 90 36 90s36-40 36-90"
          stroke="#444"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M19 24c8-8 54-8 62 0"
          stroke="#ccc"
          strokeLinecap="round"
          strokeWidth="4"
          fill="none"
        />
        {/* Vinho */}
        <g>
          <clipPath id="wine-fill-clip">
            <ellipse cx="45" cy="16" rx="36" ry="8.5"/>
            <path d="M9 16c0 50 25 90 36 90s36-40 36-90" />
          </clipPath>
          {/* Vinho que 'sobe' */}
          <rect
            x="9"
            y="60"
            width="72"
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
        {/* Borda inferior - também mais oval */}
        <ellipse
          cx="45"
          cy="106"
          rx="12"
          ry="2"
          fill="#fff"
          stroke="#ddd"
          strokeWidth="1"
        />
      </svg>
      <div className="mt-5 text-neutral-700 text-sm font-medium tracking-wide">
        Carregando experiências...
      </div>
    </div>
  );
};

export default WineGlassLoading;
