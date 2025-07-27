import DeliveryOptions from "../AboutProducts/DeliveryOptions";
import OverviewHeader from "../AboutProducts/OverViewHeader";
import Products from "../AboutProducts/Products";
import ProductsDisplay from "../AllProducts/ProductsDisplay";
import Footer from "../Utils/footer/Footer";
import Header from "../Utils/Header";
import SearchQuery from "../Utils/SearchQuery";

export default function ProductsPage() {
  return (
    <>
      <div className="flex flex-col md:flex-row gap-20 items-start my-12 px-12">
        <Products />
        <DeliveryOptions />
      </div>

      <OverviewHeader />
      <ProductsDisplay limit={4} />
    </>
  );
}
