import { create } from 'zustand';

interface SelectedItem {
  id: number;
  name: string;
  locationName: string;
  gender: string;
  image: string;
  detailsUrl: string;
}

interface SelectedItemsState {
  selectedItems: SelectedItem[];
  toggleItem: (item: SelectedItem) => void;
  removeItem: (id: number) => void;
  clearAll: () => void;
}

export const useSelectedItemsStore = create<SelectedItemsState>((set) => ({
  selectedItems: [],
  toggleItem: (item) =>
    set((state) => {
      const exists = state.selectedItems.some((i) => i.id === item.id);
      if (exists) {
        return {
          selectedItems: state.selectedItems.filter((i) => i.id !== item.id),
        };
      } else {
        return {
          selectedItems: [...state.selectedItems, item],
        };
      }
    }),
  removeItem: (id) =>
    set((state) => ({
      selectedItems: state.selectedItems.filter((item) => item.id !== id),
    })),
  clearAll: () => set({ selectedItems: [] }),
}));
