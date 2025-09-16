import {
  Plus,
  Minus,
  X,
  ArrowRight,
  Shield,
  CurrencyNgn,
  ShoppingCart,
  Truck,
  Heart,
  Trash,
} from "@phosphor-icons/react";
import { useCart } from "../Context/CartProvider";
import { useWishlist } from "../Context/WishlistProvider";

export default function CartItemSection() {
  const { cartItems, removeFromCart, increaseCart, decreaseCart } = useCart();
  const { addToWishlist } = useWishlist();

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );
  const savings = cartItems.reduce(
    (sum, item) => sum + (item.originalPrice - item.price) * item.quantity,
    0
  );
  const deliveryCost = 15.99; // Free delivery over Ngn 50000
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + (subtotal < 50000 ? deliveryCost : 0) + tax;
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Shopping Cart
              </h1>
              <p className="text-gray-600 mt-1">
                {cartItems.length} item{cartItems.length !== 1 ? "s" : ""} in
                your cart
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
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
            <ShoppingCart size={64} className="text-gray-300 mx-auto" />
            <h2 className="text-xl font-semibold text-gray-900 mb-[1px]">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-6">
              Add some products to get started
            </p>
            <button
              className="bg-gradient-to-r from-[#009688] to-[#00695C] transition-all duration-200
    hover:from-[#00897B] hover:to-[#005B4F] text-[#fff] px-6 py-[0.75rem] rounded-lg font-medium transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm">
                {/* Cart Header */}
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Cart Items
                  </h2>
                </div>

                {/* Cart Items List */}
                <div>
                  {cartItems.map((item, index) => (
                    <div key={item.id}>
                      <div className="px-6 py-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                          {/* Product Image */}
                          <div className="flex-shrink-0">
                            <img
                              src={item.image_url}
                              alt={item.item_name}
                              className="w-full sm:w-24 h-32 sm:h-24 object-cover rounded-lg"
                            />
                          </div>

                          {/* Product Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                              <div className="flex-1">
                                <h3 className="text-base font-medium text-gray-900 mb-2 line-clamp-2">
                                  {item.item_name}
                                </h3>

                                {/* Stock Status & Shipping */}
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
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
                                    <div className="flex items-center gap-1 text-sm text-gray-600">
                                      <Truck size={14} />
                                      <span>Delivery is in 3-5 days</span>
                                    </div>
                                  )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-4 text-sm">
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
                                    className="flex items-center gap-1 text-gray-600 hover:text-red-600 transition-colors"
                                  >
                                    <Trash size={14} />
                                    Remove
                                  </button>
                                </div>
                              </div>

                              {/* Price & Quantity */}
                              <div className="flex flex-col sm:items-end gap-4 sm:min-w-[180px]">
                                {/* Price */}
                                <div className="text-right">
                                  <div className="flex items-center text-[1.125rem] font-semibold text-gray-900">
                                    <CurrencyNgn />
                                    {Number(
                                      item.price * item.quantity
                                    ).toLocaleString("en-NG")}
                                  </div>
                                  <div className="flex items-center text-sm text-gray-600 mt-1">
                                    <CurrencyNgn />
                                    {Number(item.price).toLocaleString(
                                      "en-NG"
                                    )}{" "}
                                    each
                                  </div>
                                </div>

                                {/* Quantity Controls */}
                                <div className="flex items-center gap-3">
                                  <span className="text-sm font-medium text-gray-700">
                                    Qty:
                                  </span>
                                  <div className="flex items-center">
                                    <button
                                      onClick={() => decreaseCart(item.id)}
                                      disabled={item.quantity <= 1}
                                      className="bg-[#000] p-[0.35rem] md:p-2 transition-transform duration-300 hover:bg-[#009688] text-[#fff] font-semibold rounded-full disabled:cursor-not-allowed transition-colors"
                                    >
                                      <Minus size={14} />
                                    </button>
                                    <span className="px-4 py-2 min-w-[60px] text-center font-medium">
                                      {item.quantity}
                                    </span>
                                    <button
                                      onClick={() => increaseCart(item.id)}
                                      disabled={
                                        item.quantity >= item.item_units
                                      }
                                      className="bg-[#000] p-[0.35rem] md:p-2 transition-transform duration-300 hover:bg-[#009688] text-[#fff] font-semibold rounded-full disabled:cursor-not-allowed transition-colors"
                                    >
                                      <Plus size={14} />
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
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm sticky top-6">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Order Summary
                  </h2>
                </div>

                <div className="px-6 py-4 space-y-4">
                  {/* Subtotal */}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">
                      Subtotal (
                      {cartItems.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                      items)
                    </span>
                    <span className="flex items-center font-medium">
                      <CurrencyNgn />
                      {subtotal.toLocaleString("en-NG")}
                    </span>
                  </div>

                  {/* Savings */}
                  {savings > 0 && (
                    <div className="flex justify-between items-center text-green-600">
                      <span>Total Savings</span>
                      <span className="flex items-center font-medium">
                        <CurrencyNgn />
                        {savings.toLocaleString("en-NG")}
                      </span>
                    </div>
                  )}

                  {/* Delivery */}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Delivery</span>
                    <span className="font-medium">
                      {subtotal >= 50000 ? (
                        <span className="text-[#009688]">FREE</span>
                      ) : (
                        <span className="flex items-center">
                          <CurrencyNgn /> {deliveryCost.toLocaleString("en-NG")}
                        </span>
                      )}
                    </span>
                  </div>

                  {subtotal < 100 && (
                    <div className="flex items-center text-sm text-blue-600">
                      Add <CurrencyNgn />
                      {(100 - subtotal).toLocaleString("en-NG")} more for FREE
                      delivery
                    </div>
                  )}

                  {/* Tax */}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tax</span>
                    <span className="flex items-center font-medium">
                      <CurrencyNgn /> {tax.toLocaleString("en-NG")}
                    </span>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center text-[1.125rem] font-medium">
                      <span>Total</span>
                      <span className="flex items-center">
                        <CurrencyNgn /> {total.toLocaleString("en-NG")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4">
                  <div className="bg-[#f4edeb] flex items-center justify-center rounded-[12px] p-[0.75rem] gap-2 text-sm text-gray-500">
                    <Shield size={14} />
                    <span>
                      This is{" "}
                      <span className="text-[#009668] text-[1rem]">
                        {" "}
                        carbon-neutral
                      </span>{" "}
                      delivery
                    </span>
                  </div>

                  <button
                    className="w-full bg-gradient-to-r from-[#009688] to-[#00695C] transition-all duration-200
    hover:from-[#00897B] hover:to-[#005B4F] text-[#fff] py-3 rounded-lg transition-colors flex items-center justify-center gap-2 mt-4"
                  >
                    Proceed to Checkout
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
