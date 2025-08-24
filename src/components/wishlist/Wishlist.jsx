import { Plus, Minus, X, CurrencyNgn } from "@phosphor-icons/react";
import { useWishlist } from "../Context/WishlistProvider";
import { useCart } from "../Context/CartProvider";

export default function Wishlist() {
  const {
    increaseCart,
    decreaseCart,
    wishlistItems,
    removeFromWishlist,
    clearAllWishlist,
    addAllToCart,
  } = useWishlist();
  const { handleAddToCart, cartItems } = useCart();

  return (
    <div>
      <h2 className="text-[1.25rem] font-semibold text-gray-800 mb-4">
        Wishlist
      </h2>

      <div className="">
        {wishlistItems.map((item) => (
          <div className="flex items-center justify-between">
            <div className="flex gap-4 items-center">
              <div className="w-[90px] md:w-[145px] h-[80px] md:h-[119px] rounded-md">
                <img className="rounded-md" src={item.image} alt="" />
              </div>
              <div className="space-y-2">
                <h3>{item.name}</h3>
                <div className="flex items-center text-[0.75rem] md:text-[0.875rem]">
                  <div className="h-4 md:h-6  w-4 md:w-6 bg-[#2979FF] text-[0.75rem] md:text-[0.875rem] rounded-full flex items-center justify-center mr-2">
                    A
                  </div>
                  {item.vendors}
                </div>
              </div>
            </div>
            <div className="flex items-center text-[1.5rem] md:text-[1rem] text-gray-900 font-semibold">
              <CurrencyNgn size={20} />
              {item.price.toLocaleString("en-NG")}
            </div>

            <div className="flex flex-col items-end gap-8">
              <div className="flex items-center gap-4 md:gap-6 text-center rounded-md">
                <div
                  onClick={() => decreaseCart(item.id)}
                  className="bg-[#000] p-[0.35rem] md:p-2 transition-transform duration-300 hover:bg-[#009688] text-[#fff] font-semibold rounded-full cursor-pointer"
                >
                  <Minus size={20} />
                </div>
                <span className="text-0.875rem] md:text-[1.125rem] font-semibold">
                  {item.quantity}
                </span>
                <div
                  onClick={() => increaseCart(item.id)}
                  className="bg-[#000] transition-transform duration-300 hover:bg-[#009688] text-[#fff] font-semibold p-[0.35rem] md:p-2 rounded-full cursor-pointer"
                >
                  <Plus size={20} />
                </div>
              </div>
            </div>
            <button
              onClick={() => handleAddToCart({ ...item, id: item.id })}
              className="bg-[#009688] text-[#fff] px-4 py-2"
            >
              Add to cart
            </button>

            <button
              onClick={() => removeFromWishlist(item.id)}
              className="flex items-center gap-1 py-1 md:py-2 px-1 md:px-3 text-[0.875rem] md:text-[0.875rem] transition-transform duration-300 hover:border-[#009688] hover:text-[#009688] border-[1px] border-[#c4c4c4] rounded-[4px]"
            >
              <X size={18} /> Remove
            </button>
          </div>
        ))}
        <div className="text-right space-x-4 mt-6">
          <button
            onClick={() => clearAllWishlist()}
            className="text-[#009688] underline"
          >
            Clear Wishlist
          </button>
          <button
            onClick={() => addAllToCart({ ...cartItems, wishlistItems })}
            className="bg-[#009688] text-[#fff] px-4 py-2"
          >
            Add all to cart
          </button>
        </div>
      </div>
    </div>
  );
}
