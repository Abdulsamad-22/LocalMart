import { create } from "zustand";

const useProductStore = create((set) => ({
  products: [],
  editingProduct: null,
  setProducts: (item) => set({ products: item }),
  setEditingProduct: (item) => set({ editingProduct: item }),
  setSearchQuery: (query) => set({ searchQuery: query }),
}));

export default useProductStore;
