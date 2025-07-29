import { Routes, Route, BrowserRouter } from "react-router-dom";
import "./App.css";
import HomePage from "./components/page/HomePage";
import ProductsPage from "./components/page/ProductsPage";
import Layout from "./components/Layout";
import CartPage from "./components/page/CartPage";
import VendorRegistrationForm from "./components/verifyVendors/VendorRegistrationForm";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/carts" element={<CartPage />} />
        </Route>

        <Route path="/registration" element={<VendorRegistrationForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
