
import { useEffect, useState } from 'react';

interface VideoGallery {
  playback_id: string;
  id: string | number;
  title: string | null;
}
export interface ProductData {
  id: number;
  attributes: {
    name: string;
    slug: string;
    price: number | null;
    city: string | null;
    state: string | null;
    partner: {
      data: {
        attributes: {
          name: string | null;
        };
      };
    } | null;
    videoGallery: VideoGallery[] | null;
  };
}

interface ApiResponse {
  data: ProductData[];
}

export function useYouTubeShortsProducts() {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          'https://api.guiawinelocals.com/api/products?filters[videoGallery][title][$notNull]=true&pagination[pageSize]=1000'
        );
        const data: ApiResponse = await response.json();
        // LOG: Detalhar os produtos e videoGallery recebidos
        if (Array.isArray(data.data)) {
          data.data.forEach((p, idx) => {
            console.log(`[Produto #${idx}] id=${p.id}, name=${p.attributes?.name}`);
            if (p.attributes?.videoGallery) {
              p.attributes.videoGallery.forEach((v, vidx) => {
                console.log(
                  `  [videoGallery #${vidx}] playback_id=${v.playback_id}, title=${v.title}`
                );
              });
            } else {
              console.log('  Nenhum videoGallery.');
            }
          });
        }
        // Aplicar filtro exatamente como esperado
        const filtered = data.data.filter(
          (p) =>
            Array.isArray(p.attributes?.videoGallery) &&
            p.attributes.videoGallery.some(
              (video) => !!video.playback_id && typeof video.playback_id === 'string'
            )
        );
        console.log('Produtos encontrados após filtro:', filtered);
        setProducts(filtered);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading };
}
