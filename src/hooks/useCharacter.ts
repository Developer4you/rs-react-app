import { useState, useEffect } from 'react';
import { fetchCharacterDetails } from '../api/rickAndMortyApi';
import type { Character } from '../interfaces/interfaces';

export const useCharacter = (characterId?: number) => {
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!characterId) return;

    setLoading(true);
    setError(null);

    fetchCharacterDetails(characterId)
      .then(setCharacter)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [characterId]);

  return { character, loading, error };
};
