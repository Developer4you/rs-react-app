import { render, screen, fireEvent } from '@testing-library/react';
import { Flyout } from '../Flyout/Flyout';
import * as storeModule from '../../store/selectedItemsStore';
import { vi, describe, beforeEach, it, expect } from 'vitest';

const mockClearAll = vi.fn();
const mockToggleItem = vi.fn();
const mockRemoveItem = vi.fn();

vi.mock('../../store/selectedItemsStore', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(actual as object),
    useSelectedItemsStore: () => ({
      selectedItems: [],
      toggleItem: mockToggleItem,
      removeItem: mockRemoveItem,
      clearAll: mockClearAll,
    }),
  };
});

describe('Flyout Component', () => {
  const mockItems = [
    {
      id: 1,
      name: 'Rick Sanchez',
      locationName: 'Earth (C-137)',
      gender: 'Male',
      image: 'https://example.com/rick.jpg',
      detailsUrl: 'https://example.com/character/1',
    },
    {
      id: 2,
      name: 'Morty Smith',
      locationName: 'Earth (Replacement Dimension)',
      gender: 'Male',
      image: 'https://example.com/morty.jpg',
      detailsUrl: 'https://example.com/character/2',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    globalThis.URL.createObjectURL = vi.fn(() => 'mock-url');
  });

  it('does not render when there are no selected items', () => {
    vi.spyOn(storeModule, 'useSelectedItemsStore').mockReturnValue({
      selectedItems: [],
      toggleItem: mockToggleItem,
      removeItem: mockRemoveItem,
      clearAll: mockClearAll,
    });

    render(<Flyout />);
    expect(screen.queryByText(/item selected/)).not.toBeInTheDocument();
  });

  it('renders with the correct number of selected items', () => {
    vi.spyOn(storeModule, 'useSelectedItemsStore').mockReturnValue({
      selectedItems: mockItems,
      toggleItem: mockToggleItem,
      removeItem: mockRemoveItem,
      clearAll: mockClearAll,
    });

    render(<Flyout />);
    expect(screen.getByText('2 items selected')).toBeInTheDocument();
    expect(screen.getByText('Unselect all')).toBeInTheDocument();
    expect(screen.getByText('Download')).toBeInTheDocument();
  });

  it('calls clearAll when "Unselect all" button is clicked', () => {
    vi.spyOn(storeModule, 'useSelectedItemsStore').mockReturnValue({
      selectedItems: mockItems,
      toggleItem: mockToggleItem,
      removeItem: mockRemoveItem,
      clearAll: mockClearAll,
    });

    render(<Flyout />);
    fireEvent.click(screen.getByText('Unselect all'));
    expect(mockClearAll).toHaveBeenCalledTimes(1);
  });

  it('creates and downloads CSV when "Download" button is clicked', () => {
    vi.spyOn(storeModule, 'useSelectedItemsStore').mockReturnValue({
      selectedItems: mockItems,
      toggleItem: mockToggleItem,
      removeItem: mockRemoveItem,
      clearAll: mockClearAll,
    });

    const originalCreateElement = document.createElement.bind(document);
    const createElementSpy = vi.spyOn(document, 'createElement');
    const appendChildSpy = vi.spyOn(document.body, 'appendChild');
    const removeChildSpy = vi.spyOn(document.body, 'removeChild');

    const mockClick = vi.fn();

    createElementSpy.mockImplementation((tagName) => {
      const element = originalCreateElement(tagName);
      if (tagName === 'a') {
        element.click = mockClick;
      }
      return element;
    });

    render(<Flyout />);
    fireEvent.click(screen.getByText('Download'));

    expect(globalThis.URL.createObjectURL).toHaveBeenCalled();
    expect(createElementSpy).toHaveBeenCalledWith('a');
    expect(appendChildSpy).toHaveBeenCalled();
    expect(mockClick).toHaveBeenCalled();
    expect(removeChildSpy).toHaveBeenCalled();
  });
});
