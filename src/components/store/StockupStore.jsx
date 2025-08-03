import { WarningCircle } from "@phosphor-icons/react";
export default function StockupStore() {
  return (
    <form className="w-full md:w-[50%] p-6 bg-white shadow rounded-lg space-y-6">
      <div>
        <h3 className="text-[1.25rem] mb-8">New Product</h3>

        <div className="space-y-2 text-gray-800 mb-6">
          <label>Product Name</label>
          <input className="input" type="text" />
          <p className="text-sm flex items-center gap-1">
            <span>
              <WarningCircle size={18} />
            </span>
            A product name is required and recommended to be unique
          </p>
        </div>

        <div className="space-y-2 text-gray-800 mb-6">
          <label>Product Category</label>
          <input className="input" type="text" />
        </div>

        <div className="space-y-2 text-gray-800 mb-6">
          <div className="flex items-center justify-between">
            <label>Product Description</label>
            <label>0/1000</label>
          </div>

          <textarea className="w-full h-[120px] p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#009688]" />
        </div>

        <div className="space-y-2 text-gray-800">
          <label htmlFor="price">Pricing</label>
          <input className="input" type="text" />
        </div>
      </div>
    </form>
  );
}
