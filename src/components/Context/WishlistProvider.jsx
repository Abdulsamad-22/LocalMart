import { createContext, useContext, useState } from "react";
import { useCart } from "./CartProvider";

const WishlistContext = createContext();
export const useWishlist = () => useContext(WishlistContext);

export default function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [recentlyToggled, setRecentlyToggled] = useState(null);
  const { setCartItems } = useCart();

  function addToWishlist(product) {
    setWishlistItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);

      if (!existingItem) {
        // Add to wishlist with animation trigger
        setRecentlyToggled({ product, action: "added" });
        return [...prev, { ...product, quantity: 1 }];
      } else {
        // Remove from wishlist with animation trigger
        setRecentlyToggled({ product, action: "removed" });
        return prev.filter((item) => item.id !== product.id);
      }
    });

    // Clear animation state after delay
    setTimeout(() => setRecentlyToggled(null), 1000);
  }

  function removeFromWishlist(id) {
    if (wishlistItems.length === 0) {
      alert("Your wishlist is empty!");
      return;
    }
    setWishlistItems((prev) => prev.filter((item) => item.id !== id));
  }

  function addAllToCart() {
    setCartItems((prev) => {
      const updatedCart = [...prev];

      wishlistItems.forEach((wishlistItem) => {
        const existingCartItem = updatedCart.find(
          (item) => item.id === wishlistItem.id
        );

        if (existingCartItem) {
          existingCartItem.quantity += 1;
        } else {
          updatedCart.push({ ...wishlistItem, quantity: 1 });
        }
      });

      return updatedCart;
    });

    setWishlistItems([]);
    window.scrollTo(0, 0);
  }

  function isInWishList(productId) {
    return wishlistItems.some((item) => item.id === productId);
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
        addAllToCart,
        removeFromWishlist,
        isInWishList,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}
