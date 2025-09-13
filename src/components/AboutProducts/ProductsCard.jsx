import {
  Plus,
  ShoppingCart,
  Minus,
  Truck,
  Check,
  CurrencyNgn,
} from "@phosphor-icons/react";
import { useCart } from "../Context/CartProvider";
import { useProduct } from "../Context/ProductProvider";
import { useState } from "react";

export default function ProductsCard({ product }) {
  const { handleAddToCart, increaseCart, decreaseCart } = useCart();
  const { vendors } = useProduct();
  const [selectedColor, setSelectedColor] = useState(null);

  return (
    <>
      <div className="w-full md:w-[70%] bg-[#fff] rounded-[10px] p-4 flex flex-col md:flex-row gap-8 items-start">
        <div className="w-full md:w-[445px] h-[306px]">
          <img
            className="w-full h-full rounded-[10px]"
            src={product.image_url}
            alt=""
          />
        </div>

        <div className="w-full md:w-[50%] space-y-4">
          <div className="">
            <h2 className="text-[1rem] md:text-[1.5rem] font-semibold text-gray-900">
              {product.item_name}
            </h2>
            <div className="flex justify-between py-2 border-b-[1px] border-gray-300 mb-4">
              <span className="flex items-center font-semibold text-[1rem] md:text-[1rem]">
                <CurrencyNgn size={20} />{" "}
                {Number(product.item_price).toLocaleString("en-NG")}
              </span>

              <div className="flex items-center gap-2 ">
                <img src="/images/Star.svg" alt="" />
                <div className="text-[0.875rem] md:text-[1rem] font-regular">
                  4.5
                  {/* <span className="text-[0.875rem] md:text-[1rem] font-[400] pl-1">
                    {`(120 reviews)`}
                  </span> */}
                </div>
              </div>
            </div>

            <p className="text-gray-600 text-sm mb-3 line-clamp-3 mb-6">
              {product.item_description}
            </p>
            {product.item_sizes && product.item_sizes.length > 0 && (
              <select
                className="w-[20%] px-3 py-2 rounded-lg border 
          border-[#009688] text-gray-700 text-sm
          focus:outline-none
          hover:border-[#00796B] transition-all duration-200 mb-4"
              >
                {product.item_sizes.map((size, index) => (
                  <option
                    key={index}
                    value={size}
                    className="
              hover:bg-[#009688]/10 
              active:bg-[#009688] active:text-white
              cursor-pointer
            "
                  >
                    {size}
                  </option>
                ))}
              </select>
            )}

            <div className="flex gap-3 mb-4">
              {product.item_colors.map((color, idx) => {
                const isSelected = selectedColor === color;

                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedColor(color)}
                    className={`
              relative w-10 h-10 rounded-full cursor-pointer transition-all duration-200
              flex items-center justify-center
              ${isSelected ? "p-1 border-2 border-[#009688]" : ""}
            `}
                  >
                    <div
                      className="w-full h-full rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    {isSelected && (
                      <Check
                        size={18}
                        className="absolute text-white"
                        strokeWidth={3}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="text-[0.875rem] md:text-[0.975rem] mb-2">
              {product.item_units} Units Left
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[0.975rem] text-gray-600">
                <Truck size={20} />
                <p className="">
                  {vendors.map((v) => (
                    <span>{v.travelTime}</span>
                  ))}{" "}
                  mins away
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center w-20 px-0 py-1 gap-2 text-center rounded-md">
            <div
              onClick={() => decreaseCart(product.id)}
              className="bg-[#000] text-[#fff] font-semibold p-2 transition-transform duration-300 hover:bg-[#009688] rounded-full cursor-pointer"
            >
              <Minus size={20} className="" />
            </div>
            <div className="flex items-center justify-center w-10 h-10 text-[1.125rem] px-4 py-2 text-[#000] font-semibold">
              {product.quantity}
            </div>
            <div
              onClick={() => increaseCart(product.id)}
              className="bg-[#000] text-[#fff] font-semibold p-2  transition-transform duration-300 hover:bg-[#009688] rounded-full cursor-pointer"
            >
              <Plus size={20} />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleAddToCart({ ...product, id: product.id })}
              className="flex items-center justify-center gap-2 flex-[2.5] w-full px-5 py-3 bg-gradient-to-r from-[#009688] to-[#00695C] text-[#fff] item-center rounded-lg"
            >
              <ShoppingCart size={24} color="#fff" />
              Add to Cart
            </button>

            <button
              onClick={() => handleAddToCart({ ...product, id: product.id })}
              className="flex items-center justify-center gap-2 flex-1 w-full px-5 py-3 border-[1px] border-gray-600 text-[#000] item-center rounded-lg"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
