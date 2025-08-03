import { renderHook, waitFor } from '@testing-library/react';
import { useCharacter } from '../useCharacter';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchCharacterDetails } from '../../api/rickAndMortyApi';

vi.mock('../../api/rickAndMortyApi');

describe('useCharacter hook', () => {
  const mockCharacter = {
    id: 1,
    name: 'Rick Sanchez',
    status: 'Alive',
    species: 'Human',
    type: '',
    gender: 'Male',
    origin: { name: 'Earth (C-137)', url: '' },
    location: { name: 'Earth (Replacement Dimension)', url: '' },
    image: '',
    episode: [],
    url: '',
    created: new Date().toISOString(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return null when no characterId is provided', () => {
    const { result } = renderHook(() => useCharacter());
    expect(result.current.character).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should fetch character details when characterId is provided', async () => {
    vi.mocked(fetchCharacterDetails).mockResolvedValue(mockCharacter);

    const { result } = renderHook(() => useCharacter(1));

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.character).toEqual(mockCharacter);
    expect(result.current.error).toBeNull();
    expect(fetchCharacterDetails).toHaveBeenCalledWith(1);
  });

  it('should handle errors when fetching character details', async () => {
    const errorMessage = 'Failed to fetch character';
    vi.mocked(fetchCharacterDetails).mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useCharacter(1));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.character).toBeNull();
    expect(result.current.error).toBe(errorMessage);
  });
});
