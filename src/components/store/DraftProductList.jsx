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
  editingDraftId,
}) {
  const { reset } = useFormContext();
  const handleEdit = (draft_id) => {
    const draft = draftProducts.find((p) => p.draft_id === draft_id);
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

    setEditingDraftId(draft_id);
    console.log(editingDraftId);
    setDraftProducts((prev) => prev.filter((p) => p.draft_id !== draft_id));

    // Scroll to top feature
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = (draft_id) => {
    setDraftProducts((drafts) => drafts.filter((p) => p.draft_id !== draft_id));
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
    if (!draftProducts || draftProducts.length === 0) {
      alert("No products to submit");
      return;
    }

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        console.error("Auth error:", authError);
        throw new Error(`Authentication error: ${authError.message}`);
      }

      if (!user) {
        console.error("No user found");
        throw new Error("Not authenticated - please log in");
      }

      // Process all drafts with image uploads
      const productsToInsert = await Promise.all(
        draftProducts.map(async (draft, index) => {
          let imageUrl = null;

          // Upload new image if it's a File object (not yet uploaded)
          if (
            draft.image_preview &&
            draft.image_preview.startsWith("data:image")
          ) {
            try {
              // Convert base64 to File
              const response = await fetch(draft.image_preview);
              const blob = await response.blob();
              const file = new File(
                [blob],
                draft.image_url?.name || `product-${draft.draft_id}.jpg`,
                { type: draft.image_url?.type || "image/jpeg" }
              );

              imageUrl = await uploadImage(file);
            } catch (imageError) {
              console.error(
                `Image upload failed for ${draft.item_name}:`,
                imageError
              );
              imageUrl = null;
            }
          } else if (typeof draft.image_url === "string") {
            // Image already uploaded (existing URL)
            imageUrl = draft.image_url;
            console.log(`Using existing image URL for ${draft.item_name}`);
          }

          const productForDB = {
            vendor_id: user.id,
            image_url: imageUrl,
            item_name: draft.item_name,
            item_category: draft.item_category,
            item_description: draft.item_description,
            item_sizes: draft.item_sizes,
            item_colors: draft.item_colors,
            item_units: draft.item_units,
            item_price: parseFloat(draft.item_price),
            updated_at: new Date().toISOString(),
          };

          if (!productForDB.item_name || !productForDB.item_category) {
            console.error(
              `Invalid product data for ${draft.item_name}:`,
              productForDB
            );
            throw new Error(
              `Missing required fields for product: ${draft.item_name}`
            );
          }

          return productForDB;
        })
      );

      // Batch insert all products
      const { data: insertedProducts, error: insertError } = await supabase
        .from("products")
        .insert(productsToInsert)
        .select();

      if (insertError) {
        console.error("Database insert error:", insertError);
        console.error("Error details:", {
          message: insertError.message,
          details: insertError.details,
          hint: insertError.hint,
          code: insertError.code,
        });
        throw new Error(`Database error: ${insertError.message}`);
      }

      console.log("Successfully inserted:", insertedProducts);
      setDraftProducts([]); // Clear drafts after successful submission
      alert(`Successfully added ${insertedProducts.length} product(s)!`);
    } catch (err) {
      console.error("Submission failed:", err);
      throw err; // Re-throw for error handling in calling component
    }
    console.log("submit all clicked");
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
            key={product.draft_id}
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
                onClick={() => handleEdit(product.draft_id)}
                className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-blue-50"
                aria-label="Edit"
              >
                <PencilSimple size={20} />
                Edit
              </button>
              <button
                onClick={() => handleDelete(product.draft_id)}
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
