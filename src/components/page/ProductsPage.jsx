import ProductsCard from "../AboutProducts/ProductsCard";
import { useParams } from "react-router-dom";
import { useProduct } from "../Context/ProductProvider";
import { useVendorLocation } from "../Context/deliveryTime/VendorLocationProvider";

export default function ProductsPage() {
  const { id } = useParams();
  const { products } = useProduct();
  const { vendors } = useVendorLocation();
  const product = products.find((p) => p.id.toString() === id);
  console.log(vendors);
  const productWithInfo = vendors.find((v) => v.id === product.vendor_id);
  console.log(productWithInfo);
  if (!product) return <p>Product not found</p>;
  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 items-start mb-12">
        <ProductsCard product={product} vendorInfo={productWithInfo} />
      </div>
    </>
  );
}
