import { Routes, Route, BrowserRouter } from "react-router-dom";
import "./App.css";
import HomePage from "./components/page/HomePage";
import ProductsPage from "./components/page/ProductsPage";
import Layout from "./components/Layout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
