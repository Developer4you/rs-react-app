import { useQuery, useMutation } from '@tanstack/react-query';
import type { ApiResponse, Character } from '../interfaces/interfaces';
import {
  fetchCharacters,
  fetchCharacterDetails,
  saveSearchQuery,
  getSavedSearchQuery,
} from '../api/rickAndMortyApi';

export const useCharactersQuery = (page: number, name: string = '') => {
  return useQuery<ApiResponse, Error>({
    queryKey: ['characters', page, name],
    queryFn: () => fetchCharacters(page, name),
    enabled: !!name || page > 0,
  });
};

export const useCharacterDetailsQuery = (id?: number) => {
  return useQuery<Character, Error>({
    queryKey: ['character', id],
    queryFn: () => {
      if (!id) throw new Error('Character ID is required');
      return fetchCharacterDetails(id);
    },
    enabled: !!id,
  });
};

export const useSearchQueryMutation = () => {
  return useMutation({
    mutationFn: (query: string) => {
      saveSearchQuery(query);
      return Promise.resolve();
    },
  });
};

export const useGetSavedQuery = () => {
  return useQuery<string>({
    queryKey: ['savedQuery'],
    queryFn: getSavedSearchQuery,
    initialData: '',
  });
};
