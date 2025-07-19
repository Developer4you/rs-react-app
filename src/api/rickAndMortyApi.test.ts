import { describe, beforeEach, vi, it, expect } from 'vitest';
import {
  fetchCharacters,
  getSavedSearchQuery,
  saveSearchQuery,
} from './rickAndMortyApi';

describe('rickAndMortyApi', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    globalThis.fetch = vi.fn();
  });

  describe('fetchCharacters', () => {
    it('fetches characters successfully', async () => {
      const mockResponse = {
        info: { count: 1, pages: 1, next: null, prev: null },
        results: [{ id: 1, name: 'Rick Sanchez' }],
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response);

      const result = await fetchCharacters(1, 'Rick');
      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith(
        'https://rickandmortyapi.com/api/character/?page=1&name=Rick'
      );
    });

    it('handles API error response', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      } as Response);

      const result = await fetchCharacters(1, 'Invalid');
      expect(result).toEqual({
        info: { count: 0, pages: 0, next: null, prev: null },
        results: [],
      });
    });

    it('returns empty results when status is not 200', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 500,
      } as Response);

      const result = await fetchCharacters(1, 'Invalid');
      expect(result).toEqual({
        info: { count: 0, pages: 0, next: null, prev: null },
        results: [],
      });
    });

    it('handles network errors', async () => {
      vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'));

      await expect(fetchCharacters(1)).rejects.toThrow('Network error');
    });
  });

  describe('localStorage functions', () => {
    it('getSavedSearchQuery returns empty string when no query is saved', () => {
      expect(getSavedSearchQuery()).toBe('');
    });

    it('getSavedSearchQuery returns saved query', () => {
      localStorage.setItem('rickAndMortySearchQuery', 'Morty');
      expect(getSavedSearchQuery()).toBe('Morty');
    });

    it('saveSearchQuery saves query to localStorage', () => {
      saveSearchQuery('  Rick  ');
      expect(localStorage.getItem('rickAndMortySearchQuery')).toBe('Rick');
    });
  });
});
