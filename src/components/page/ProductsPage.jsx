import DeliveryOptions from "../AboutProducts/DeliveryOptions";
import OverviewHeader from "../AboutProducts/OverViewHeader";
import ProductsCard from "../AboutProducts/ProductsCard";
import ProductsDisplay from "../AllProducts/ProductsDisplay";
import products from "../../../data/Products.json";
import { useParams } from "react-router-dom";

export default function ProductsPage() {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
  if (!product) return <p>Product not found</p>;
  return (
    <>
      <div className="flex flex-col md:flex-row gap-20 items-start mb-12">
        <ProductsCard product={product} />
        <DeliveryOptions />
      </div>

      <OverviewHeader />
      <ProductsDisplay limit={4} />
    </>
  );
}
