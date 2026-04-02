import { create } from "zustand";

const loadCart = () => {
  const saved = localStorage.getItem("cartItems");
  return saved ? JSON.parse(saved) : [];
};

const useCartStore = create(
  (set, get) => ({
    cartItems: loadCart(),
    checkoutItem: null,
    addToCart: (container) => {
      const { cartItems } = get();
      const newCart = [...cartItems];
      const itemsToAdd = Array.isArray(container) ? container : [container];

      itemsToAdd.forEach((cart) => {
        if (!cart || !cart.id) {
          console.warn("Invalid item passed to addToCart:", cart);
          return;
        }

        const existingIndex = newCart.findIndex(
          (item) => item.id.toString() === cart.id.toString(),
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
            console.warn("Invalid price for item", cart);
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
      set({ cartItems: newCart });
      alert("Item added to cart");
      return newCart;
    },
    removeFromCart: (id) => {
      set((state) => ({
        cartItems: state.cartItems.filter((item) => item.id !== id),
      }));
    },

    increaseCart: (id) => {
      set((state) => ({
        cartItems: state.cartItems.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
        ),
      }));
    },

    decreaseCart: (id) => {
      set((state) => ({
        cartItems: state.cartItems
          .map((item) =>
            item.id === id ? { ...item, quantity: item.quantity - 1 } : item,
          )
          .filter((item) => item.quantity > 0),
      }));
    },

    setCheckoutItem: (item) => set({ checkoutItem: item }),

    setCartItems: (items) => set({ cartItems: items }),

    cartTotal: () => {
      get().cartItems.reduce((sum, item) => {
        return sum + Number(item.price) * item.quantity;
      }, 0);
    },
  }),
  {
    name: "cartItems",
  },
);

console.log("cartStore module loaded", Math.random());

useCartStore.subscribe((state) => {
  localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
});

export default useCartStore;
