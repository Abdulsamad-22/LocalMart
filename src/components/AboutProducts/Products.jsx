import { Plus, ShoppingCart, Minus, Truck } from "@phosphor-icons/react";

export default function Products() {
  return (
    <div className="w-full md:w-[65%] bg-[#fff] rounded-[10px] p-4 flex gap-4 items-end">
      <div className="w-full md:w-[345px] h-[306px]">
        <img
          className="w-full h-full rounded-[10px]"
          src="/images/product-image6.png"
          alt=""
        />
      </div>

      <div className="w-full md:w-[40%] space-y-4">
        <div className="space-y-2">
          <h2 className="text-[1.5rem]">Product Name</h2>

          {/* <div className="flex items-center text-[1.25rem]">
            <div className="h-4 md:h-8  w-4 md:w-8 bg-[#B7FDF6] text-[0.875rem] md:text-[1.125rem] rounded-full flex items-center justify-center mr-2">
              A
            </div>
            Vendor
          </div> */}

          <div className="flex items-center">
            <img src="/images/Star.svg" alt="" />
            <div className="text-[0.875rem] md:text-[1.25rem] font-semibold">
              4.5
              <span className="text-[0.75rem] md:text-[0.875rem] font-[400] pl-1">
                (120 reviews)
              </span>
            </div>
          </div>

          <div>10 Units Left</div>

          <div className="flex items-center justify-between">
            <p className="font-semibold text-[0.875rem] md:text-[1.25rem]">
              $100.00
            </p>
            <div className="flex items-center gap-2">
              <Truck size={24} />
              <p className="text-[1rem]">10 mins away</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between w-40 px-0 py-1 space-x-0 text-center rounded-md">
          <div className="p-2 transition-transform duration-300 hover:bg-[#009688] hover:border-transparent border-2 border-[#c4c4c4] rounded-full cursor-pointer">
            {/* <img src="/images/icon-minus.svg" alt="" /> */}
            <Minus
              size={20}
              className="text-[#000] font-semibold  [&>svg]:hover:text-[#fff]"
            />
          </div>
          <span className="text-[1.125rem] font-semibold">3</span>
          <div className="bg-[#000] transition-transform duration-300 hover:bg-[#009688] p-2 rounded-full cursor-pointer">
            <Plus size={20} className="text-[#fff] font-semibold  " />
          </div>
        </div>
        <button className="flex items-center justify-center gap-2 w-full px-5 py-3 bg-gradient-to-r from-[#009688] to-[#00695C] text-[#fff] item-center rounded-lg">
          <ShoppingCart size={24} color="#fff" />
          Add to Cart
        </button>
      </div>
    </div>
  );
}
