
import React from "react";

// SVG copo de vinho arredondado, inspirado no print fornecido.
const WineGlassLoading: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-white animate-fade-in">
      <svg
        width="88"
        height="120"
        viewBox="0 0 88 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block" }}
      >
        {/* Topo oval menor */}
        <ellipse cx="44" cy="15" rx="31" ry="7" stroke="#444" strokeWidth="1.5" fill="#fff"/>

        {/* Bordas do copo (bem redondinho) */}
        <path
          d="
            M13 17 
            Q13 85 44 108 
            Q75 85 75 17
            "
          stroke="#444"
          strokeWidth="2"
          fill="white"
        />

        {/* Faixa interna acinzentada */}
        <path
          d="
            M23 23 
            Q18 58 44 104"
          stroke="#bbb"
          strokeWidth="4"
          fill="none"
          opacity="0.44"
        />

        {/* Vinho - formato de onda preenchendo só a barriga */}
        <g>
          <clipPath id="wine-clip">
            <path
              d="
                M13 17 
                Q13 85 44 108 
                Q75 85 75 17
                Z
              "
            />
          </clipPath>
          <path
            clipPath="url(#wine-clip)"
            fill="#a200fc"
            // Forma da onda preenchendo o fundo, animada para subir
            d="
              M20 75
              Q37 85 44 84
              Q51 83 68 75
              Q73 77 75 85
              Q60 107 44 107
              Q28 107 14 87
              Q17 80 20 75
              Z
            "
          >
            <animate 
              attributeName="d"
              dur="1.2s"
              repeatCount="1"
              fill="freeze"
              values="
                M20 112 Q37 112 44 112 Q51 112 68 112 Q73 113 75 113 Q60 113 44 113 Q28 113 14 113 Q17 113 20 112 Z;
                M20 75 Q37 85 44 84 Q51 83 68 75 Q73 77 75 85 Q60 107 44 107 Q28 107 14 87 Q17 80 20 75 Z
              "
            />
          </path>
          {/* Pequena sombra do vinho na borda */}
          <ellipse
            cx="62"
            cy="87"
            rx="8"
            ry="2"
            fill="#480070"
            opacity="0.22"
            clipPath="url(#wine-clip)"
          />
        </g>
        {/* Base do copo */}
        <ellipse
          cx="44"
          cy="108"
          rx="11"
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
