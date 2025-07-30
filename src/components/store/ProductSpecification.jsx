import { useState } from "react";
export default function ProductSpecification() {
  const [preview, setPreview] = useState(null);

  return (
    <div className="w-full md:w-[50%] bg-white p-4 flex flex-col ">
      <div className="w-full text-end">
        <button className="w-[20%] bg-gradient-to-r from-[#009688] to-[#00695C] text-white px-6 py-2 rounded ">
          Save
        </button>
      </div>

      <div className="space-y-2 mx-auto text-gray-800 mb-6">
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
          <div className="input w-[301.75px] h-[218px] py-4 border-2 border-dashed border-[#009688]rounded-lg flex flex-col items-center justify-center hover:border-blue-500 transition-colors">
            {/* Plus sign icon */}
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="text-5xl">+</div>
            )}

            <p className="text-gray-500">Click to upload</p>
          </div>
        </div>
      </div>

      <div className="space-y-2 text-gray-800 mb-6">
        <label htmlFor="size">Sizes</label>
        <input className="input" type="text" />
      </div>

      <div className="space-y-2 text-gray-800">
        <label htmlFor="colour">Colours</label>
        <input className="input" type="text" />
      </div>
    </div>
  );
}
