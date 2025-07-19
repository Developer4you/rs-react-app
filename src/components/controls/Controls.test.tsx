import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Controls from './Controls';
import { describe, vi, beforeEach, it, expect } from 'vitest';

describe('Controls Component', () => {
  const mockOnSearch = vi.fn();

  beforeEach(() => {
    localStorage.clear();
    mockOnSearch.mockClear();
  });

  it('renders search input and button', () => {
    render(
      <Controls onSearch={mockOnSearch} loading={false} initialValue="" />
    );

    expect(screen.getByRole('searchbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
  });

  it('updates input value when user types', async () => {
    render(
      <Controls onSearch={mockOnSearch} loading={false} initialValue="" />
    );
    const input = screen.getByRole('searchbox');

    await userEvent.type(input, 'Rick');
    expect(input).toHaveValue('Rick');
  });

  it('trims input value and calls onSearch when search button is clicked', async () => {
    render(
      <Controls onSearch={mockOnSearch} loading={false} initialValue="" />
    );
    const input = screen.getByRole('searchbox');
    const button = screen.getByRole('button', { name: 'Search' });

    await userEvent.type(input, '  Rick  ');
    await userEvent.click(button);

    expect(mockOnSearch).toHaveBeenCalledWith('Rick');
  });

  it('displays loading state on button when loading prop is true', () => {
    render(<Controls onSearch={mockOnSearch} loading={true} initialValue="" />);
    expect(screen.getByRole('button', { name: 'Searching...' })).toBeDisabled();
  });

  it('loads initial value from localStorage on mount', () => {
    localStorage.setItem('rickAndMortySearchQuery', 'Morty');
    render(
      <Controls onSearch={mockOnSearch} loading={false} initialValue="" />
    );

    expect(screen.getByRole('searchbox')).toHaveValue('Morty');
  });

  it('uses initialValue prop over localStorage value', () => {
    localStorage.setItem('rickAndMortySearchQuery', 'Morty');
    render(
      <Controls onSearch={mockOnSearch} loading={false} initialValue="Rick" />
    );

    expect(screen.getByRole('searchbox')).toHaveValue('Rick');
  });
});
