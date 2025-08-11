import { ShoppingCart, UserCircle, List, Heart } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { useState } from "react";
export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  return (
    <header className="w-full bg-[#fff] fixed h-20 inset-0 shadow-lg shadow-gray-400/50 py-0 px-4 md:px-12 z-20">
      <div className="flex items-center justify-between py-6 relative">
        <Link
          to="/"
          className="text-[1.5rem] md:text-3xl text-[#009688] font-semibold"
        >
          LocalMart
        </Link>

        <div className="flex items-center gap-6">
          {/* Desktop Menu Items */}
          <Link
            to="/signup"
            className="hidden md:flex gap-1 items-center text-[1rem] text-[#636363]"
          >
            <UserCircle size={24} color="#636363" />
            Login / Sign up
          </Link>

          <div className="hidden md:flex items-center justify-center gap-1 text-[1rem] text-[#636363] cursor-pointer">
            <Heart size={20} />
            Wishlists
          </div>

          <Link
            to="/carts"
            className="flex items-center justify-center gap-1 text-[1rem] text-[#636363] cursor-pointer relative"
          >
            {/* <span className="absolute top-0 -left-2 py-0 px-[0.35rem] text-[0.625rem] text-[#fff] rounded-full bg-[#009688]">
              3
            </span> */}
            <ShoppingCart size={20} color="#636363" />
            Cart
          </Link>

          {/* Mobile Menu Toggle */}
          <List
            onClick={toggleMenu}
            className="block md:hidden cursor-pointer"
            size={24}
          />

          <Link
            className="hidden md:block py-2 px-3 rounded-lg border-[2px] border-[#636363] text-[0.875rem] text-[#636363] transition-transform duration-300 hover:border-transparent hover:bg-[#009688] hover:text-[#fff]"
            to="/registration"
          >
            Sell on LocalMart
          </Link>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute top-[96%] left-0 w-full bg-[#fff] p-4 rounded-b-[10px] shadow-lg md:hidden">
            <div className="flex flex-col items-start py-4">
              <div className="flex items-center justify-center gap-1 text-[1rem] text-[#636363] cursor-pointer">
                <Heart size={20} />
                Wishlists
              </div>
              <Link
                to="/signup"
                className="flex gap-1 items-center text-[0.875rem] text-[#636363] py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <UserCircle size={24} color="#636363" />
                Login / Sign up
              </Link>
              <Link
                to="/registration"
                className="py-2 px-3 text-[0.875rem] text-[#636363]"
                onClick={() => setIsMenuOpen(false)}
              >
                Sell on LocalMart
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
