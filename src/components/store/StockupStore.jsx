import { useFormContext } from "react-hook-form";
import { WarningCircle, Plus, CurrencyNgn } from "@phosphor-icons/react";
import { useState } from "react";

export default function StockupStore() {
  const [isFocused, setIsFocused] = useState(false);
  const {
    register,
    formState: { errors },
    reset,
  } = useFormContext();

  return (
    <div className="w-full md:w-[50%] p-4 md:p-6 bg-white shadow rounded-lg space-y-6">
      <div>
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-[1.25rem] text-gray-900 font-semibold">
            New Product
          </h3>

          {/* <button
            onClick={handleNewProduct}
            className="flex items-center gap-2 text-[1rem] border-[1px] border-gray-600 p-2 rounded-[8px] "
          >
            <Plus size={24} />
            Add New Product
          </button> */}
        </div>

        <div className="space-y-2 text-gray-800 mb-6">
          <label>Product Name</label>
          <input {...register("productName")} className="input" type="text" />
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
            {/* <label>0/1000</label> */}
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
          <p className="text-red-500 text-sm">{errors.units?.message}</p>
        </div>

        <div className="w-[40%] space-y-2 text-gray-800">
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700"
          >
            Pricing
          </label>

          <div
            className={`
        relative flex items-center border rounded-md transition-all duration-200
        ${
          isFocused
            ? "border-[#009688] ring-2 ring-[#009688]/20"
            : "border-gray-300"
        }
      `}
          >
            {/* Currency Icon Container */}
            <div
              className={`
            flex items-center justify-center py-3 px-2 w-12 h-full rounded-l-md transition-all duration-200
            ${isFocused ? "bg-[#009688]" : "bg-[#000]"}
          `}
            >
              <CurrencyNgn
                size={20}
                className={`
              transition-colors duration-200
              ${isFocused ? "text-white" : "text-[#fff]"}
            `}
              />
            </div>

            {/* Input Field */}
            <input
              {...register("price").toLocaleString("en-NG")}
              type="text"
              placeholder="0.00"
              className="
            flex-1 px-3 py-2 bg-transparent border-none rounded-r-md 
            focus:outline-none placeholder-gray-400
          "
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </div>

          {errors.price?.message && (
            <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
