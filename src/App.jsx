import { BrowserRouter } from "react-router-dom";
import "./App.css";

import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./components/Context/AuthProvider";
import CartProvider from "./components/Context/CartProvider";
import WishlistProvider from "./components/Context/WishlistProvider";
import VendorLocationProvider from "./components/Context/deliveryTime/VendorLocationProvider";
import ProductProvider from "./components/Context/ProductProvider";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <VendorLocationProvider>
          <ProductProvider>
            <CartProvider>
              <WishlistProvider>
                <AppRoutes />
              </WishlistProvider>
            </CartProvider>
          </ProductProvider>
        </VendorLocationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
