import { ShoppingCart, UserCircle } from "@phosphor-icons/react";
export default function Header() {
  return (
    <header className="w-full bg-[#fff] fixed h-20 inset-0 shadow-lg shadow-gray-400/50 py-0 px-12 z-20">
      <div className="flex items-center justify-between py-6">
        <div className="text-3xl text-[#009688] font-semibold">LocalMart</div>

        <div className="flex items-center gap-6">
          <div className="flex gap-1 items-center text-[1.125rem] text-[#636363] cursor-pointer">
            <UserCircle size={28} color="#636363" />
            Login / Sign up
          </div>

          <div className="flex items-center justify-center gap-1 text-[1.125rem] text-[#636363] cursor-pointer">
            <ShoppingCart size={24} color="#636363" />
            Cart
          </div>
          <button className="py-2 px-3 rounded-lg border-[2px] border-[#636363] text-[#636363] transition-transform duration-300 hover:border-transparent hover:bg-[#009688] hover:text-[#fff]">
            Sell on LocalMart
          </button>

          {/* <div className="py-2 px-3 rounded-lg border-2 border-[#636363]">
            Sign up/Login
          </div> */}
        </div>
      </div>
    </header>
  );
}
