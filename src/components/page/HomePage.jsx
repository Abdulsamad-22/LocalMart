import Newsletter from "../newsletter/Newsletter";
import ProductsDisplay from "../AllProducts/ProductsDisplay";

export default function HomePage({ loading }) {
  return (
    <>
      <ProductsDisplay loading={loading} />
      <Newsletter />
    </>
  );
}
