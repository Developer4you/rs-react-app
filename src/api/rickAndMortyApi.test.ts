import { describe, beforeEach, vi, it, expect, afterEach } from 'vitest';
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
    beforeEach(() => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('handles network errors', async () => {
      vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'));

      await expect(fetchCharacters(1)).rejects.toThrow('Network error');

      expect(console.error).toHaveBeenCalledWith(
        'API request failed:',
        expect.any(Error)
      );
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
