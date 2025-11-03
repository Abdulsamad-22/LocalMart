import { useCart } from "../Context/CartProvider";
import { CurrencyNgn, Trash } from "@phosphor-icons/react";
import { useFormContext } from "react-hook-form";

export default function CheckoutSummary({ loading, vendorInfo }) {
  const { cartItems, removeFromCart } = useCart();
  const {
    formState: { isSubmitting },
  } = useFormContext();

  return (
    <div className="">
      {/* Cart Items Display */}
      <div className="bg-white rounded-lg shadow-sm border mb-6">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Review Your Order</h2>

          {cartItems.map((item, index) => {
            const vendor = vendorInfo.find(
              (v) => v.vendor_id === item.vendor_id
            );
            return (
              <div
                key={item.id}
                className={`flex items-center justify-between py-3 ${
                  index !== cartItems.length - 1 ? "border-b" : ""
                }`}
              >
                <div className="flex items-center gap-4  ">
                  <div className="w-[20%]">
                    <img
                      className="w-full rounded-[8px]"
                      src={item.image_url}
                      alt=""
                    />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium">{item.name}</h3>

                    <div className="flex items-center gap-3">
                      <p className="text-sm font-medium text-[#009688]">
                        {item.quantity}X
                      </p>

                      <span className="flex items-center gap-[1px] text-[1.125rem] text-gray-600">
                        @
                        <CurrencyNgn size={14} />
                        <p className="text-sm text-gray-600">
                          {item.price.toLocaleString("en-NG")}
                        </p>
                      </span>

                      <p className="flex items-center font-medium text-sm text-gray-800">
                        <CurrencyNgn size={14} />
                        {(item.price * item.quantity).toLocaleString("en-NG")}
                      </p>
                    </div>

                    <p className="text-sm text-gray-600">
                      Sold by: {vendor?.business_name}
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => removeFromCart(item.id)}
                  className="text-right cursor-pointer text-gray-700 hover:text-[#009688]"
                >
                  <Trash size={20} />
                  {/* <p className="flex items-center font-medium">
                  <CurrencyNgn size={18} />
                  {(item.price * item.quantity).toLocaleString("en-NG")}
                </p> */}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment Summary */}
      <div className="bg-[#fff] rounded-lg p-6">
        <h3 className="font-semibold mb-4">Payment Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span className="flex items-center gap-[0.5px]">
              <CurrencyNgn size={18} />
              {cartItems
                .reduce((sum, item) => sum + item.price * item.quantity, 0)
                .toLocaleString("en-NG")}
            </span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Platform Fee (5%):</span>
            <span className="flex items-center gap-[0.5px]">
              <CurrencyNgn size={18} />
              {(
                cartItems.reduce(
                  (sum, item) => sum + item.price * item.quantity,
                  0
                ) * 0.05
              ).toLocaleString("en-NG")}
            </span>
          </div>
          <div className="border-t pt-2 flex justify-between font-semibold">
            <span>Total:</span>
            <span className="flex items-center gap-[0.5px]">
              <CurrencyNgn size={18} />
              {cartItems
                .reduce((sum, item) => sum + item.price * item.quantity, 0)
                .toLocaleString("en-NG")}
            </span>
          </div>
        </div>

        {/* Checkout Button */}
        <button
          type="submit"
          disabled={isSubmitting || loading || cartItems.length === 0}
          className="w-full bg-[#009688] flex items-center justify-center text-[1.125rem] text-white py-3 rounded-lg hover:bg-[#00897B] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors mt-6"
        >
          {
            isSubmitting || loading ? "Processing..." : "Place order"
            // <>
            //   Pay <CurrencyNgn size={18} className="ml-2 font-medium" />{" "}
            //   {cartItems
            //     .reduce((sum, item) => sum + item.price * item.quantity, 0)
            //     .toLocaleString("en-NG")}
            // </>
          }
        </button>
      </div>
    </div>
  );
}
