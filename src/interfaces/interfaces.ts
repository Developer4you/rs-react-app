export interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: {
    name: string;
    url: string;
  };
  location: {
    name: string;
    url: string;
  };
  image: string;
  episode: string[];
  url: string;
  created: string;
}

export interface ApiResponse {
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };
  results: Character[];
}

export interface SearchAppState {
  searchQuery: string;
  results: Character[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  hasError: boolean;
  shouldThrowError: boolean;
  renderError: Error | null;
}

export interface ResultsProps {
  items: Character[];
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onCharacterClick: (characterId: number) => void;
}

export interface CardProps {
  id: number;
  image: string;
  name: string;
  locationName: string;
  gender: string;
  detailsUrl: string;
}

export interface SelectedItem {
  id: number;
  name: string;
  locationName: string;
  gender: string;
  image: string;
  detailsUrl: string;
}
