import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import CartProvider from "./components/Context/CartProvider.jsx";
import WishlistProvider from "./components/Context/WishlistProvider.jsx";
import ProductProvider from "./components/Context/ProductProvider.jsx";
import { AuthProvider } from "./components/Context/AuthProvider.jsx";
import VendorLocationProvider from "./components/Context/deliveryTime/VendorLocationProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <VendorLocationProvider>
        <ProductProvider>
          <CartProvider>
            <WishlistProvider>
              <App />
            </WishlistProvider>
          </CartProvider>
        </ProductProvider>
      </VendorLocationProvider>
    </AuthProvider>
  </StrictMode>
);
