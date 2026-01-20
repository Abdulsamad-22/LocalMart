import { ShoppingCart, UserCircle, List, Heart } from "@phosphor-icons/react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthProvider";
import { useCart } from "../Context/CartProvider";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isVendor, checkSession, session, user, loadingVendor } = useAuth();
  const location = useLocation();
  const { cartItems } = useCart();

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
      label: loadingVendor
        ? "Loading..."
        : isVendor
          ? "View my store"
          : "Sell on LocalMart",
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
    setIsMenuOpen((prev) => !prev);
  };

  const handleVendorRedirection = async () => {
    const { isValid } = await checkSession();

    if (loadingVendor) return;

    if (isVendor && isValid) {
      navigate("/my-shop");
      return;
    }

    if (!isVendor && !isValid) {
      navigate("/signup", { state: { redirectTo: "/vendor-registration" } });
      return;
    }

    if (!isVendor && isValid) {
      navigate("/login", { state: { redirectTo: "/vendor-registration" } });
      return;
    }

    if (isVendor && !isValid) {
      navigate("/login", { state: { from: "/my-shop" } });
      return;
    }

    return navigate("/vendor-registration");
  };

  useEffect(() => {
    const verifySession = async () => {
      if (user) {
        const { isValid } = await checkSession();

        if (!isValid) {
          console.log("Session expired, logging out");
          await logout();
          navigate("/login", { replace: true });
        }
      }
    };
    verifySession();
  }, []);

  const handleSignupClick = () => {
    navigate("/signup", { state: { redirectTo: "/" } });
  };
  return (
    <nav className="w-full bg-[#fff] items-center fixed h-[10%] md:h-[11%] inset-0 shadow-lg shadow-gray-400/50 z-[4]">
      <div className="flex items-center justify-between py-4 md:py-6 px-4 md:px-12 relative">
        <Link
          to="/"
          className="text-[1.5rem] md:text-3xl text-[#009688] font-semibold"
        >
          LocalMart
        </Link>

        <div className="flex items-center gap-4 md:gap-6">
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
          <Link
            onClick={() => setIsMenuOpen(false)}
            className="flex md:hidden items-center justify-center gap-1 relative text-[1rem]
                    
                      text-[#009688] font-medium
                       text-[#636363]
                   hover:text-[#009688] cursor-pointer"
            to="/carts"
          >
            <span className="absolute -top-1 -right-1 py-0 px-[0.35rem] text-[8px] text-[#fff] rounded-full bg-[#009688]">
              {cartItems.length}
            </span>
            <ShoppingCart size={24} />
          </Link>
          <List
            onClick={toggleMenu}
            className="block md:hidden cursor-pointer"
            size={32}
          />
        </div>

        {/* Mobile Menu */}
        {
          <div
            onClick={(e) => e.stopPropagation()}
            className={`absolute top-[96%] left-0 w-full bg-[#fff] p-4 rounded-b-[10px] shadow-lg md:hidden transform transition-transform duration-300 ease-in-out 
    lg:hidden ${
      isMenuOpen ? "translate-x-0" : "translate-x-full"
    } transition-shadow ${
      isMenuOpen ? "shadow-[0_12px_32px_rgba(0,0,0,0.12)]" : "shadow-none"
    }`}
          >
            <div className="flex flex-col gap-2 items-start">
              <Link
                onClick={() => setIsMenuOpen(false)}
                to="/wishlist"
                className="w-full flex items-center gap-2 border-b-[1px] border-[#C0C0C0] text-[1rem] text-[#636363] py-2 cursor-pointer"
              >
                <Heart size={24} />
                Wishlists
              </Link>
              <button
                className="w-full flex gap-2 items-center border-b-[1px] border-[#C0C0C0] text-[1rem] text-[#636363] py-2"
                onClick={() => {
                  setIsMenuOpen(false);
                  handleSignupClick();
                }}
              >
                <UserCircle size={24} />
                Login / Sign up
              </button>
              <button
                className="w-full py-2 px-3 text-left text-[1rem] text-[#636363]"
                onClick={() => {
                  setIsMenuOpen(false);
                  handleVendorRedirection();
                }}
              >
                {loadingVendor
                  ? "Loading..."
                  : isVendor
                    ? "View my store"
                    : "Sell on LocalMart"}
              </button>
            </div>
          </div>
        }
      </div>
    </nav>
  );
}
