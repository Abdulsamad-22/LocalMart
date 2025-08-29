import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import CartProvider from "./components/Context/CartProvider.jsx";
import WishlistProvider from "./components/Context/WishlistProvider.jsx";
import ProductProvider from "./components/Context/ProductProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ProductProvider>
      <CartProvider>
        <WishlistProvider>
          <App />
        </WishlistProvider>
      </CartProvider>
    </ProductProvider>
  </StrictMode>
);
