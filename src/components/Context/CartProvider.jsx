import { createContext, useContext, useEffect, useState } from "react";
import { useProduct } from "./ProductProvider";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export default function CartProvider({ children }) {
  const { products } = useProduct();
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("cartItems");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  function addToCart(container) {
    setCartItems((prevCart) => {
      const newCart = [...prevCart];

      // Handle both single item and array of items
      const itemsToAdd = Array.isArray(container) ? container : [container];

      itemsToAdd.forEach((cart) => {
        if (!cart || !cart.id) {
          console.warn("Invalid item passed to addToCart:", cart);
          return;
        }

        const existingIndex = newCart.findIndex(
          (item) => item.id.toString() === cart.id.toString()
        );

        if (existingIndex !== -1) {
          // Product exists → increase quantity
          const currentQuantity = newCart[existingIndex].quantity || 0;
          const maxQuantity =
            cart.item_units || newCart[existingIndex].item_units || 10;

          // Check not to exceed available products
          if (currentQuantity < maxQuantity) {
            newCart[existingIndex] = {
              ...newCart[existingIndex],
              quantity: currentQuantity + 1,
            };
          } else {
            console.warn("Maximum quantity reached for item:", cart.name);
            alert("Maximum quantity reached for item:", cart.name);
          }
        } else {
          // Add new product to cart
          const price = cart.item_price || cart.price || 0;
          const numericPrice = Number(price);

          if (isNaN(numericPrice)) {
            console.warn("Invalid price for item:", cart);
            return;
          }

          newCart.push({
            id: cart.id,
            name: cart.name || cart.item_name || "Unnamed Product",
            price: numericPrice,
            image: cart.image_url || cart.image || "",
            // seller: cart.seller || 'Unknown Seller',
            inStock: cart.item_units !== 0 ? cart.in_stock : true,
            quantity: 1,
            ...cart,
          });
        }
      });
      alert("item added to cart");
      return newCart;
    });
  }

  function removeFromCart(id) {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    localStorage.removeItem("cartItems");
  }

  const updateQuantity = (cart) => {
    if (cart >= 1 && cart <= item.item_units) {
      setCartItems(cart);
    }
  };

  function increaseCart(id) {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );

    products.map((prev) => {
      prev.id === id
        ? {
            ...prev,
            quantity: prev.quantity + 1,
          }
        : prev;
    });
    console.log(cartItems);
  }

  function decreaseCart(id) {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  const cartTotal = cartItems.reduce((sum, item) => {
    return sum + Number(item.price) * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartTotal,
        setCartItems,
        increaseCart,
        decreaseCart,
        removeFromCart,
        addToCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
