import { Route, Routes } from "react-router-dom";
import ProductsPage from "../components/page/ProductsPage";
import Layout, { MinimalLayout } from "../components/Layout";
import WishlistPage from "../components/page/WishlistPage";
import HomePage from "../components/page/HomePage";
import CartPage from "../components/page/CartPage";
import VendorStore from "../components/page/VendorStore";
import MyVendorShop from "../components/store/MyVendorShop";
import Login from "../components/forms/Login";
import Signup from "../components/forms/SIgnup";
import PublicVendorShop from "../components/store/PublicVendorShop";
import VendorRegistrationForm from "../components/verifyVendors/VendorRegistrationForm";
import { useState } from "react";
import CheckoutProvider from "../components/page/CheckoutPage";

const AppRoutes = () => {
  const [loading, setLoading] = useState(false);
  const [openOverlay, setOpenOverlay] = useState(false);
  return (
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
        <Route path="/checkout" element={<CheckoutProvider />} />
      </Route>

      <Route path="/vendor-registration" element={<VendorRegistrationForm />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};
export default AppRoutes;
