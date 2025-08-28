import { FormProvider, useFormContext } from "react-hook-form";
import { useEffect, useState } from "react";
import ProductSpecification from "../store/ProductSpecification";
import StockupStore from "../store/StockupStore";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import DraftProductList from "../store/DraftProductList";

export default function VendorStore() {
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
  });

  const methods = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (productData) => {
    const productDoc = {
      image_preview: preview,
      image_url: imageFile
        ? {
            name: imageFile.name,
            type: imageFile.type,
            size: imageFile.size,
          }
        : null,
      item_name: productData.productName,
      item_category: productData.category,
      item_description: productData.description,
      item_sizes: selectedSizes,
      item_colors: selectedColors,
      item_units: productData.units,
      item_price: productData.price,
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
      // Check for duplicate by product name (case-insensitive)
      const isDuplicate = draftProducts.some(
        (draft) =>
          draft.item_name.toLowerCase().trim() ===
          productData.productName.toLowerCase().trim()
      );

      if (!isDuplicate) {
        setDraftProducts((prev) => [...prev, productDoc]);
      } else {
        alert("This product already exists in drafts!");
        return;
      }
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
        <h2>Stock up my store</h2>
      </div>

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
