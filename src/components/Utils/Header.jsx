import { ShoppingCart } from "@phosphor-icons/react";
export default function Header() {
  return (
    <header className="w-full bg-[#fff] fixed h-20 inset-0 shadow-lg shadow-gray-400/50 py-0 px-12 z-20">
      <div className="flex items-center justify-between py-6">
        <div className="text-3xl text-[#009688] font-semibold">LocalMart</div>

        <div className="flex items-center gap-4">
          <div className="py-2 px-3 rounded-lg border-2 border-[#636363]">
            Sell on LocalMart
          </div>

          <div className="w-8 h-8 rounded-full border-2 border-[#000]"></div>

          <div className="flex items-center justify-center gap-2 text-[1.125rem] text-[#636363] font-semibold">
            <ShoppingCart size={24} weight="bold" color="#636363" />
            Cart
          </div>
        </div>
      </div>
    </header>
  );
}
