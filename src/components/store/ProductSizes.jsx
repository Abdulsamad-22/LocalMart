import { useState } from "react";
export default function ProductSizes({ selectedSizes, setSelectedSizes }) {
  const commonSizes = {
    shoes: ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45"],
    clothing: ["XS", "S", "M", "L", "XL", "XXL"],
    unisex: ["One Size"],
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
      <div className="flex gap-4">
        <select
          value={sizeType}
          onChange={(e) => setSizeType(e.target.value)}
          className="input"
        >
          <option value="clothing">Clothing</option>
          <option value="shoes">Shoes</option>
          <option value="unisex">One Size</option>
        </select>

        <div className="flex gap-2">
          <input
            type="text"
            value={customSize}
            onChange={(e) => setCustomSize(e.target.value)}
            placeholder="Custom size"
            className="input"
          />
          <button
            type="button"
            onClick={addCustomSize}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            Add
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {commonSizes[sizeType].map((size) => (
          <button
            key={size}
            type="button"
            onClick={() =>
              selectedSizes.includes(size) ? removeSize(size) : addSize(size)
            }
            className={`px-3 py-1 rounded border ${
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
                className="px-3 py-1 bg-gray-100 rounded-full flex items-center"
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
