import { useEffect, useState } from 'react';
import { Pokemon } from '../types';

// Ajusta la ruta según tu JSON en public/data/pokemons.json
export function usePokemonData() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/data/pokemons.json');
        const data = await res.json();
        setPokemons(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { pokemons, loading };
}
