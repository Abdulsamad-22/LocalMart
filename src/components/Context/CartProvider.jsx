import { createContext, useContext, useState } from "react";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export default function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  function handleAddToCart(product) {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);
      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id
            ? {
                ...item,
                price: item.unitPrice * (item.quantity + 1),
                quantity: item.quantity + 1,
              }
            : item
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
    console.log(cartItems);
    console.log(`item ${product.id} added to cart`);
  }

  function removeFromCart(id) {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  }

  function increaseCart(id) {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
              price: item.unitPrice * (item.quantity + 1),
            }
          : item
      )
    );
  }

  function decreaseCart(id) {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity - 1,
                price: item.unitPrice * (item.quantity - 1),
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  const cartTotal = cartItems.reduce((sum, amount) => {
    return sum + amount.price;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartTotal,
        increaseCart,
        decreaseCart,
        handleAddToCart,
        removeFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
