import type { ApiResponse, Character } from '../interfaces/interfaces';

const API_BASE_URL = 'https://rickandmortyapi.com/api';

export const fetchCharacters = async (
  page: number = 1,
  name: string = ''
): Promise<ApiResponse> => {
  let url = `${API_BASE_URL}/character/?page=${page}`;
  if (name) {
    url += `&name=${encodeURIComponent(name.trim())}`;
  }

  const response = await fetch(url);

  if (!response.ok) {
    if (response.status === 404) {
      return {
        info: { count: 0, pages: 0, next: null, prev: null },
        results: [],
      };
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
};

export const fetchCharacterDetails = async (id: number): Promise<Character> => {
  const response = await fetch(`${API_BASE_URL}/character/${id}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
};

export const getSavedSearchQuery = (): string => {
  return localStorage.getItem('rickAndMortySearchQuery') || '';
};

export const saveSearchQuery = (query: string): void => {
  localStorage.setItem('rickAndMortySearchQuery', query.trim());
};
