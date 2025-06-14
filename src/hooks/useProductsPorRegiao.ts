
import { useEffect, useState } from "react";

type Product = {
  id: number;
  slug?: string;
  name: string;
  location: string;
  partnerName: string;
  videoGallery: { playback_id?: string; youtubeId?: string; videoUrl?: string; thumbUrl?: string }[];
  price: number;
  regiao?: string;
  latitude?: number;
  longitude?: number;
};

export function useProductsPorRegiao() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [regioes, setRegioes] = useState<string[]>([]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch("https://api.guiawinelocals.com/api/products?pagination[pageSize]=1000")
      .then(async (res) => {
        if (!res.ok) throw new Error("Erro API");
        const apiData = await res.json();
        let prods: Product[] = [];
        if (Array.isArray(apiData.data)) {
          prods = apiData.data.map((p: any) => {
            // Ajuste para as props mínimas.
            return {
              id: p.id,
              slug: p.slug,
              name: p.name,
              location: p.location,
              partnerName: p.partner_name,
              videoGallery: p.video_gallery || [],
              price: p.price,
              regiao: p.region || p.regiao || p.location, // tenta descobrir o campo da região
              latitude: p.latitude || p.lat,
              longitude: p.longitude || p.lng || p.lon,
            };
          });
        }
        setProducts(prods);

        // Agrupar por regiões válidas e únicas (descarta vazias/nulas)
        const allRegioes = Array.from(new Set(prods.map(p => p.regiao).filter(Boolean)));
        setRegioes(allRegioes);

        setLoading(false);
      })
      .catch(() => {
        setError("Erro ao carregar produtos");
        setLoading(false);
      });
  }, []);

  return { products, loading, error, regioes };
}
