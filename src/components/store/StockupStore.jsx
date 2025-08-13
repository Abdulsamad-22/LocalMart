import { useFormContext } from "react-hook-form";
import { WarningCircle, Plus } from "@phosphor-icons/react";

export default function StockupStore() {
  const {
    register,
    formState: { errors },
    reset,
  } = useFormContext();

  const handleNewProduct = () => {
    reset();
  };
  return (
    <div className="w-full md:w-[50%] p-6 bg-white shadow rounded-lg space-y-6">
      <div>
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-[1.25rem]">New Product</h3>

          <button
            onClick={handleNewProduct}
            className="flex items-center gap-2 text-[1rem] border-[1px] border-gray-600 p-2 rounded-[8px] "
          >
            <Plus size={24} />
            Add New Product
          </button>
        </div>

        <div className="space-y-2 text-gray-800 mb-6">
          <label>Product Name</label>
          <input {...register("productName")} className="input" type="text" />
          <p className="text-sm flex items-center gap-1">
            <span>
              <WarningCircle size={18} />
            </span>
            A product name is required and recommended to be unique
          </p>
          <p className="text-red-500 text-sm">{errors.productName?.message}</p>
        </div>

        <div className="space-y-2 text-gray-800 mb-6">
          <label>Product Category</label>
          <input {...register("category")} className="input" type="text" />
          <p className="text-red-500 text-sm">{errors.category?.message}</p>
        </div>

        <div className="space-y-2 text-gray-800 mb-6">
          <div className="flex items-center justify-between">
            <label>Product Description</label>
            <label>0/1000</label>
          </div>

          <textarea
            {...register("description")}
            className="w-full h-[120px] p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#009688]"
          />
          <p className="text-red-500 text-sm">{errors.description?.message}</p>
        </div>

        <div className="space-y-2 text-gray-800">
          <label htmlFor="unit">{`Units (No of item available)`}</label>
          <input {...register("units")} className="input" type="text" />
          <p className="text-red-500 text-sm">{}</p>
        </div>

        <div className="w-[40%] space-y-2 text-gray-800">
          <label htmlFor="price">Pricing</label>
          <input {...register("price")} className="input" type="text" />
          <p className="text-red-500 text-sm">{errors.price?.message}</p>
        </div>
      </div>
    </div>
  );
}
