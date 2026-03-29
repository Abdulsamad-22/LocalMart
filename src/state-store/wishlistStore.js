import { create } from "zustand";

const loadWishlist = () => {
  try {
    const saved = localStorage.getItem("wishlistItems");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const useWishlistStore = create((set, get) => ({
  wishlistItems: loadWishlist(),

  addToWishlist: (product) => {
    const { wishlistItems } = get();
    const exists = wishlistItems.some(
      (item) => item.id.toString() === product.id.toString(),
    );
    if (exists) {
      set({
        wishlistItems: wishlistItems.filter(
          (item) => item.id.toString() !== product.id.toString(),
        ),
      });
    } else {
      set({
        wishlistItems: [...wishlistItems, { ...product, quantity: 1 }],
      });
    }
  },

  removeFromWishlist: (id) => {
    const { wishlistItems } = get();
    if (wishlistItems.length === 0) {
      alert("Your wishlist is empty!");
      return;
    }
    set({
      wishlistItems: wishlistItems.filter(
        (item) => item.id.toString() !== id.toString(),
      ),
    });
  },

  isInWishList: (productId) => {
    const { wishlistItems } = get();
    return wishlistItems.some(
      (wish) => wish.id.toString() === productId.toString(),
    );
  },

  clearAllWishlist: () => {
    set({ wishlistItems: [] });
  },
}));

useWishlistStore.subscribe((state) => {
  localStorage.setItem("wishlistItems", JSON.stringify(state.wishlistItems));
});

export default useWishlistStore;
