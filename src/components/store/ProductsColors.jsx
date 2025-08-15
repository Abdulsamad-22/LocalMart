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

      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Custom Color</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={customColorName}
              onChange={(e) => setCustomColorName(e.target.value)}
              placeholder="Color name"
              className="input"
            />

            <div className="relative flex-2">
              <input
                type="color"
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                className="absolute opacity-0 w-full h-full cursor-pointer"
              />
              <div
                className="w-full h-10 rounded border border-gray-300 flex items-center justify-center"
                style={{ backgroundColor: customColor || "#FFFFFF" }}
              >
                {!customColor && <span className="text-gray-400">Pick</span>}
              </div>
            </div>
            <button
              type="button"
              onClick={addCustomColor}
              className="px-3 bg-[#009688] text-white rounded hover:bg-[#00897B]"
            >
              Add
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
                <span>{color.name}</span>
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
