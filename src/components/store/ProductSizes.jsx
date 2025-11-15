import { useState } from "react";
export default function ProductSizes({ selectedSizes, setSelectedSizes }) {
  const commonSizes = {
    shoes: [
      "35",
      "36",
      "37",
      "38",
      "39",
      "40",
      "41",
      "42",
      "43",
      "44",
      "45",
      "46",
    ],
    clothing: ["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL"],
    unisex: ["One Size", "Adjustable", "Free Size"],
  };

  const [sizeType, setSizeType] = useState("clothing");
  const [customSize, setCustomSize] = useState("");

  const addSize = (size) => {
    if (!selectedSizes.includes(size)) {
      setSelectedSizes([...selectedSizes, size]);
    }
  };

  const removeSize = (size) => {
    setSelectedSizes(selectedSizes.filter((s) => s !== size));
  };

  const addCustomSize = () => {
    if (customSize && !selectedSizes.includes(customSize)) {
      setSelectedSizes([...selectedSizes, customSize]);
      setCustomSize("");
    }
  };
  return (
    <div className="space-y-4 mb-8">
      <div className="bg-gray-50 p-4 rounded-lg border">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Size Category
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { key: "clothing", label: "Clothing", desc: "XS, S, M, L, XL..." },
            { key: "shoes", label: "Shoes", desc: "EU sizes 35-46" },
            { key: "unisex", label: "Universal", desc: "One size fits all" },
          ].map(({ key, label, desc }) => (
            <div
              key={key}
              onClick={() => setSizeType(key)}
              className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                sizeType === key
                  ? "border-[#009688] bg-[#009688]/10 shadow-md"
                  : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
              }`}
            >
              <div
                className={`font-medium text-[0.875rem] md:text-[1rem] ${
                  sizeType === key ? "text-[#009688]" : "text-gray-900"
                }`}
              >
                {label}
              </div>
              <div className="text-xs text-gray-500">{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Size Addition */}
      <div className="bg-gray-50 p-3 rounded-lg border">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Add Custom Size
        </label>

        <div className="flex gap-3">
          <input
            type="text"
            value={customSize}
            onChange={(e) => setCustomSize(e.target.value)}
            placeholder="Enter custom size"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009688] focus:border-transparent"
            onKeyPress={(e) => e.key === "Enter" && addCustomSize()}
          />
          <button
            type="button"
            onClick={addCustomSize}
            disabled={!customSize.trim()}
            className="px-4 py-2 bg-[#009688] text-white rounded-lg hover:bg-[#00897B] focus:outline-none focus:ring-2 focus:ring-[#009688] focus:ring-offset-2 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Add
          </button>
        </div>
      </div>

      {/* Common Sizes Selection */}
      <div className="flex flex-wrap gap-2">
        {commonSizes[sizeType].map((size) => (
          <button
            key={size}
            type="button"
            onClick={() =>
              selectedSizes.includes(size) ? removeSize(size) : addSize(size)
            }
            className={`px-3 py-1 text-[0.875rem] md:text-[1rem] rounded border ${
              selectedSizes.includes(size)
                ? "bg-[#009688] text-white border-[#009688]"
                : "bg-white border-gray-300 hover:bg-gray-100"
            }`}
          >
            {size}
          </button>
        ))}
      </div>

      {selectedSizes.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium mb-2">Selected Sizes:</h4>
          <div className="flex flex-wrap gap-2">
            {selectedSizes.map((size) => (
              <span
                key={size}
                className="text-[0.875rem] md:text-[1rem] px-3 py-1 bg-gray-100 rounded-full flex items-center"
              >
                {size}
                <button
                  type="button"
                  onClick={() => removeSize(size)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
