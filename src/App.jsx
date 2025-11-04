import { Routes, Route, BrowserRouter } from "react-router-dom";
import "./App.css";
import HomePage from "./components/page/HomePage";
import ProductsPage from "./components/page/ProductsPage";
import Layout, { MinimalLayout } from "./components/Layout";
import CartPage from "./components/page/CartPage";
import VendorRegistrationForm from "./components/verifyVendors/VendorRegistrationForm";
import VendorStore from "./components/page/VendorStore";
import PublicVendorShop from "./components/store/PublicVendorShop";
import Signup from "./components/forms/SIgnup";
import WishlistPage from "./components/page/WishlistPage";
import { useState } from "react";
import MyVendorShop from "./components/store/MyVendorShop";
import Login from "./components/forms/Login";
import CheckoutPage from "./components/page/CheckoutPage";

function App() {
  const [loading, setLoading] = useState(false);
  const [openOverlay, setOpenOverlay] = useState(false);
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout setLoading={setLoading} />}>
          <Route path="/" element={<HomePage loading={loading} />} />
          <Route path="/products/:id" element={<ProductsPage />} />
          <Route path="/carts" element={<CartPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
        </Route>

        <Route
          element={
            <MinimalLayout
              openOverlay={openOverlay}
              setOpenOverlay={setOpenOverlay}
            />
          }
        >
          <Route path="/add-product" element={<VendorStore />} />
          <Route
            path="/my-shop"
            element={
              <MyVendorShop
                setOpenOverlay={setOpenOverlay}
                openOverlay={openOverlay}
              />
            }
          />
          <Route path="/vendor/:id" element={<PublicVendorShop />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Route>

        <Route
          path="/vendor-registration"
          element={<VendorRegistrationForm />}
        />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
