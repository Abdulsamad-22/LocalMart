import { useState } from "react";
import { Images, Upload } from "@phosphor-icons/react";
import { useFormContext } from "react-hook-form";
import ProductSizes from "./ProductSizes";
import ProductColors from "./ProductsColors";

export default function ProductSpecification({
  setImageFile,
  setSelectedColors,
  selectedColors,
  selectedSizes,
  setSelectedSizes,
  setPreview,
  preview,
}) {
  const {
    formState: { isSubmitting, errors },
  } = useFormContext();

  function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result); // This becomes the base64 string
      setImageFile(file);
    };
    reader.readAsDataURL(file); // Convert to data URL
  }

  return (
    <div className="w-full md:w-[50%] bg-white p-4 md:p-6 flex flex-col ">
      <div className="space-y-2 mx-auto text-gray-800 mb-12">
        <label className="block text-[1rem] text-gray-800 font-medium mb-1">
          Upload or drag product image here
        </label>
        <div className="relative border-[2px] border-[#009688] border-dashed rounded-lg">
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
              className="w-full h-full py-4
               flex flex-col items-center justify-center cursor-pointer 
               hover:border-blue-500 transition-colors overflow-hidden"
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-[301.75px] h-[218px] object-cover rounded-lg"
                />
              ) : (
                <>
                  <div className="text-5xl text-[#009688] mb-2">
                    <Upload size={32} />
                  </div>
                  <p className="text-gray-500 text-sm font-medium">
                    Upload or drag product image here
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
      <ProductColors
        selectedColors={selectedColors}
        setSelectedColors={setSelectedColors}
      />
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
