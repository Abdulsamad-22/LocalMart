import { Plus, Minus, X, CurrencyNgn } from "@phosphor-icons/react";
import { useCart } from "../Context/CartProvider";

export default function CartItemSection() {
  const { cartItems, removeFromCart, increaseCart, decreaseCart } = useCart();
  return (
    <section className="bg-[#fff] p-4 md:p-8 w-full md:w-[70%] rounded-[10px]">
      <div className="">
        {cartItems.length <= 0 ? (
          <div className="flex flex-col items-center justify-center text-center text-[#4B7874] text-[1.25rem]">
            <img
              src="/images/illustration-empty-cart.svg"
              alt="empty cart icon"
            />
            Your added items will appear here
          </div>
        ) : (
          cartItems.slice(0, 3).map((cart, id) => (
            <div key={id} className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-4 items-center">
                  <div className="w-[90px] md:w-[145px] h-[80px] md:h-[119px]">
                    <img
                      className="w-full h-full rounded-[10px]"
                      src={cart.image_url}
                      alt=""
                    />
                  </div>

                  <div className="space-y-1">
                    <h2 className="text-[0.875rem] md:text-[1rem] md:text-[1rem]">
                      {cart.item_name}
                    </h2>
                    <div className="flex items-center text-[0.75rem] md:text-[0.875rem]">
                      <div className="h-4 md:h-6  w-4 md:w-6 bg-[#2979FF] text-[0.75rem] md:text-[0.875rem] rounded-full flex items-center justify-center mr-2">
                        A
                      </div>
                      {cart.vendors}
                    </div>
                    <p className="flex items-center text-[0.75rem] md:text-[1rem] font-semibold">
                      <CurrencyNgn size={20} /> {cart.item_price}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-8">
                  <div className="flex items-center gap-4 md:gap-6 text-center rounded-md">
                    <div
                      onClick={() => decreaseCart(cart.id)}
                      className="bg-[#000] p-[0.35rem] md:p-2 transition-transform duration-300 hover:bg-[#009688] text-[#fff] font-semibold rounded-full cursor-pointer"
                    >
                      <Minus size={20} className="" />
                    </div>
                    <span className="text-0.875rem] md:text-[1.125rem] font-semibold">
                      {cart.quantity}
                    </span>
                    <div
                      onClick={() => increaseCart(cart.id)}
                      className="bg-[#000] transition-transform duration-300 hover:bg-[#009688] text-[#fff] font-semibold p-[0.35rem] md:p-2 rounded-full cursor-pointer"
                    >
                      <Plus size={20} className="" />
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(cart.id)}
                    className="flex items-center gap-1 py-1 md:py-2 px-1 md:px-3 text-[0.875rem] md:text-[0.875rem] transition-transform duration-300 hover:border-[#009688] hover:text-[#009688] border-[1px] border-[#c4c4c4] rounded-[4px]"
                  >
                    <X size={18} /> Remove
                  </button>
                </div>
              </div>
              <hr className="border-[0.5px] border-gray-100 rounded-full" />
            </div>
          ))
        )}
      </div>
    </section>
  );
}
