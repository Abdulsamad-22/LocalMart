import { BrowserRouter } from "react-router-dom";
import "./App.css";

import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./components/Context/AuthProvider";
import CartProvider from "./components/Context/CartProvider";
import WishlistProvider from "./components/Context/WishlistProvider";
import VendorLocationProvider from "./components/Context/deliveryTime/VendorLocationProvider";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <VendorLocationProvider>
          <CartProvider>
            <WishlistProvider>
              <AppRoutes />
            </WishlistProvider>
          </CartProvider>
        </VendorLocationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
