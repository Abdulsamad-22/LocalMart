import {
  Plus,
  ShoppingCart,
  Minus,
  Truck,
  CurrencyNgn,
} from "@phosphor-icons/react";
import { useCart } from "../Context/CartProvider";
import { useProduct } from "../Context/ProductProvider";

export default function ProductsCard({ product }) {
  const { handleAddToCart, increaseCart, decreaseCart } = useCart();
  const { vendors } = useProduct();

  return (
    <>
      <div className="w-full md:w-[65%] bg-[#fff] rounded-[10px] p-4 flex flex-col md:flex-row gap-4 items-start md:items-end">
        <div className="w-full md:w-[345px] h-[306px]">
          <img
            className="w-full h-full rounded-[10px]"
            src={product.image_url}
            alt=""
          />
        </div>

        <div className="w-full md:w-[40%] space-y-4">
          <div className="space-y-2">
            <h2 className="text-[1.25rem] md:text-[1.5rem] text-gray-900">
              {product.item_name}
            </h2>

            <div className="flex items-center">
              <img src="/images/Star.svg" alt="" />
              <div className="text-[1rem] md:text-[1.125rem] font-semibold">
                4.5
                <span className="text-[1.125rem] font-[400] pl-1">
                  {`(120 reviews)`}
                </span>
              </div>
            </div>

            <div className="text-[0.875rem] md:text-[1rem]">
              {product.item_units} Units Left
            </div>

            <div className="flex items-center justify-between">
              <p className="flex items-center font-semibold text-[1rem] md:text-[1.25rem]">
                <CurrencyNgn size={20} />{" "}
                {Number(product.item_price).toLocaleString("en-NG")}
              </p>
              <div className="flex items-center gap-2">
                <Truck size={24} />
                <p className="text-[1rem]">
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
          <button
            onClick={() => handleAddToCart({ ...product, id: product.id })}
            className="flex items-center justify-center gap-2 w-full px-5 py-3 bg-gradient-to-r from-[#009688] to-[#00695C] text-[#fff] item-center rounded-lg"
          >
            <ShoppingCart size={24} color="#fff" />
            Add to Cart
          </button>
        </div>
      </div>
    </>
  );
}
