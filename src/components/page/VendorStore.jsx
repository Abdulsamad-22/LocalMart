import { FormProvider } from "react-hook-form";
import { useState } from "react";
import ProductSpecification from "../store/ProductSpecification";
import StockupStore from "../store/StockupStore";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { db, storage } from "../../firebase/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { addDoc, serverTimestamp } from "firebase/firestore";

export default function VendorStore() {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState(null);

  const schema = yup.object({
    productName: yup.string().required("Product name is required"),
    category: yup.string().required("Product category is required"),
    description: yup.string().max(1000).required("Please describe product"),
    price: yup.string().required("Price is required"),
  });

  const methods = useForm({
    resolver: yupResolver(schema),
  });

  async function onSubmit(data) {
    setIsUploading(true);
    try {
      const storageRef = ref(storage, `products/${Date.now()}-${preview.name}`);
      await uploadBytes(storageRef, preview);
      const imageUrl = await getDownloadURL(storageRef);

      const productDoc = {
        ...data,
        vendorId: user.uid,
        vendorBusinessName: user.displayName,
        image: imageUrl,
        name: data.productName,
        category: data.category,
        description: data.description,
        price: data.price,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, "products"), productDoc);
    } catch (error) {
      console.log(error);
    }
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
          <StockupStore />
          <ProductSpecification preview={preview} setPreview={setPreview} />
        </form>
      </FormProvider>
    </>
  );
}
