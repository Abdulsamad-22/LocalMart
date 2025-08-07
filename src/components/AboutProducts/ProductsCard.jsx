import { Plus, ShoppingCart, Minus, Truck } from "@phosphor-icons/react";
import { useCart } from "../Context/CartProvider";

export default function ProductsCard({ product }) {
  const { handleAddToCart, increaseCart, decreaseCart } = useCart();

  return (
    <>
      <div className="w-full md:w-[65%] bg-[#fff] rounded-[10px] p-4 flex gap-4 items-end">
        <div className="w-full md:w-[345px] h-[306px]">
          <img
            className="w-full h-full rounded-[10px]"
            src={product.image}
            alt=""
          />
        </div>

        <div className="w-full md:w-[40%] space-y-4">
          <div className="space-y-2">
            <h2 className="text-[1.5rem]">{product.name}</h2>

            <div className="flex items-center">
              <img src={product.ratings.image} alt="" />
              <div className="text-[0.875rem] md:text-[1.25rem] font-semibold">
                {product.ratings.number}
                <span className="text-[0.75rem] md:text-[0.875rem] font-[400] pl-1">
                  {`(${product.ratings.reviews} reviews)`}
                </span>
              </div>
            </div>

            <div>10 Units Left</div>

            <div className="flex items-center justify-between">
              <p className="font-semibold text-[0.875rem] md:text-[1.25rem]">
                ${product.price}
              </p>
              <div className="flex items-center gap-2">
                <Truck size={24} />
                <p className="text-[1rem]">{product.delivery} mins away</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between w-40 px-0 py-1 space-x-0 text-center rounded-md">
            <div
              onClick={() => decreaseCart(product.id)}
              className="p-2 transition-transform duration-300 hover:bg-[#009688] hover:border-transparent border-2 border-[#c4c4c4] rounded-full cursor-pointer"
            >
              <Minus
                size={20}
                className="text-[#000] font-semibold  [&>svg]:hover:text-[#fff]"
              />
            </div>
            <span className=" text-[1.125rem] text-[#000] font-semibold">
              {product.quantity}
            </span>
            <div
              onClick={() => increaseCart(product.id)}
              className="bg-[#000] transition-transform duration-300 hover:bg-[#009688] p-2 rounded-full cursor-pointer"
            >
              <Plus size={20} className="text-[#fff] font-semibold  " />
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
