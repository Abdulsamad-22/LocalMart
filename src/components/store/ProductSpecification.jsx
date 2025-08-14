import { useState } from "react";
import { Images, Plus } from "@phosphor-icons/react";
import { useFormContext } from "react-hook-form";
import ProductSizes from "./ProductSizes";
import ProductColors from "./ProductsColors";

export default function ProductSpecification({ setImageFile }) {
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [preview, setPreview] = useState(null);

  const {
    formState: { isSubmitting, errors },
  } = useFormContext();

  function handleImageUpload(e) {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
    }
  }

  return (
    <div className="w-full md:w-[50%] bg-white p-4 flex flex-col ">
      {/* <div className="w-full text-end mb-8">
        <button className="w-[31%] flex items-end gap-2 text-[1rem] border-[1px] border-gray-600 p-2 rounded-[8px] ">
          <Plus size={24} />
          Add New Product
        </button>
      </div> */}
      <div className="space-y-2 mx-auto text-gray-800 mb-12">
        <label className="block mb-1">Upload product image</label>
        <div className="relative">
          {/* Hidden file input */}
          <input
            type="file"
            onChange={handleImageUpload}
            id="product-image-upload"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          {/* upload area */}
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
            <p className="text-red-500 text-sm">{errors.imageUrl?.message}</p>
          </div>
        </div>
      </div>
      <h3 className="text-[1.125rem] mb-2">Variant</h3>
      <ProductSizes
        selectedSizes={selectedSizes}
        setSelectedSizes={setSelectedSizes}
      />
      <ProductColors />
      <div className="w-full ">
        <button
          type="submit"
          disabled={isSubmitting}
          className=" bg-gradient-to-r from-[#009688] to-[#00695C] text-white px-6 py-2 rounded mt-8"
        >
          Save Product
        </button>
      </div>
    </div>
  );
}
