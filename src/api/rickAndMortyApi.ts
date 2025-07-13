import type { ApiResponse } from '../interfaces/interfaces';

const API_BASE_URL = 'https://rickandmortyapi.com/api';

export const fetchCharacters = async (
  page: number = 1,
  name: string = ''
): Promise<ApiResponse> => {
  try {
    let url = `${API_BASE_URL}/character/?page=${page}`;
    if (name) {
      url += `&name=${encodeURIComponent(name.trim())}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      if (response.status !== 200) {
        return {
          info: { count: 0, pages: 0, next: null, prev: null },
          results: [],
        };
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

export const getSavedSearchQuery = (): string => {
  return localStorage.getItem('rickAndMortySearchQuery') || '';
};

export const saveSearchQuery = (query: string): void => {
  localStorage.setItem('rickAndMortySearchQuery', query.trim());
};
