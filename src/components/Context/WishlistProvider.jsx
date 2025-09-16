import { createContext, useContext, useEffect, useState } from "react";

const WishlistContext = createContext();
export const useWishlist = () => useContext(WishlistContext);

export default function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState(() => {
    const saved = localStorage.getItem("wishlistItems");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("wishlistItems", JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  function addToWishlist(product) {
    setWishlistItems((prev) => {
      const existingItem = prev.find(
        (item) => item.id === product.id.toString()
      );

      if (!existingItem) {
        return [...prev, { ...product, quantity: 1 }];
      } else {
        return prev.filter((item) => item.id !== product.id.toString());
      }
    });
  }

  function removeFromWishlist(id) {
    if (wishlistItems.length === 0) {
      alert("Your wishlist is empty!");
      return;
    }
    setWishlistItems((prev) => prev.filter((item) => item.id !== id));
  }

  function isInWishList(productId) {
    return wishlistItems.some((item) => item.id.toString() === productId);
  }

  function clearAllWishlist() {
    setWishlistItems([]);
    window.scrollTo(0, 0);
  }
  return (
    <WishlistContext.Provider
      value={{
        addToWishlist,
        wishlistItems,
        clearAllWishlist,
        removeFromWishlist,
        isInWishList,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}
