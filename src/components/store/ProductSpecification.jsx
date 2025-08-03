import { useState } from "react";
import { Plus } from "@phosphor-icons/react";
import ProductSizes from "./ProductSizes";
import ProductColors from "./ProductsColors";
export default function ProductSpecification() {
  const [preview, setPreview] = useState(null);
  const [selectedSizes, setSelectedSizes] = useState([]);

  return (
    <div className="w-full md:w-[50%] bg-white p-4 flex flex-col ">
      <div className="w-full text-end">
        <button className="w-[20%] bg-gradient-to-r from-[#009688] to-[#00695C] text-white px-6 py-2 rounded ">
          Save
        </button>
      </div>

      <div className="space-y-2 mx-auto text-gray-800 mb-12">
        <label className="block mb-1">Upload product image</label>
        <div className="relative">
          {/* Hidden file input */}
          <input
            type="file"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) setPreview(URL.createObjectURL(file));
            }}
            id="product-image-upload"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          {/* Styled upload area */}
          <div className="w-[301.75px] h-[218px]">
            <div
              className="w-full h-full py-4 border-2 border-dashed border-[#009688] rounded-lg 
               flex flex-col items-center justify-center cursor-pointer 
               hover:border-blue-500 transition-colors overflow-hidden"
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="h-full w-full object-cover rounded-lg"
                />
              ) : (
                <>
                  <div className="text-5xl text-[#009688] mb-2">
                    <Plus size={32} />
                  </div>
                  <p className="text-gray-500 text-sm font-medium">
                    Click to upload or drag and drop
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <h3 className="text-[1.125rem] mb-2">Variant</h3>
      <ProductSizes
        selectedSizes={selectedSizes}
        setSelectedSizes={setSelectedSizes}
      />
      <ProductColors />
    </div>
  );
}
