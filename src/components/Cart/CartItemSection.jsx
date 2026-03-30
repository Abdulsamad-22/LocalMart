import {
  Plus,
  Minus,
  Shield,
  CurrencyNgn,
  Truck,
  Heart,
  Trash,
} from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import CartSummary from "./CartSummary";
import useCartStore from "../../state-store/cartStore";
import useWishlistStore from "../../state-store/wishlistStore";

export default function CartItemSection() {
  const cartItems = useCartStore((state) => state.cartItems);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const increaseCart = useCartStore((state) => state.increaseCart);
  const decreaseCart = useCartStore((state) => state.decreaseCart);
  const addToWishlist = useWishlistStore((state) => state.addToWishlist);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-[1.125rem] md:text-2xl font-semibold text-gray-900">
                Shopping Cart
              </h1>
              <p className="text-[0.75rem] md:text-[1rem] text-gray-600 mt-[2px] md:mt-1">
                {cartItems.length} item{cartItems.length !== 1 ? "s" : ""} in
                your cart
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#009688]">
              <Shield size={16} />
              <span>Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>

      <div className="">
        {cartItems.length === 0 ? (
          /* Empty Cart */
          <div className="bg-white shadow-sm p-12 text-center">
            {/* <ShoppingCart size={64} className="text-gray-300 mx-auto" /> */}
            <img
              className="mx-auto"
              src="/images/illustration-empty-cart.svg"
              alt="empty cart"
            />
            <h2 className="text-[1rem] text-xl font-semibold text-gray-900 mb-[1px]">
              Your cart is empty
            </h2>
            <p className="text-[0.875rem] md:text-[1rem] text-gray-600 mb-6">
              Add some products to get started
            </p>
            <Link
              to="/"
              className="bg-gradient-to-r from-[#009688] to-[#00695C] transition-all duration-200
    hover:from-[#00897B] hover:to-[#005B4F] text-[#fff] px-6 py-[0.75rem] rounded-lg transition-colors"
            >
              Add to your cart
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="md:bg-white rmd:ounded-lg md:shadow-sm">
                {/* Cart Header */}
                <div className="px-4 md:px-6 py-4 border-b border-gray-200">
                  <h2 className="text-[1rem] md:text-lg font-semibold text-gray-900">
                    Cart Items
                  </h2>
                </div>

                {/* Cart Items List */}
                <div>
                  {cartItems.map((item, index) => (
                    <div key={item.id}>
                      <div className="px-0 md:px-6 py-4 md:py-6">
                        <div className="flex gap-4">
                          {/* Product Image */}

                          <div className="flex-shrink-0">
                            <img
                              src={item.image_url}
                              alt={item.item_name}
                              className="w-[7rem] sm:w-28 h-[6rem] sm:h-24 object-cover rounded-lg"
                            />
                          </div>

                          {/* Product Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 md:gap-4">
                              <div className="flex-1">
                                <h3 className="text-[0.875rem] md:text-base md:font-medium text-gray-900 mb-0 md:mb-2 line-clamp-2">
                                  {item.item_name}
                                </h3>

                                {/* Stock Status & Shipping */}
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-[0.75rem] md:text-[0.875rem] md-0 md:mb-3">
                                  <div className="flex items-center gap-2">
                                    <span
                                      className={`inline-block w-2 h-2 rounded-full ${
                                        item.item_units > 0
                                          ? "bg-green-500"
                                          : "bg-red-500"
                                      }`}
                                    ></span>
                                    <span
                                      className={`text-sm font-medium ${
                                        item.item_units > 0
                                          ? "text-green-600"
                                          : "text-red-600"
                                      }`}
                                    >
                                      {item.item_units > 0
                                        ? "In Stock"
                                        : "Out of Stock"}
                                    </span>
                                  </div>
                                  {item.item_units > 0 && (
                                    <div className="hidden md:flex items-center gap-1 text-sm text-gray-600">
                                      <Truck size={14} />
                                      <span>Delivery is in 3-5 days</span>
                                    </div>
                                  )}
                                </div>

                                {/* Action Buttons */}
                                <div className="hidden md:flex items-center gap-4 text-sm">
                                  <button
                                    onClick={() =>
                                      addToWishlist({
                                        ...item,
                                        id: item.id.toString(),
                                      })
                                    }
                                    className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors"
                                  >
                                    <Heart size={14} />
                                    Save for later
                                  </button>
                                  <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="flex items-center gap-1 text-gray-600 hover:text-red-600 text-[0.875rem] md:text-[1rem] transition-colors"
                                  >
                                    <Trash className="text-[1rem] md:text-[0.875rem]" />
                                    Remove
                                  </button>
                                </div>
                              </div>

                              {/* Price & Quantity */}
                              <div className="flex flex-col sm:items-end gap-4 sm:min-w-[180px]">
                                {/* Price */}
                                <div className="text-right">
                                  <div className="hidden md:flex items-center text-[1.125rem] font-semibold text-gray-900">
                                    <CurrencyNgn size={20} />
                                    {Number(
                                      item.price * item.quantity,
                                    ).toLocaleString("en-NG")}
                                  </div>
                                  <div className="flex items-center text-[0.875rem] md:text-sm text-gray-800 mt-1">
                                    <CurrencyNgn />
                                    {Number(item.price).toLocaleString(
                                      "en-NG",
                                    )}{" "}
                                    each
                                  </div>
                                </div>

                                {/* Quantity Controls */}
                                <div className="hidden md:flex items-center gap-3">
                                  <span className="text-sm font-medium text-gray-700">
                                    Qty:
                                  </span>
                                  <div className="flex items-center">
                                    <button
                                      onClick={() => decreaseCart(item.id)}
                                      disabled={item.quantity <= 1}
                                      className="border border-gray-300 p-[0.5rem] md:p-3 transition-transform duration-300 hover:bg-[#009688] hover:text-white font-semibold rounded-full disabled:cursor-not-allowed transition-colors"
                                    >
                                      <Minus size={16} />
                                    </button>
                                    <span className="px-4 py-2 min-w-[60px] text-center font-medium">
                                      {item.quantity}
                                    </span>
                                    <button
                                      onClick={() => increaseCart(item.id)}
                                      disabled={
                                        item.quantity >= item.item_units
                                      }
                                      className="border border-gray-300 p-[0.5rem] md:p-3 transition-transform duration-300 hover:bg-[#009688] hover:text-white font-semibold rounded-full disabled:cursor-not-allowed transition-colors"
                                    >
                                      <Plus size={16} />
                                    </button>
                                  </div>
                                </div>

                                {item.quantity >= item.item_units && (
                                  <div className="text-xs text-orange-600 text-right">
                                    Max quantity: {item.item_units}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex md:hidden justify-between mb-2">
                        <div className="flex md:hidden items-center gap-[2px]">
                          {/* <span className="text-sm font-medium text-gray-700">
                                Qty:
                              </span> */}
                          <div className="flex items-center">
                            <button
                              onClick={() => decreaseCart(item.id)}
                              disabled={item.quantity <= 1}
                              className="border border-gray-300 p-2 transition-transform duration-300 hover:bg-[#009688] hover:text-white font-semibold rounded-full disabled:cursor-not-allowed transition-colors"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="px-4 py-2 min-w-[40px] text-center font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => increaseCart(item.id)}
                              disabled={item.quantity >= item.item_units}
                              className="border border-gray-300 p-2 transition-transform duration-300 hover:bg-[#009688] hover:text-white font-semibold rounded-full disabled:cursor-not-allowed transition-colors"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="flex items-center gap-1 text-[0.975rem] text-gray-600 hover:text-red-600 transition-colors"
                        >
                          <Trash size={14} />
                          Remove
                        </button>
                      </div>

                      {/* Separator line */}
                      {index < cartItems.length - 1 && (
                        <div className="border-b border-gray-200"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <CartSummary />
          </div>
        )}
      </div>
    </div>
  );
}
