import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SearchApp } from '../../components/SearchApp/SearchApp';
import {
  fetchCharacterDetails,
  fetchCharacters,
  getSavedSearchQuery,
} from '../../api/rickAndMortyApi';
import { vi, describe, beforeEach, it, expect } from 'vitest';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import { ThemeProvider } from '../../context/ThemeContext';

vi.mock('../../api/rickAndMortyApi', () => ({
  fetchCharacters: vi.fn(),
  getSavedSearchQuery: vi.fn(),
  saveSearchQuery: vi.fn(),
  fetchCharacterDetails: vi.fn(),
}));

const mockCharacters = [
  {
    id: 1,
    name: 'Rick Sanchez',
    status: 'Alive',
    species: 'Human',
    type: '',
    gender: 'Male',
    origin: { name: 'Earth (C-137)', url: 'https://example.com' },
    location: {
      name: 'Earth (Replacement Dimension)',
      url: 'https://example.com',
    },
    image: 'https://example.com/rick.jpg',
    episode: ['https://example.com/episode/1'],
    url: 'https://example.com/character/1',
    created: '2017-11-04T18:48:46.250Z',
  },
];

describe('SearchApp Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    vi.mocked(getSavedSearchQuery).mockImplementation(() => '');
    vi.mocked(fetchCharacters).mockResolvedValue({
      info: { count: 1, pages: 1, next: null, prev: null },
      results: mockCharacters,
    });
  });

  const renderWithRouter = (initialEntries: string[] = ['/']) => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={initialEntries}>
          <ThemeProvider>
            <Routes>
              <Route
                path="/"
                element={
                  <ErrorBoundary>
                    <SearchApp />
                  </ErrorBoundary>
                }
              />
            </Routes>
          </ThemeProvider>
        </MemoryRouter>
      </QueryClientProvider>
    );
  };

  it('renders search app with controls and results', async () => {
    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByRole('searchbox')).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('fetches characters on mount if saved query exists', async () => {
    vi.mocked(getSavedSearchQuery).mockImplementation(() => 'Rick');
    vi.mocked(fetchCharacters).mockResolvedValue({
      info: { count: 1, pages: 1, next: null, prev: null },
      results: mockCharacters,
    });

    renderWithRouter(['/?search=Rick']);

    await waitFor(() => {
      expect(fetchCharacters).toHaveBeenCalledWith(1, 'Rick');
    });
  });

  it('performs search when search button is clicked', async () => {
    renderWithRouter();

    const input = screen.getByRole('searchbox');
    const button = screen.getByRole('button', { name: /search/i });

    await userEvent.type(input, 'Morty');
    await userEvent.click(button);

    await waitFor(() => {
      expect(fetchCharacters).toHaveBeenCalledWith(1, 'Morty');
    });
  });

  it('handles API errors gracefully', async () => {
    vi.mocked(fetchCharacters).mockRejectedValue(new Error('API Error'));

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByTestId('global-error')).toHaveTextContent('API Error');
    });
  });

  it('changes page when pagination buttons are clicked', async () => {
    vi.mocked(fetchCharacters)
      .mockResolvedValueOnce({
        info: { count: 20, pages: 2, next: 'page2', prev: null },
        results: mockCharacters,
      })
      .mockResolvedValueOnce({
        info: { count: 20, pages: 2, next: null, prev: 'page1' },
        results: mockCharacters,
      });

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
    });

    const nextButton = screen.getByRole('button', { name: /next/i });
    await userEvent.click(nextButton);

    await waitFor(() => {
      expect(fetchCharacters).toHaveBeenCalledWith(2, '');
    });
  });

  it('renders character details when detailsParam is present', async () => {
    const mockCharacter = {
      id: 1,
      name: 'Rick Sanchez',
      status: 'Alive',
      species: 'Human',
      type: '',
      gender: 'Male',
      origin: { name: 'Earth (C-137)', url: '' },
      location: { name: 'Earth (Replacement Dimension)', url: '' },
      image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
      episode: [],
      url: '',
      created: new Date().toISOString(),
    };

    vi.mocked(fetchCharacterDetails).mockResolvedValue(mockCharacter);
    vi.mocked(fetchCharacters).mockResolvedValue({
      info: { count: 1, pages: 1, next: null, prev: null },
      results: [],
    });

    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/?details=1']}>
          <ThemeProvider>
            <Routes>
              <Route path="/" element={<SearchApp />} />
            </Routes>
          </ThemeProvider>
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    });
  });

  it('refreshes data when refresh button is clicked', async () => {
    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByRole('searchbox')).toBeInTheDocument();
    });

    const refreshButton = screen.getByText('Refresh Data');
    await userEvent.click(refreshButton);

    await waitFor(() => {
      expect(fetchCharacters).toHaveBeenCalledTimes(2);
    });
  });

  it('handles errors in character details', async () => {
    vi.mocked(fetchCharacterDetails).mockRejectedValue(
      new Error('Details error')
    );

    renderWithRouter(['/?details=1']);

    await waitFor(
      () => {
        expect(screen.getByText(/Details error/)).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });
});
