import { FormProvider, useFormContext } from "react-hook-form";
import { useState } from "react";
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
  const [draftProducts, setDraftProducts] = useState([]);
  const [editingDraftId, setEditingDraftId] = useState(null);

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
      image_url: imageFile,
      item_name: productData.productName,
      item_category: productData.category,
      item_description: productData.description,
      item_sizes: selectedSizes,
      item_colors: selectedColors,
      item_units: productData.units,
      item_price: productData.price,
      draftId: editingDraftId || Date.now().toString(), // Keep ID if editing
    };

    // Editing existing product
    if (editingDraftId) {
      setDraftProducts((prev) => [...prev, productDoc]);
      setEditingDraftId(null); // Exit edit mode
    }
    // Adding new product
    else {
      const isDuplicate = draftProducts.some(
        (draft) => draft.item_name === productData.productName
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
