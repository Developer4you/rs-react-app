import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchApp from './SearchApp';
import {
  fetchCharacters,
  getSavedSearchQuery,
} from '../../api/rickAndMortyApi';
import { vi, describe, beforeEach, it, expect } from 'vitest';
import ErrorBoundary from '../../ErrorBoundary';

vi.mock('../../api/rickAndMortyApi', () => ({
  fetchCharacters: vi.fn(),
  getSavedSearchQuery: vi.fn(),
  saveSearchQuery: vi.fn(),
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

  it('renders search app with controls and results', async () => {
    render(<SearchApp />);

    await waitFor(() => {
      expect(screen.getByRole('searchbox')).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('fetches characters on mount if saved query exists', async () => {
    vi.mocked(getSavedSearchQuery).mockImplementation(() => 'Rick');

    render(<SearchApp />);

    await waitFor(() => {
      expect(fetchCharacters).toHaveBeenCalledWith(1, 'Rick');
    });
  });

  it('performs search when search button is clicked', async () => {
    render(<SearchApp />);

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

    render(<SearchApp />);

    await waitFor(() => {
      expect(screen.getByText(/API Error/)).toBeInTheDocument();
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

    render(<SearchApp />);

    await waitFor(() => {
      expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
    });

    const nextButton = screen.getByRole('button', { name: /next/i });
    await userEvent.click(nextButton);

    await waitFor(() => {
      expect(fetchCharacters).toHaveBeenCalledWith(2, '');
    });
  });

  it('throws error when error button is clicked', async () => {
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <SearchApp />
      </ErrorBoundary>
    );

    const errorButton = screen.getByRole('button', { name: /error button/i });

    await userEvent.click(errorButton);

    expect(consoleError).toHaveBeenCalled();

    consoleError.mockRestore();

    expect(screen.getByText('Something went wrong!')).toBeInTheDocument();
  });
});
