import products from "../../../data/Products.json";

const cartItem = products;
export default function CartItemSection() {
  return (
    <section className="bg-[#E3E3E3] p-8 w-full md:w-[70%] rounded-[10px]">
      <div className="">
        {cartItem.slice(0, 3).map((cart, id) => (
          <div key={id} className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-4 items-center">
                <div className="w-[145px] h-[119px]">
                  <img className="w-full h-full" src={cart.image} alt="" />
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
                <div className="w-[120px] space-x-4 text-center border-2 border-[#c4c4c4]">
                  <span className="text-2xl">-</span>
                  <span>3</span>
                  <span className="text-2xl">+</span>
                </div>

                <button className="py-1 px-6 border-2 border-[#c4c4c4]">
                  x Remove
                </button>
              </div>
            </div>
            <hr className="border-[0.5px] border-[#c4c4c4] rounded-full" />
          </div>
        ))}
      </div>
    </section>
  );
}
