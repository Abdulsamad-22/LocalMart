import { useState } from "react";
export default function ProductColors({ selectedColors, setSelectedColors }) {
  const commonColors = [
    { name: "Red", code: "#FF0000" },
    { name: "Blue", code: "#0000FF" },
    { name: "Green", code: "#00FF00" },
    { name: "Black", code: "#000000" },
    { name: "White", code: "#FFFFFF" },
    { name: "Yellow", code: "#FFFF00" },
    { name: "Purple", code: "#800080" },
    { name: "Pink", code: "#FFC0CB" },
  ];

  const [customColor, setCustomColor] = useState("");
  const [customColorName, setCustomColorName] = useState("");

  const addColor = (color) => {
    if (!selectedColors.some((c) => c.code === color.code)) {
      setSelectedColors([...selectedColors, color]);
    }
  };

  const removeColor = (colorCode) => {
    setSelectedColors(selectedColors.filter((c) => c.code !== colorCode));
  };

  const addCustomColor = () => {
    if (customColor && customColorName) {
      addColor({
        name: customColorName,
        code: customColor.startsWith("#") ? customColor : `#${customColor}`,
      });
      setCustomColor("");
      setCustomColorName("");
    }
  };
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 mb-4">
        {commonColors.map((color) => (
          <button
            key={color.code}
            type="button"
            onClick={() =>
              selectedColors.some((c) => c.code === color.code)
                ? removeColor(color.code)
                : addColor(color)
            }
            className={`w-9 h-9 rounded-full border-2 ${
              selectedColors.some((c) => c.code === color.code)
                ? "border-[#009688]"
                : "border-gray-200 hover:border-gray-400"
            }`}
            style={{ backgroundColor: color.code }}
            title={color.name}
          />
        ))}
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Add Custom Color
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          {/* Color Name Input */}
          <div className="sm:col-span-5">
            <label className="block text-sm text-gray-600 mb-1">
              Color Name
            </label>
            <input
              type="text"
              value={customColorName}
              onChange={(e) => setCustomColorName(e.target.value)}
              placeholder="Enter color name"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009688] focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Color Picker */}
          <div className="sm:col-span-4">
            <label className="block text-sm text-gray-600 mb-1">
              Choose Color
            </label>
            <div className="relative">
              <input
                type="color"
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div
                className="w-full h-10 rounded-lg border-2 border-gray-300 cursor-pointer transition-all duration-200 hover:border-[#009688] hover:shadow-md relative overflow-hidden group"
                style={{ backgroundColor: customColor }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black bg-opacity-20 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    Click to change
                  </div>
                </div>
                <div className="absolute top-1 right-1 bg-white bg-opacity-90 text-xs text-gray-600 px-1 py-0.5 rounded text-[10px] font-mono">
                  {customColor}
                </div>
              </div>
            </div>
          </div>

          {/* Add Button */}
          <div className="sm:col-span-3">
            <button
              type="button"
              onClick={addCustomColor}
              disabled={!customColorName.trim()}
              className="w-full h-10 bg-[#009688] text-white rounded-lg hover:bg-[#00897B] focus:outline-none focus:ring-2 focus:ring-[#009688] focus:ring-offset-2 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              Add Color
            </button>
          </div>
        </div>
      </div>

      {selectedColors.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium mb-2">Selected Colors:</h4>
          <div className="flex flex-wrap gap-2">
            {selectedColors.map((color) => (
              <div
                key={color.code}
                className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full"
              >
                <div
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{ backgroundColor: color.code }}
                />
                <span className="text-[0.875rem] md:text-[1rem]">
                  {color.name}
                </span>
                <button
                  type="button"
                  onClick={() => removeColor(color.code)}
                  className="ml-1 text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
