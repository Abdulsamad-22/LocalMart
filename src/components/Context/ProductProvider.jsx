import { createContext, useContext, useState } from "react";
const ProductContext = createContext();
export const useProduct = () => useContext(ProductContext);
export default function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  return (
    <ProductContext.Provider
      value={{ products, setProducts, setEditingProduct, editingProduct }}
    >
      {children}
    </ProductContext.Provider>
  );
}
