import Newsletter from "../newsletter/Newsletter";
import ProductsDisplay from "../AllProducts/ProductsDisplay";
import VendorList from "../deliveryTime/VendorList";

export default function HomePage({ results, loading }) {
  return (
    <>
      <VendorList />
      <ProductsDisplay results={results} loading={loading} />
      <Newsletter />
    </>
  );
}
