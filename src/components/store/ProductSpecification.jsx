import { useState } from "react";
import { Images, Upload, Plus } from "@phosphor-icons/react";
import { useFormContext } from "react-hook-form";
import ProductSizes from "./ProductSizes";
import ProductColors from "./ProductsColors";
import useProductStore from "../../state-store/productStore";

export default function ProductSpecification({
  setImageFile,
  setSelectedColors,
  selectedColors,
  selectedSizes,
  setSelectedSizes,
  setPreview,
  preview,
}) {
  const editingProduct = useProductStore((state) => state.editingProduct);
  const {
    formState: { isSubmitting, errors },
    handleCancelEdit,
    setValue,
    setError,
    clearErrors,
    watch,
  } = useFormContext();
  const [uploading, setUploading] = useState(false);
  const selectedImage = watch("selectedImage");

  const handleImageUpload = async (file) => {
    if (!file) {
      setError("selectedImage", {
        type: "manual",
        message: "Please select an image file",
      });
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("selectedImage", {
        type: "manual",
        message: "Please upload a valid image file",
      });
      return;
    }

    clearErrors("selectedImage");
    setUploading(true);

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result.split(",")[1];
        setValue(
          "selectedImage",
          { name: file.name, data: base64, type: file.type },
          {
            shouldValidate: true,
          },
        );
        setPreview(reader.result);
        setImageFile(file);
        setUploading(false);
      };
      reader.onerror = () => {
        setError("selectedImage", {
          type: "manual",
          message: "Failed to read image file",
        });
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError("selectedImage", {
        type: "manual",
        message: "Failed to upload image",
      });
      setUploading(false);
    }
  };

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
            accept="image/*"
            id="product-image-upload"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleImageUpload(file);
              }
            }}
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
                  src={`data:${selectedImage.type};base64,${selectedImage.data}`}
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
            {errors.selectedImage?.message && (
              <p className="text-red-500 text-sm mt-1">
                {errors.selectedImage.message}
              </p>
            )}
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
        {/* <button
          type="submit"
          disabled={isSubmitting}
          className=" bg-gradient-to-r from-[#009688] to-[#00695C] text-white px-6 py-2 rounded mt-8"
        >
          Save Product
        </button> */}
        <div className="flex gap-3 mt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 flex items-center gap-2 justify-center bg-[#009688] text-white py-3 rounded-lg hover:bg-[#00897B]"
          >
            {!editingProduct ? <Plus size={20} /> : ""}
            {editingProduct ? "✓ Update Product" : "Add Product"}
          </button>

          {editingProduct && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-6 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
