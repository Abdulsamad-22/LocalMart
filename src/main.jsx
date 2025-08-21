import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import CartProvider from "./components/Context/CartProvider.jsx";
import WishlistProvider from "./components/Context/WishlistProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CartProvider>
      <WishlistProvider>
        <App />
      </WishlistProvider>
    </CartProvider>
  </StrictMode>
);
