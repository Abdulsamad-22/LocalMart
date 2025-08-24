import { useFormContext } from "react-hook-form";
import { supabase } from "../../supabase-client";
import { Trash, PencilSimple, CurrencyNgn } from "@phosphor-icons/react";

export default function DraftProductList({
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

    // Scroll to top feature
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = (draftId) => {
    setDraftProducts((drafts) => drafts.filter((p) => p.draftId !== draftId));
  };

  async function uploadImage(file) {
    if (!file) throw new Error("No file provided");

    const filePath = `${file.name}-${Date.now()}`;

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: publicData, error: publicError } = supabase.storage
      .from("product-images")
      .getPublicUrl(filePath);

    if (publicError) {
      console.error("Error getting public URL:", publicError.message);
      return null;
    }
    return publicData.publicUrl;
  }

  async function submitAllDrafts() {
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError || !user) throw new Error("Not authenticated");

      // Process all drafts with image uploads
      const productsToInsert = await Promise.all(
        draftProducts.map(async (draft) => {
          let imageUrl = draft.image_url;

          // Upload new image if it's a File object (not yet uploaded)
          if (
            draft.image_preview &&
            draft.image_preview.startsWith("data:image")
          ) {
            // Convert base64 to File
            const response = await fetch(draft.image_preview);
            const blob = await response.blob();
            const file = new File(
              [blob],
              draft.image_metadata?.name || "product-image.jpg",
              { type: draft.image_metadata?.type || "image/jpeg" }
            );

            imageUrl = await uploadImage(file);
          }

          return {
            ...draft,
            image_url: imageUrl,
            updated_at: new Date().toISOString(),
          };
        })
      );

      // Batch insert all products
      const { data: insertedProducts, error } = await supabase
        .from("products")
        .insert(productsToInsert)
        .select();

      if (error) throw error;

      console.log("Successfully inserted:", insertedProducts);
      setDraftProducts([]); // Clear drafts after successful submission
      return insertedProducts;
    } catch (err) {
      console.error("Submission failed:", err);
      throw err; // Re-throw for error handling in calling component
    }
  }
  return (
    <div className="px-4 md:px-12">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center pb-2 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">
            Draft Products ({draftProducts.length})
          </h3>
          <button
            onClick={submitAllDrafts}
            className="text-[1rem] text-gray-500"
          >
            Submit all
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {draftProducts.map((product) => (
          <div
            key={product.draftId}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden"
          >
            {/* Product Image */}
            <div className="bg-gray-50 relative w-full md:w-full h-auto md:h-[320px]">
              {product.image_preview ? (
                <img
                  src={product.image_preview}
                  alt={product.item_name}
                  className=" w-full h-full object-cover"
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

              <p className="text-sm text-gray-900 mt-1">
                {product.item_units} units
              </p>

              <div className="flex justify-between items-center mt-3">
                <span className="font-semibold flex items-center">
                  <CurrencyNgn size={20} />
                  {Number(product.item_price).toLocaleString("en-NG")}
                </span>
                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
                  {product.item_sizes?.length || 0} sizes
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="border-t border-gray-100 px-4 py-2 md:py-3 flex justify-center md:justify-end space-x-2">
              <button
                onClick={() => handleEdit(product.draftId)}
                className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-blue-50"
                aria-label="Edit"
              >
                <PencilSimple size={20} />
                Edit
              </button>
              <button
                onClick={() => handleDelete(product.draftId)}
                className="flex items-center gap-1 text-gray-600 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-50"
                aria-label="Delete"
              >
                <Trash size={20} />
                delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
