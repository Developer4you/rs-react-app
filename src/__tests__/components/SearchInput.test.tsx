import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchInput } from '../../components/SearchInput/SearchInput';
import { describe, it, vi, expect } from 'vitest';

describe('SearchInput Component', () => {
  it('renders search input with placeholder', () => {
    const mockHandleInputChange = vi.fn();
    render(
      <SearchInput inputValue="" handleInputChange={mockHandleInputChange} />
    );

    expect(screen.getByRole('searchbox')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
  });

  it('displays the initial value', () => {
    const mockHandleInputChange = vi.fn();
    render(
      <SearchInput
        inputValue="Rick"
        handleInputChange={mockHandleInputChange}
      />
    );

    expect(screen.getByRole('searchbox')).toHaveValue('Rick');
  });

  it('calls handleInputChange when user types', async () => {
    const mockHandleInputChange = vi.fn();
    render(
      <SearchInput inputValue="" handleInputChange={mockHandleInputChange} />
    );

    const input = screen.getByRole('searchbox');
    await userEvent.type(input, 'Morty');

    expect(mockHandleInputChange).toHaveBeenCalledTimes(5);
  });
});
