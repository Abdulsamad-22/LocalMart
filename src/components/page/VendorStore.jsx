import { FormProvider, useFormContext } from "react-hook-form";
import { useState } from "react";
import ProductSpecification from "../store/ProductSpecification";
import StockupStore from "../store/StockupStore";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { supabase } from "../../supabase-client";

export default function VendorStore() {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const schema = yup.object({
    productName: yup.string().required("Product name is required"),
    category: yup.string().required("Product category is required"),
    description: yup.string().max(1000).required("Please describe product"),
    price: yup.string().required("Price is required"),
  });

  const methods = useForm({
    resolver: yupResolver(schema),
  });

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

  async function onSubmit(productData) {
    try {
      let imageUrl = null;
      if (!imageFile) {
        console.log("no file was selected");
        return;
      }

      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
        console.log("Uploaded image URL:", imageUrl);
      }

      const productDoc = {
        vendor_id: user.uid,
        image_url: imageUrl,
        item_name: productData.productName,
        item_category: productData.category,
        item_description: productData.description,
        item_price: productData.price,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      const { data: insertedProd, error: productError } = await supabase
        .from("products")
        .insert([productDoc])
        .select();

      if (productError) {
        console.log("Error uploading product", productError.message);
      } else {
        console.log("inserted product", insertedProd);
      }
      console.log("Success:", insertedProd);
      setImageFile(null);
    } catch (err) {
      console.error("submission failed:", err);
    }
    methods.reset();
  }

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
            preview={preview}
            setPreview={setPreview}
            setImageFile={setImageFile}
          />
        </form>
      </FormProvider>
    </>
  );
}
