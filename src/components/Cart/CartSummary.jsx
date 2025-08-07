import { useCart } from "../Context/CartProvider";

export default function CartSummary() {
  const { cartTotal } = useCart();
  return (
    <div className="bg-[#fff] w-full md:w-[30%] p-4 rounded-md">
      <h2 className="text-[1rem] md:text-[1.25rem]">Order Summary</h2>
      <div className="flex items-center justify-between mt-6">
        <span className="text-[0.875rem]">Order Total</span>
        <span className="text-[1rem] md:text-[1.25rem]">
          ₦ {cartTotal.toLocaleString("en-NG")}
        </span>
      </div>
      <button className="w-full px-5 py-3 bg-gradient-to-r from-[#009688] to-[#00695C] text-[#fff] item-center rounded-lg mt-12">
        Checkout
      </button>
    </div>
  );
}
