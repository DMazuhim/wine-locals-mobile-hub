import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { useProductsPorRegiao } from "@/hooks/useProductsPorRegiao";
import { useRegioesFromSearchApi } from "@/hooks/useRegioesFromSearchApi";
import { Map } from "lucide-react";
import WineGlassLoading from "./WineGlassLoading";
import { toast } from "@/hooks/use-toast";

interface RegiaoMapProps {
  onPinClick: (product: any) => void;
  selectedProduct: any | null;
}

// Bounds globais para América do Sul
const southAmericaBounds: [number, number, number, number] = [-82, -56, -34, 12];
const southAmericaCenter: [number, number] = [-56, -15];

// Bound region pode ser extendido por chave (com fallback global)
const mapBoundsPorRegiao: Record<string, [number, number, number, number]> = {
  "Vale dos Vinhedos": [-51.655, -29.235, -51.450, -29.010],
  "Serra Gaúcha": [-52, -29.5, -50.9, -28.5],
  "Campanha Gaúcha": [-56.2, -31.3, -53.8, -29.1],
  "Serra Catarinense": [-50.7, -28.5, -49.8, -27.3],
};

const MAPBOX_TOKEN_STORAGE_KEY = "mapbox-public-token";

function getManualToken(): string | null {
  return localStorage.getItem(MAPBOX_TOKEN_STORAGE_KEY) || "";
}

function setManualToken(token: string) {
  localStorage.setItem(MAPBOX_TOKEN_STORAGE_KEY, token);
  toast({
    title: "Token adicionado",
    description: "Mapbox Public Token salvo localmente.",
  });
}

