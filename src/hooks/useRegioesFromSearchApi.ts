
import { useEffect, useState } from "react";

type Regiao = {
  label: string;
  value: string;
};

export function useRegioesFromSearchApi() {
  const [regioes, setRegioes] = useState<Regiao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Precisa mandar um body, mesmo que vazio, para Search API
    fetch("https://search.guiawinelocals.com/indexes/location/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ facet: "region" })
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Erro Search API");
        const data = await res.json();
        // Espera resultado em facets.region.buckets
        const buckets: any[] = data?.facets?.region?.buckets || [];
        const regioesEnum = buckets.map(b => ({
          label: b.value,
          value: b.value
        }));
        setRegioes(regioesEnum);
      })
      .catch(() => {
        setError("Erro ao buscar regiões");
      })
      .finally(() => setLoading(false));
  }, []);

  return { regioes, loading, error };
}
