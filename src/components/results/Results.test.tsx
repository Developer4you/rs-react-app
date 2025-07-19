import { render, screen, fireEvent } from '@testing-library/react';
import Results from './Results';
import { type Character } from '../../interfaces/interfaces';
import { describe, it, vi, expect } from 'vitest';

describe('Results Component', () => {
  const mockCharacters: Character[] = [
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
    {
      id: 2,
      name: 'Morty Smith',
      status: 'Alive',
      species: 'Human',
      type: '',
      gender: 'Male',
      origin: { name: 'Earth (C-137)', url: 'https://example.com' },
      location: {
        name: 'Earth (Replacement Dimension)',
        url: 'https://example.com',
      },
      image: 'https://example.com/morty.jpg',
      episode: ['https://example.com/episode/1'],
      url: 'https://example.com/character/2',
      created: '2017-11-04T18:50:21.651Z',
    },
  ];

  it('renders loading state when loading is true', () => {
    render(
      <Results
        items={[]}
        loading={true}
        error={null}
        page={1}
        totalPages={1}
        onPageChange={vi.fn()}
      />
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders error message when error is present', () => {
    const errorMessage = 'API Error';
    render(
      <Results
        items={[]}
        loading={false}
        error={errorMessage}
        page={1}
        totalPages={1}
        onPageChange={vi.fn()}
      />
    );

    expect(screen.getByText(`API Error: ${errorMessage}`)).toBeInTheDocument();
  });

  it('renders "No results found" when items array is empty', () => {
    render(
      <Results
        items={[]}
        loading={false}
        error={null}
        page={1}
        totalPages={1}
        onPageChange={vi.fn()}
      />
    );

    expect(screen.getByText('No results found')).toBeInTheDocument();
  });

  it('renders list of characters when items are provided', () => {
    render(
      <Results
        items={mockCharacters}
        loading={false}
        error={null}
        page={1}
        totalPages={1}
        onPageChange={vi.fn()}
      />
    );

    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    expect(screen.getByText('Morty Smith')).toBeInTheDocument();
  });

  it('renders pagination controls when totalPages > 1', () => {
    render(
      <Results
        items={mockCharacters}
        loading={false}
        error={null}
        page={2}
        totalPages={3}
        onPageChange={vi.fn()}
      />
    );

    expect(screen.getByText('Page 2 of 3')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Previous' })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
  });

  it('calls onPageChange with correct page number when pagination buttons are clicked', () => {
    const mockOnPageChange = vi.fn();
    render(
      <Results
        items={mockCharacters}
        loading={false}
        error={null}
        page={2}
        totalPages={3}
        onPageChange={mockOnPageChange}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Previous' }));
    expect(mockOnPageChange).toHaveBeenCalledWith(1);

    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(mockOnPageChange).toHaveBeenCalledWith(3);
  });

  it('disables previous button on first page and next button on last page', () => {
    const { rerender } = render(
      <Results
        items={mockCharacters}
        loading={false}
        error={null}
        page={1}
        totalPages={3}
        onPageChange={vi.fn()}
      />
    );

    expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next' })).not.toBeDisabled();

    rerender(
      <Results
        items={mockCharacters}
        loading={false}
        error={null}
        page={3}
        totalPages={3}
        onPageChange={vi.fn()}
      />
    );

    expect(screen.getByRole('button', { name: 'Previous' })).not.toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
  });
});
