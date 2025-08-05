import { Link } from "react-router-dom";
import CartItemSection from "../Cart/CartItemSection";
import CartSummary from "../Cart/CartSummary";
import { CaretLeft } from "@phosphor-icons/react";

export default function CartPage() {
  return (
    <>
      <Link
        to="/"
        className="w-[16%] flex items-center gap-1 px-4 py-2 border-2 border-[#005349] text-[#005349] transition-transform duration-500 hover:border-transparent hover:text-[#fff] hover:bg-[#009688]"
      >
        <CaretLeft size={24} />
        Continue Shopping
      </Link>

      <div className="flex flex-col md:flex-row items-center md:items-start gap-[1rem] mt-4">
        <CartItemSection />
        <CartSummary />
      </div>
    </>
  );
}
