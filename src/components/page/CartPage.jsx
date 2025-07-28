import CartItemSection from "../Cart/CartItemSection";
import CartSummary from "../Cart/CartSummary";

export default function CartPage() {
  return (
    <>
      <button className="px-4 py-2 border-2 border-[#005349] text-[#005349] transition-transform duration-500 hover:border-transparent hover:text-[#fff] hover:bg-[#009688]">
        {`<`}Continue Shopping
      </button>

      <div className="flex flex-col md:flex-row items-center md:items-start gap-[1rem] mt-4">
        <CartItemSection />
        <CartSummary />
      </div>
    </>
  );
}
