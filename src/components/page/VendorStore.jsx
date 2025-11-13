import { FormProvider, Watch } from "react-hook-form";
import { useEffect, useState } from "react";
import ProductSpecification from "../store/ProductSpecification";
import StockupStore from "../store/StockupStore";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import DraftProductList from "../store/DraftProductList";
import { useProduct } from "../Context/ProductProvider";
import { PencilSimple } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabase-client";
import { useAuth } from "../Context/AuthProvider";

export default function VendorStore() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { editingProduct, setEditingProduct, setProducts } = useProduct();
  const [preview, setPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [editingDraftId, setEditingDraftId] = useState(null);
  const [draftProducts, setDraftProducts] = useState(() => {
    const saved = localStorage.getItem("draftProducts");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("draftProducts", JSON.stringify(draftProducts));
  }, [draftProducts]);

  const schema = yup.object({
    productName: yup.string().required("Product name is required"),
    category: yup.string().required("Product category is required"),
    description: yup.string().max(1000).required("Please describe product"),
    price: yup.string().required("Price is required"),
    units: yup.string().required("Available Product unit is required"),

    selectedImage: yup
      .object({
        name: yup.string().required(),
        data: yup.string().required(),
        type: yup.string().required(),
      })
      .nullable()
      .required("Product image is required"),
  });

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      productName: "",
      category: "",
      description: "",
      price: "",
      units: "",
      selectedImage: null,
    },
  });

  useEffect(() => {
    if (editingProduct) {
      console.log("Populating form with:", editingProduct);

      methods.reset({
        productName: editingProduct.item_name || "",
        category: editingProduct.item_category || "",
        description: editingProduct.item_description || "",
        units: editingProduct.item_units || "",
        price: editingProduct.item_price || "",
      });

      setPreview(editingProduct.image_preview || null);
      setImageFile(editingProduct.image_url || null);

      // Parse and set sizes
      if (editingProduct.sizes) {
        try {
          const sizesArray =
            typeof editingProduct.sizes === "string"
              ? JSON.parse(editingProduct.sizes)
              : editingProduct.sizes;
          setSelectedSizes(Array.isArray(sizesArray) ? sizesArray : []);
        } catch (e) {
          console.error("Error parsing sizes:", e);
          setSelectedSizes([]);
        }
      } else {
        setSelectedSizes([]);
      }

      // Parse and set colors
      if (editingProduct.colors) {
        try {
          const colorsArray =
            typeof editingProduct.colors === "string"
              ? JSON.parse(editingProduct.colors)
              : editingProduct.colors;
          setSelectedColors(Array.isArray(colorsArray) ? colorsArray : []);
        } catch (e) {
          console.error("Error parsing colors:", e);
          setSelectedColors([]);
        }
      } else {
        setSelectedColors([]);
      }
    }
  }, [editingProduct, methods.reset]);

  const uploadImage = async (file) => {
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
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    reset({
      productName: "",
      category: "",
      description: "",
      units: "",
      price: "",
    });
    setPreview(null);
    setSelectedSizes([]);
    setSelectedColors([]);
    navigate(-1);
  };

  const onSubmit = async (formData) => {
    try {
      if (editingProduct) {
        let imageUrl = formData.image_url; // default to existing image

        if (
          formData.image_preview &&
          formData.image_preview.startsWith("data:image")
        ) {
          try {
            const response = await fetch(formData.image_preview);
            const blob = await response.blob();
            const file = new File([blob], `product-${editingProduct.id}.jpg`, {
              type: "image/jpeg",
            });
            imageUrl = await uploadImage(file);
          } catch (uploadError) {
            console.error("Image upload failed:", uploadError);
            imageUrl = null;
          }
        } else if (typeof draft.image_url === "string") {
          // Image already uploaded (existing URL)
          imageUrl = draft.image_url;
        }

        const productData = {
          vendor_id: user.id,
          image_url: imageUrl,
          item_name: formData.item_name,
          item_category: formData.item_category,
          item_description: formData.item_description,
          item_sizes: formData.item_sizes,
          item_colors: formData.item_colors,
          item_units: formData.item_units,
          item_price: formData.item_price,
          updated_at: new Date().toISOString(),
        };

        const { data, error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", editingProduct.id)
          .select();

        if (error) {
          console.error("Error updating:", error);
          alert("Failed to update product");
          return;
        }

        alert(`Updating product ${data.id} successful`);

        setProducts.map((p) =>
          p.id === editingProduct.id ? { ...p, ...data } : p
        );
      } else {
        const productDoc = {
          image_preview: preview,
          image_url: imageFile
            ? {
                name: imageFile.name,
                type: imageFile.type,
                size: imageFile.size,
              }
            : null,
          item_name: formData.productName,
          item_category: formData.category,
          item_description: formData.description,
          item_sizes: selectedSizes,
          item_colors: selectedColors,
          item_units: formData.units,
          item_price: formData.price,
          draft_id: editingDraftId || Date.now().toString(), // Keep ID if editing
        };

        // Editing existing product
        if (editingDraftId) {
          setDraftProducts((prev) => {
            // Remove the old version and add the updated version
            const filtered = prev.filter(
              (draft) => draft.draft_id !== editingDraftId
            );
            return [...filtered, productDoc];
          });
          console.log(editingDraftId);
          setEditingDraftId(null); // Exit edit mode
        }
        // Adding new product
        else {
          // Check for duplicate by product name
          const isDuplicate = draftProducts.some(
            (draft) =>
              draft.item_name.toLowerCase().trim() ===
              formData.productName.toLowerCase().trim()
          );

          if (!isDuplicate) {
            setDraftProducts((prev) => [...prev, productDoc]);
          } else {
            alert("This product already exists in drafts!");
            return;
          }
        }
      }
    } catch (error) {
      console.error("error uploading products to draft", error);
    }

    // Reset form
    methods.reset();
    setImageFile(null);
    setPreview(null);
    setSelectedColors([]);
    setSelectedSizes([]);
  };

  return (
    <>
      <div className="bg-[#009688] text-center text-[1.5rem] text-[#fff] p-8 mt-[5rem]">
        <h2>Stock my store</h2>
      </div>
      {/* Edit Mode Indicator */}
      {editingProduct && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PencilSimple size={20} className="text-blue-600" />
              <span className="font-semibold text-blue-900">
                Editing:{" "}
                {editingProduct.item_name || editingProduct.product_name}
              </span>
            </div>
            <button
              onClick={handleCancelEdit}
              className="text-sm text-blue-700 hover:text-blue-900 underline"
            >
              Cancel Edit
            </button>
          </div>
        </div>
      )}

      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="w-full flex flex-col md:flex-row items-start gap-8 my-12 px-12"
        >
          {/* <input type="file" onChange={handleFile} /> */}
          <StockupStore />
          <ProductSpecification
            setImageFile={setImageFile}
            selectedColors={selectedColors}
            setSelectedColors={setSelectedColors}
            selectedSizes={selectedSizes}
            setSelectedSizes={setSelectedSizes}
            setPreview={setPreview}
            preview={preview}
          />
        </form>
        <div>
          <DraftProductList
            draftProducts={draftProducts}
            setDraftProducts={setDraftProducts}
            setImageFile={setImageFile}
            imageFile={imageFile}
            setPreview={setPreview}
            selectedSizes={selectedSizes}
            selectedColors={selectedColors}
            setSelectedSizes={setSelectedSizes}
            setSelectedColors={setSelectedColors}
            editingDraftId={editingDraftId}
            setEditingDraftId={setEditingDraftId}
          />
        </div>
      </FormProvider>
    </>
  );
}
