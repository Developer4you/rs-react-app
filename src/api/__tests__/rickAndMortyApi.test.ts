import { describe, beforeEach, vi, it, expect, afterEach } from 'vitest';
import {
  fetchCharacterDetails,
  fetchCharacters,
  getSavedSearchQuery,
  saveSearchQuery,
} from '../../api/rickAndMortyApi';
import type { ApiResponse, Character } from '../../interfaces/interfaces';

describe('rickAndMortyApi', () => {
  const mockCharacter: Character = {
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

  const mockSuccessResponse: ApiResponse = {
    info: { count: 1, pages: 1, next: null, prev: null },
    results: [mockCharacter],
  };

  const mockHeaders = new Headers();

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();

    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        headers: mockHeaders,
        json: () => Promise.resolve(mockSuccessResponse),
      } as Response)
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('fetchCharacters', () => {
    it('should make successful API call without name', async () => {
      const result = await fetchCharacters(1);

      expect(fetch).toHaveBeenCalledWith(
        'https://rickandmortyapi.com/api/character/?page=1'
      );
      expect(result).toEqual(mockSuccessResponse);
    });

    it('should make successful API call with name', async () => {
      const result = await fetchCharacters(1, 'Rick');

      expect(fetch).toHaveBeenCalledWith(
        'https://rickandmortyapi.com/api/character/?page=1&name=Rick'
      );
      expect(result).toEqual(mockSuccessResponse);
    });

    it('should handle 404 status by returning empty results', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 404,
        headers: mockHeaders,
        json: () => Promise.resolve({ error: 'Not found' }),
      } as Response);

      const result = await fetchCharacters(1, 'NonExistent');

      expect(result).toEqual({
        info: { count: 0, pages: 0, next: null, prev: null },
        results: [],
      });
    });

    it('should handle network errors', async () => {
      const consoleErrorMock = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      const networkError = new Error('Network error');
      vi.mocked(fetch).mockRejectedValueOnce(networkError);

      await expect(fetchCharacters(1)).rejects.toThrow('Network error');

      expect(consoleErrorMock).toHaveBeenCalledWith(
        'API request failed:',
        networkError
      );

      consoleErrorMock.mockRestore();
    });

    it('should log error on API failure', async () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      vi.mocked(fetch).mockRejectedValueOnce(new Error('API failed'));

      await expect(fetchCharacters(1)).rejects.toThrow();
      expect(consoleSpy).toHaveBeenCalledWith(
        'API request failed:',
        expect.any(Error)
      );
    });
  });

  describe('fetchCharacterDetails', () => {
    it('should fetch character details successfully', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: mockHeaders,
        json: () => Promise.resolve(mockCharacter),
      } as Response);

      const result = await fetchCharacterDetails(1);
      expect(result).toEqual(mockCharacter);
      expect(fetch).toHaveBeenCalledWith(
        'https://rickandmortyapi.com/api/character/1'
      );
    });

    it('should handle HTTP errors in fetchCharacterDetails', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 404,
        headers: mockHeaders,
        json: () => Promise.resolve({ error: 'Not found' }),
      } as Response);

      await expect(fetchCharacterDetails(999)).rejects.toThrow(
        'HTTP error! status: 404'
      );
    });

    it('should handle network errors in fetchCharacterDetails', async () => {
      const consoleErrorMock = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      const networkError = new Error('Network failed');
      vi.mocked(fetch).mockRejectedValueOnce(networkError);

      await expect(fetchCharacterDetails(1)).rejects.toThrow('Network failed');
      expect(consoleErrorMock).toHaveBeenCalledWith(
        'API request failed:',
        networkError
      );

      consoleErrorMock.mockRestore();
    });
  });

  describe('localStorage functions', () => {
    describe('getSavedSearchQuery', () => {
      it('should return empty string when no query saved', () => {
        expect(getSavedSearchQuery()).toBe('');
      });

      it('should return saved query', () => {
        localStorage.setItem('rickAndMortySearchQuery', 'Morty');
        expect(getSavedSearchQuery()).toBe('Morty');
      });
    });

    describe('saveSearchQuery', () => {
      it('should save trimmed query', () => {
        saveSearchQuery('  Rick  ');
        expect(localStorage.getItem('rickAndMortySearchQuery')).toBe('Rick');
      });

      it('should handle empty string', () => {
        saveSearchQuery('');
        expect(localStorage.getItem('rickAndMortySearchQuery')).toBe('');
      });

      it('should overwrite existing value', () => {
        localStorage.setItem('rickAndMortySearchQuery', 'Morty');
        saveSearchQuery('Rick');
        expect(localStorage.getItem('rickAndMortySearchQuery')).toBe('Rick');
      });
    });
  });
});
