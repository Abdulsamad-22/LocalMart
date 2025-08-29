import { createContext, useContext, useState } from "react";
const ProductContext = createContext();
export const useProduct = () => useContext(ProductContext);
export default function ProductProvider({ children }) {
  const [vendors, setVendors] = useState([]);
  const [products, setProducts] = useState([]);
  return (
    <ProductContext.Provider
      value={{ vendors, setVendors, products, setProducts }}
    >
      {children}
    </ProductContext.Provider>
  );
}
