import { useFormContext } from "react-hook-form";
export default function DraftProducts({
  draftProducts,
  setDraftProducts,
  setImageFile,
  setPreview,
  setSelectedColors,
  setSelectedSizes,
  setEditingDraftId,
}) {
  const { reset } = useFormContext();
  const handleEdit = (draftId) => {
    const draft = draftProducts.find((p) => p.draftId === draftId);
    const formData = {
      productName: draft.item_name,
      price: draft.item_price,
      description: draft.item_description,
      category: draft.item_category,
    };
    console.log(formData);
    reset(formData);
    if (draft.image_url) {
      setImageFile(draft.image_url);
      setPreview(draft.image_preview);
    } else {
      setImageFile(null);
      setPreview(null);
    }

    // Restore sizes/colors
    setSelectedSizes(draft.item_sizes || []);
    setSelectedColors(draft.item_colors || []);

    setEditingDraftId(draftId);
    setDraftProducts((prev) => prev.filter((p) => p.draftId !== draftId));
  };

  const handleDelete = (draftId) => {
    setDraftProducts((drafts) => drafts.filter((p) => p.draftId !== draftId));
  };
  return (
    <div className="px-12">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center pb-2 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">
            Draft Products ({draftProducts.length})
          </h3>
          <button className="text-sm text-gray-500">Submit all</button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {draftProducts.map((product) => (
          <div
            key={product.draftId}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden"
          >
            {/* Product Image */}
            <div className="aspect-square bg-gray-50 relative">
              {product.image_preview ? (
                <img
                  src={product.image_preview}
                  alt={product.item_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <span>No image</span>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-4">
              <h4 className="font-medium text-gray-900 truncate">
                {product.item_name}
              </h4>
              <p className="text-sm text-gray-500 mt-1">
                {product.item_category}
              </p>

              <div className="flex justify-between items-center mt-3">
                <span className="font-semibold">${product.item_price}</span>
                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
                  {product.item_sizes?.length || 0} sizes
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="border-t border-gray-100 px-4 py-3 flex justify-end space-x-2">
              <button
                onClick={() => handleEdit(product.draftId)}
                className="text-gray-600 hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-blue-50"
                aria-label="Edit"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(product.draftId)}
                className="text-gray-600 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-50"
                aria-label="Delete"
              >
                delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
