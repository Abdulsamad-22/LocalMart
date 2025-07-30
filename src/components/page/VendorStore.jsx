import ProductSpecification from "../store/ProductSpecification";
import StockupStore from "../store/StockupStore";

export default function VendorStore() {
  return (
    <>
      <div className="bg-[#009688] text-center text-[1.5rem] text-[#fff] p-8 mt-[5rem]">
        <h2>Stock up my store</h2>
      </div>
      <div className="w-full flex flex-col md:flex-row items-start gap-8 my-12 px-12">
        <StockupStore />
        <ProductSpecification />
      </div>
    </>
  );
}
