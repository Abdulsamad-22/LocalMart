import { ShoppingCart, UserCircle, List, Heart } from "@phosphor-icons/react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthProvider";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isVendor } = useAuth();
  const location = useLocation();

  const navLinks = [
    {
      icon: <UserCircle size={20} />,
      label: "Login/Sign up",
      onClick: () => handleSignupClick(),
    },
    { icon: <Heart size={20} />, label: "Wishlists", redirectTo: "/wishlist" },
    { icon: <ShoppingCart size={20} />, label: "Cart", redirectTo: "/carts" },
    {
      icon: "",
      label: !isVendor ? "Sell on LocalMart" : "View my store",
      onClick: () => handleVendorRedirection(),
      isButton: true,
    },
  ];

  const [active, setActive] = useState(() => {
    const idx = navLinks.findIndex((l) => l.redirectTo === location.pathname);
    return idx === -1 ? null : idx;
  });

  useEffect(() => {
    const idx = navLinks.findIndex((l) => l.redirectTo === location.pathname);
    setActive(idx === -1 ? null : idx);
  }, [location.pathname]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleVendorRedirection = () => {
    if (isVendor) {
      navigate("/my-shop");
      return;
    }

    if (!isVendor) {
      navigate("/signup", { state: { redirectTo: "/vendor-registration" } });
      return;
    }

    return navigate("/vendor-registration");
  };

  const handleSignupClick = () => {
    navigate("/signup", { state: { redirectTo: "/" } });
  };
  return (
    <header className="w-full bg-[#fff] fixed h-20 inset-0 shadow-lg shadow-gray-400/50 py-0 px-4 md:px-12 z-20">
      <nav className="flex items-center justify-between py-6 relative">
        <Link
          to="/"
          className="text-[1.5rem] md:text-3xl text-[#009688] font-semibold"
        >
          LocalMart
        </Link>

        <div className="flex items-center gap-6">
          {navLinks.map((link, index) => {
            const isActive = index === active;
            const base = `hidden md:flex items-center gap-1 text-[1rem] ${
              isActive ? "text-[#009688] font-medium" : "text-[#636363]"
            } hover:text-[#009688] cursor-pointer`;
            if (link.redirectTo) {
              return (
                <Link
                  key={index}
                  onClick={() => setActive(index)}
                  className={`hidden md:flex items-center justify-center gap-1 text-[1rem] ${
                    base +
                    (link.isButton
                      ? "text-[#009688] font-medium"
                      : "text-[#636363]")
                  } hover:text-[#009688] cursor-pointer`}
                  to={link.redirectTo}
                >
                  {" "}
                  {link.icon} {link.label}
                </Link>
              );
            }

            return (
              <button
                key={index}
                onClick={() => {
                  setActive(index); // set active first
                  if (link.label.includes("View")) handleVendorRedirection();
                  else if (link.label.includes("Login"))
                    navigate("/signup", { state: { redirectTo: "/" } });
                }}
                className={`${
                  base +
                  (link.isButton
                    ? "md:block py-2 px-3 rounded-lg border-[1px] border-gray-500 hover:border-[#009688] "
                    : "")
                }`}
              >
                {link.icon} {link.label}
              </button>
            );
          })}
          {/* Desktop Menu Items */}
          {/* <button
            onClick={handleSignupClick}
            className="hidden md:flex gap-1 items-center text-[1rem] text-[#636363] hover:text-[#009688]"
          >
            <UserCircle size={24} />
            Login / Sign up
          </button>

          <Link
            to="/wishlist"
            className="hidden md:flex items-center justify-center gap-1 text-[1rem] text-[#636363] hover:text-[#009688] cursor-pointer"
          >
            <Heart size={20} />
            Wishlists
          </Link>

          <Link
            to="/carts"
            className="flex items-center justify-center gap-1 text-[1rem] text-[#636363] hover:text-[#009688] cursor-pointer relative"
          > */}
          {/* <span className="absolute top-0 -left-2 py-0 px-[0.35rem] text-[0.625rem] text-[#fff] rounded-full bg-[#009688]">
              3
            </span> */}
          {/* <ShoppingCart size={20} />
            Cart
          </Link> */}

          {/* Mobile Menu Toggle */}
          {/* <List
            onClick={toggleMenu}
            className="block md:hidden cursor-pointer"
            size={24}
          />

          <button
            onClick={handleVendorRedirection}
            className="hidden md:block py-2 px-3 rounded-lg border-[1px] border-gray-500 text-[0.875rem] text-[#636363] transition-transform duration-300 hover:border-[#009688] hover:text-[#009688]"
          >
            {!isVendor ? "Sell on LocalMart" : "View my store"}
          </button> */}
          <List
            onClick={toggleMenu}
            className="block md:hidden cursor-pointer"
            size={24}
          />
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute top-[96%] left-0 w-full bg-[#fff] p-4 rounded-b-[10px] shadow-lg md:hidden">
            <div className="flex flex-col items-start py-4">
              <Link
                to="/wishlist"
                className="flex items-center justify-center gap-1 text-[1rem] text-[#636363] cursor-pointer"
              >
                <Heart size={20} />
                Wishlists
              </Link>
              <button
                className="flex gap-1 items-center text-[0.875rem] text-[#636363] py-2"
                onClick={() => {
                  setIsMenuOpen(false);
                  handleSignupClick();
                }}
              >
                <UserCircle size={24} />
                Login / Sign up
              </button>
              <button
                className="py-2 px-3 text-[0.875rem] text-[#636363]"
                onClick={() => {
                  setIsMenuOpen(false);
                  handleVendorRedirection();
                }}
              >
                {!isVendor ? "Sell on LocalMart" : "My store"}
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
