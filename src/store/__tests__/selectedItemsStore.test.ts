import { act } from '@testing-library/react';
import { useSelectedItemsStore } from '../selectedItemsStore';
import { describe, it, expect, beforeEach } from 'vitest';

describe('selectedItemsStore', () => {
  beforeEach(() => {
    useSelectedItemsStore.getState().clearAll();
  });

  it('adds and removes items', () => {
    const item = {
      id: 1,
      name: 'Rick',
      locationName: 'Earth',
      gender: 'Male',
      image: '',
      detailsUrl: '',
    };

    act(() => {
      useSelectedItemsStore.getState().toggleItem(item);
    });
    expect(useSelectedItemsStore.getState().selectedItems).toEqual([item]);

    act(() => {
      useSelectedItemsStore.getState().toggleItem(item);
    });
    expect(useSelectedItemsStore.getState().selectedItems).toEqual([]);
  });

  it('clears all items', () => {
    const item = {
      id: 1,
      name: 'Rick',
      locationName: 'Earth',
      gender: 'Male',
      image: '',
      detailsUrl: '',
    };

    act(() => {
      useSelectedItemsStore.getState().toggleItem(item);
    });

    act(() => {
      useSelectedItemsStore.getState().clearAll();
    });

    expect(useSelectedItemsStore.getState().selectedItems).toEqual([]);
  });
});
