export default function Products() {
  return (
    <div className="w-full md:w-[65%] flex gap-4 items-end">
      <div className="w-full md:w-[445px] h-[406px]">
        <img className="w-full h-full" src="/images/product-image.png" alt="" />
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
            <p className="text-[1rem]">10 mins away</p>
          </div>
        </div>

        <div className="w-40 space-x-4 text-center border-2 border-[#000]">
          <span className="text-2xl">-</span>
          <span>Quantity</span>
          <span className="text-2xl">+</span>
        </div>
        <button className="w-full px-5 py-3 bg-gradient-to-r from-[#009688] to-[#00695C] text-[#fff] item-center rounded-lg">
          Add to Cart
        </button>
      </div>
    </div>
  );
}
