import Newsletter from "../newsletter/Newsletter";
import ProductsDisplay from "../AllProducts/ProductsDisplay";
import VendorList from "../deliveryTime/VendorList";

export default function HomePage({ loading }) {
  return (
    <>
      <VendorList />
      <ProductsDisplay loading={loading} />
      <Newsletter />
    </>
  );
}
