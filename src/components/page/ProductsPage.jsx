import ProductsCard from "../AboutProducts/ProductsCard";
import { useParams } from "react-router-dom";
import { useProduct } from "../Context/ProductProvider";

export default function ProductsPage() {
  const { id } = useParams();
  const { products } = useProduct();
  const product = products.find((p) => p.id.toString() === id);
  if (!product) return <p>Product not found</p>;
  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 items-start mb-12">
        <ProductsCard product={product} />
      </div>
    </>
  );
}
