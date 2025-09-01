import { createContext, useContext, useEffect, useState } from "react";
import { useCart } from "./CartProvider";

const WishlistContext = createContext();
export const useWishlist = () => useContext(WishlistContext);

export default function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState(() => {
    const saved = localStorage.getItem("wishlistItems");
    return saved ? JSON.parse(saved) : [];
  });

  const { setCartItems } = useCart();

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

  function addAllToCart() {
    setCartItems((prevCart) => {
      const newCart = prevCart.map((item) => ({ ...item }));

      wishlistItems.forEach((wishlistItem) => {
        if (!wishlistItem || wishlistItem.id) {
          return;
        }

        const existingIndex = newCart.findIndex(
          (item) => item.id?.toString() === wishlistItem.id.toString()
        );

        // Increase product quantity if it is in cart
        if (existingIndex === -1) {
          newCart[existingIndex] = {
            ...newCart[existingIndex],
            quantity: (newCart[existingIndex].quantity || 0) + 1,
          };
        } else {
          const price = wishlistItem.item_price
            ? Number(wishlistItem.item_price)
            : 0;

          if (isNaN(price)) {
            return;
          }
          // Add new product to cart
          newCart.push({
            ...wishlistItem,
            quantity: 1,
            price: price,
          });
        }
      });
      return newCart;
    });

    // Clear wishlist after adding all items to cart
    try {
      localStorage.removeItem("wishlistItems");
    } catch (error) {
      console.warn("Could not access localStorage:", error);
    }

    setWishlistItems([]);

    try {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      // Fallback for older browsers
      window.scrollTo(0, 0);
    }
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
        addAllToCart,
        removeFromWishlist,
        isInWishList,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}