const RegiaoMap: React.FC<RegiaoMapProps> = ({ onPinClick, selectedProduct }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [regiao, setRegiao] = useState<string>("");
  const [manualToken, setManualTokenState] = useState<string>(getManualToken());
  const [tokenInput, setTokenInput] = useState<string>(getManualToken());
  const [tokenError, setTokenError] = useState<string>("");

  // Busca regiões do endpoint correto (enum)
  const { regioes, loading: regioesLoading, error: regioesError } = useRegioesFromSearchApi();

  // Busca produtos agrupados
  const { products, loading: productsLoading, error: productsError } = useProductsPorRegiao();

  // Handler de token
  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = tokenInput.trim();
    if (!/^pk\.[a-zA-Z0-9._-]{10,}$/.test(trimmed)) {
      setTokenError("Token inválido. Deve começar por 'pk.' e estar correto. Veja em mapbox.com → Tokens.");
      return;
    }
    setManualToken(trimmed);
    setManualTokenState(trimmed);
    setTokenError("");
  };

  // Controle do mapa
  useEffect(() => {
    if (!mapContainer.current || !manualToken) return;

    mapboxgl.accessToken = manualToken;

    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: southAmericaCenter, // América do Sul
      zoom: 3.5,
      attributionControl: false,
      projection: "globe",
      pitch: 45,
    });

    mapRef.current.addControl(new mapboxgl.NavigationControl({visualizePitch: true}), "top-right");

    mapRef.current.on("style.load", () => {
      mapRef.current?.setFog({
        color: "rgb(255,255,255)",
        "high-color": "rgb(200,200,225)",
        "horizon-blend": 0.2,
      });
    });

    return () => {
      mapRef.current?.remove();
    };
  }, [manualToken]);

  // Atualiza pins e foca na região quando muda filtro
  useEffect(() => {
    const map = mapRef.current;
    if (!map || regioes.length === 0) return;

    (map as any)._customMarkers = (map as any)._customMarkers || [];
    (map as any)._customMarkers.forEach((m: any) => m.remove && m.remove());
    (map as any)._customMarkers = [];

    if (regiao && mapBoundsPorRegiao[regiao]) {
      map.fitBounds(mapBoundsPorRegiao[regiao], { padding: 60, duration: 1000 });
    } else {
      map.fitBounds(southAmericaBounds, { padding: 60, duration: 1000 });
    }

    let filtered = products;
    if (regiao) filtered = products.filter((p) => p.regiao === regiao);

    filtered.forEach((product) => {
      if (!product.longitude || !product.latitude) return;

      const el = document.createElement("div");
      el.className = "mapbox-marker-pin";
      el.style.width = "34px";
      el.style.height = "34px";
      el.style.cursor = "pointer";
      el.style.display = "flex";
      el.style.alignItems = "center";
      el.style.justifyContent = "center";
      el.style.borderRadius = "50%";
      el.style.background = "rgba(255,255,255,0.90)";
      el.style.boxShadow = "0 2px 8px 0 rgba(0,0,0,0.08)";
      el.innerHTML = `<svg viewBox="0 0 24 24" width="28" height="28" fill="#a855f7" stroke="#a855f7" stroke-width="2"><path d="M12 21s-6-5.686-6-10A6 6 0 0 1 18 11c0 4.314-6 10-6 10Z"/><circle cx="12" cy="11" r="3" fill="#fff"/></svg>`;

      el.onclick = (e) => {
        e.stopPropagation();
        onPinClick(product);
      };

      const marker = new mapboxgl.Marker(el)
        .setLngLat([product.longitude, product.latitude])
        .addTo(map);

      (map as any)._customMarkers.push(marker);
    });
  }, [regiao, products, regioes]);

  return (
    <div className="w-full h-[74vh] relative flex flex-col justify-start items-center">
      {/* Campo Token Mapbox se não houver */}
      {!manualToken && (
        <form
          className="absolute top-3 left-1/2 -translate-x-1/2 bg-white z-30 rounded-xl shadow px-4 py-4 flex flex-col gap-2 items-center"
          style={{ minWidth: 320, maxWidth: 400 }}
          onSubmit={handleTokenSubmit}
        >
          <strong className="text-primary text-lg mb-1">Token Mapbox obrigatório</strong>
          <label className="text-gray-700 text-sm">
            Para visualizar o mapa, cole seu <span className="font-semibold">Mapbox Public Token</span> aqui.<br/>
            <a
              href="https://account.mapbox.com/access-tokens/"
              className="text-primary underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Acesse sua conta Mapbox
            </a>
          </label>
          <input
            type="text"
            value={tokenInput}
            onChange={e => setTokenInput(e.target.value)}
            required
            placeholder="Ex: pk.eyJ..."
            className="border p-2 rounded w-full"
          />
          {tokenError && <span className="text-red-500 text-xs">{tokenError}</span>}
          <button
            type="submit"
            className="bg-primary text-white font-semibold px-4 py-2 rounded w-full mt-1"
          >
            Salvar e abrir mapa
          </button>
        </form>
      )}

      {/* Filtro de regiões */}
      <div className="absolute top-2 left-1/2 z-20 -translate-x-1/2 flex gap-2 flex-wrap bg-white/90 px-4 py-2 rounded-full shadow">
        <label className="text-sm font-semibold flex items-center gap-2">
          <Map className="w-4 h-4 text-primary" />
          Ver região:
        </label>
        <select
          className="border px-2 rounded text-sm font-medium"
          value={regiao}
          onChange={e => setRegiao(e.target.value)}
        >
          <option value="">Todas regiões</option>
          {!regioesLoading && regioes.map((reg) => (
            <option key={reg.value} value={reg.value}>{reg.label}</option>
          ))}
        </select>
      </div>

      {/* Mapa */}
      <div ref={mapContainer} className={`relative rounded-lg shadow-lg w-[95vw] max-w-[812px] h-[73vh] z-10 ${!manualToken ? 'opacity-30 pointer-events-none blur-sm' : ''}`} />
      {(regioesLoading || productsLoading) && <WineGlassLoading />}
      {(regioesError || productsError) && (
        <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center z-30">
          <span className="text-red-500 text-lg">Erro ao carregar mapa e produtos</span>
        </div>
      )}
      {/* CSS para o pin */}
      <style>
        {`
          .mapbox-marker-pin { transition: transform 0.2s; }
          .mapbox-marker-pin:hover { transform: scale(1.15); box-shadow: 0 4px 16px 0 #a855f777;}
        `}
      </style>
    </div>
  );
};

export default RegiaoMap;
