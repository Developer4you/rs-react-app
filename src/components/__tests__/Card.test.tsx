import { render, screen, fireEvent } from '@testing-library/react';
import { Card } from '../../components/Card/Card';
import * as storeModule from '../../store/selectedItemsStore';
import { describe, vi, it, expect, beforeEach } from 'vitest';
import ReactLogo from '../../assets/react.svg';

const mockProps = {
  id: 1,
  image: 'https://example.com/image.jpg',
  name: 'Rick Sanchez',
  locationName: 'Earth (C-137)',
  gender: 'Male',
  detailsUrl: 'https://example.com/character/1',
};

describe('Card Component', () => {
  const mockToggleItem = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(storeModule, 'useSelectedItemsStore').mockReturnValue({
      selectedItems: [],
      toggleItem: mockToggleItem,
      removeItem: vi.fn(),
      clearAll: vi.fn(),
    });
  });

  it('calls toggleItem when checkbox is clicked', () => {
    render(<Card {...mockProps} />);

    const checkbox = screen.getByTestId(`checkbox-${mockProps.id}`);
    fireEvent.click(checkbox);

    expect(mockToggleItem).toHaveBeenCalledTimes(1);
    expect(mockToggleItem).toHaveBeenCalledWith({
      id: mockProps.id,
      name: mockProps.name,
      locationName: mockProps.locationName,
      gender: mockProps.gender,
      image: mockProps.image,
      detailsUrl: mockProps.detailsUrl,
    });
  });

  it('updates checkbox state when item is selected', () => {
    vi.spyOn(storeModule, 'useSelectedItemsStore').mockReturnValue({
      selectedItems: [{ ...mockProps }],
      toggleItem: mockToggleItem,
      removeItem: vi.fn(),
      clearAll: vi.fn(),
    });

    render(<Card {...mockProps} />);
    const checkbox = screen.getByTestId(
      `checkbox-${mockProps.id}`
    ) as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
  });

  it('renders card with correct props', () => {
    render(<Card {...mockProps} />);

    expect(screen.getByAltText('Rick Sanchez')).toHaveAttribute(
      'src',
      mockProps.image
    );
    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    expect(screen.getByText('Earth (C-137)')).toBeInTheDocument();
    expect(screen.getByText('Male')).toBeInTheDocument();
  });

  it('renders default values when props are empty', () => {
    const emptyProps = {
      id: 1,
      image: '',
      name: '',
      locationName: '',
      gender: '',
      detailsUrl: '',
    };

    render(<Card {...emptyProps} />);

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', ReactLogo);
    expect(img).toHaveAttribute('alt', 'Avatar');

    expect(screen.getByTestId('name')).toHaveTextContent('Name is empty');
    expect(screen.getByTestId('location')).toHaveTextContent(
      'Location is empty'
    );
    expect(screen.getByTestId('gender')).toHaveTextContent('Gender is empty');
  });
});
