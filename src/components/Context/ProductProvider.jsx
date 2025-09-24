import { createContext, useContext, useState } from "react";
const ProductContext = createContext();
export const useProduct = () => useContext(ProductContext);
export default function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  return (
    <ProductContext.Provider value={{ products, setProducts }}>
      {children}
    </ProductContext.Provider>
  );
}
