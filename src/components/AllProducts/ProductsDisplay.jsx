import products from "../../../data/Products.json";
const productListings = products;
export default function ProductsDisplay({ limit }) {
  return (
    <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12 px-4 md:px-0 mt-8">
      {productListings
        .slice(0, limit || productListings.length)
        .map((products, id) => (
          <div
            key={id}
            className="bg-[#fff] shadow-lg shadow-gray-400/50 rounded-[10px]"
          >
            <div className="w-[280px] md:w-full h-[205px] md:h-[218px] relative transition-transform duration-300 hover:scale-95 cursor-pointer">
              <img
                className="w-full h-full rounded-[10px]"
                src={products.image}
                alt="products image"
              />

              <img
                className="absolute right-2 top-2"
                src="/images/Heart.svg"
                alt=""
              />
            </div>

            <div className="bg-[#fff] px-3 py-4 space-y-3 rounded-b-[10px]">
              <h2 className="text-[0.875rem] md:text-[1.25rem]">
                {products.name}
              </h2>
              <div className="space-y-4">
                <div className="flex items-center text-[1.25rem]">
                  <div className="h-4 md:h-8  w-4 md:w-8 bg-[#B7FDF6] text-[0.875rem] md:text-[1.125rem] rounded-full flex items-center justify-center mr-2">
                    A
                  </div>
                  {products.vendors}
                </div>
                <div className="flex items-center">
                  <img src={products.ratings.image} alt="" />
                  <div className="text-[0.875rem] md:text-[1.25rem] font-semibold">
                    {products.ratings.number}
                    <span className="text-[0.75rem] md:text-[0.875rem] font-[400] pl-1">
                      {`(${products.ratings.reviews} reviews)`}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <p className="font-semibold text-[0.875rem] md:text-[1.25rem]">
                    ${products.price}
                  </p>
                  <p className="text-[0.75rem] md:text-[0.975rem]">
                    {products.delivery} mins away
                  </p>
                </div>
              </div>
              <div>
                <button className="w-full px-5 py-3 bg-gradient-to-r from-[#009688] to-[#00695C] text-[#fff] item-center rounded-lg mt-4">
                  {products.cta}
                </button>
              </div>
            </div>
          </div>
        ))}
    </section>
  );
}
