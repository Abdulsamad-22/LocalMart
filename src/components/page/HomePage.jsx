import Newsletter from "../newsletter/Newsletter";
import ProductsDisplay from "../productsPage/ProductsDisplay";
import Footer from "../Utils/footer/Footer";
import Header from "../Utils/Header";
import SearchQuery from "../Utils/SearchQuery";

export default function HomePage() {
  return (
    <>
      <Header />
      <SearchQuery />
      <ProductsDisplay />
      <Newsletter />
      <Footer />
    </>
  );
}
