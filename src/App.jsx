import { Routes, Route, BrowserRouter } from "react-router-dom";
import "./App.css";
import HomePage from "./components/page/HomePage";
import ProductsPage from "./components/page/ProductsPage";
import Layout, { MinimalLayout } from "./components/Layout";
import CartPage from "./components/page/CartPage";
import VendorRegistrationForm from "./components/verifyVendors/VendorRegistrationForm";
import VendorStore from "./components/page/VendorStore";
import Signup from "./components/forms/SIgnup";
import { useState } from "react";

function App() {
  const [vendorSubmitting, setVendorSubmitting] = useState(false);
  return (
    <BrowserRouter>
      <Routes>
        <Route
          element={
            <Layout
              setVendorSubmitting={setVendorSubmitting}
              vendorSubmitting={vendorSubmitting}
            />
          }
        >
          <Route path="/" element={<HomePage />} />
          <Route path="/products/:id" element={<ProductsPage />} />
          <Route path="/carts" element={<CartPage />} />
        </Route>

        <Route element={<MinimalLayout />}>
          <Route path="/vendorStore" element={<VendorStore />} />
        </Route>

        <Route
          path="/registration"
          element={
            <VendorRegistrationForm setVendorSubmitting={setVendorSubmitting} />
          }
        />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
