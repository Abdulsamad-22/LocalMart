import Checkout from "../checkout/Checkout";
import CheckoutSummary from "../checkout/CheckoutSummary";

export default function CheckoutPage() {
  return (
    <section>
      <div className="bg-[#009688] text-[1.75rem] text-[#fff] text-center font-semibold p-8 mt-[5rem]">
        <h2 className="">Checkout</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-[60%_38%] gap-12 px-4 md:px-12 my-4 md:my-8">
        {/* <div className="flex justify-between gap-12"> */}
        <Checkout />
        <CheckoutSummary />
      </div>
    </section>
  );
}
