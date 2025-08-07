import products from "../../../data/Products.json";
import { Plus, Minus, X } from "@phosphor-icons/react";
import { useCart } from "../Context/CartProvider";

const cartItem = products;
export default function CartItemSection() {
  const { cartItems, removeFromCart, increaseCart, decreaseCart } = useCart();
  return (
    <section className="bg-[#E3E3E3] p-8 w-full md:w-[70%] rounded-[10px]">
      <div className="">
        {cartItems.length <= 0 ? (
          <div className="text-center text-[1.25rem]">
            Your cart is currently empty
          </div>
        ) : (
          cartItems.slice(0, 3).map((cart, id) => (
            <div key={id} className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-4 items-center">
                  <div className="w-[145px] h-[119px]">
                    <img
                      className="w-full h-full rounded-[10px]"
                      src={cart.image}
                      alt=""
                    />
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-[1rem] md:text-[1rem]">{cart.name}</h2>
                    <div className="flex items-center text-[0.75rem] md:text-[0.875rem]">
                      <div className="h-4 md:h-6  w-4 md:w-6 bg-[#2979FF] text-[0.75rem] md:text-[0.875rem] rounded-full flex items-center justify-center mr-2">
                        A
                      </div>
                      {cart.vendors}
                    </div>
                    <p className="text-[0.75rem] md:text-[0.875rem] font-semibold">
                      ${cart.price}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-8">
                  <div className="flex items-center justify-between gap-6 text-center rounded-md">
                    <div
                      onClick={() => decreaseCart(cart.id)}
                      className="p-2 transition-transform duration-300 hover:bg-[#009688] hover:border-transparent border-2 border-[#c4c4c4] rounded-full cursor-pointer"
                    >
                      <Minus
                        size={20}
                        className="text-[#000] font-semibold  [&>svg]:hover:text-[#fff]"
                      />
                    </div>
                    <span className="text-[1.125rem] font-semibold">
                      {cart.quantity}
                    </span>
                    <div
                      onClick={() => increaseCart(cart.id)}
                      className="bg-[#000] transition-transform duration-300 hover:bg-[#009688] p-2 rounded-full cursor-pointer"
                    >
                      <Plus size={20} className="text-[#fff] font-semibold " />
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(cart.id)}
                    className="flex items-center gap-1 py-2 px-3 transition-transform duration-300 hover:bg-yellow-600 hover:border-transparent hover:text-[#fff] border-2 border-[#c4c4c4]"
                  >
                    <X size={20} /> Remove
                  </button>
                </div>
              </div>
              <hr className="border-[0.5px] border-[#c4c4c4] rounded-full" />
            </div>
          ))
        )}
      </div>
    </section>
  );
}
