
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

    fetch("https://api.guiawinelocals.com/api/locations?pagination[pageSize]=1000")
      .then(async (res) => {
        if (!res.ok) throw new Error("Erro ao buscar regiões");
        const data = await res.json();
        // O endpoint retorna em data[]
        const regioesApi = Array.isArray(data?.data) ? data.data : [];
        // Supondo que cada item na resposta tenha o campo 'name' como o nome da região
        const regioesEnum = regioesApi.map((item: any) => ({
          label: item.name,
          value: item.name
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
