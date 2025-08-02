import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { db, storage } from "../../firebase/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const schema = yup.object({
  fullName: yup.string().required("Full name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().required("Phone number is required"),
  businessName: yup.string().required("Business name is required"),
  businessType: yup.string().required("Business type is required"),
  businessAddress: yup.string().required("Business address is required"),
  productCategory: yup.string().required("Product category is required"),
  socials: yup.string().required("A link to any business socials is required"),
  bankName: yup.string().required("Bank name is required"),
  accountNumber: yup
    .string()
    .matches(/^[0-9]{10}$/, "Account number must be 10 digits")
    .required("Account number is required"),
  idFile: yup.mixed().required("A valid ID is required"),
});

export default function VendorRegistrationForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  async function onSubmit(data) {
    try {
      let idFileUrl = null;
      if (data.idFile && data.idFile[0]) {
        const file = data.idFile[0];
        const storageRef = ref(
          storage,
          `vendor-ids/${Date.now()}-${file.name}`
        );
        await uploadBytes(storageRef, file);
        idFileUrl = await getDownloadURL(storageRef);
      }

      const vendorData = {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        businessName: data.businessName,
        businessType: data.businessType,
        businessAddress: data.businessAddress,
        productCategory: data.productCategory,
        socials: data.socials,
        bankName: data.bankName,
        accountNumber: data.accountNumber,
        idFileUrl,
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, "vendors"), vendorData);

      console.log("Vendor registered with ID:", docRef.id);
      alert("Registration successful!");
      reset();
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Registration failed: " + error.message);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-4xl mx-auto p-6 bg-white shadow rounded-lg my-12"
    >
      <h2 className="text-2xl font-semibold text-[#1f2937] mb-6">
        Vendor Registration
      </h2>

      {/* Personal Details */}
      <h3 className="text-[1.25rem] mb-2">Personal Details</h3>
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div>
          <input
            {...register("fullName")}
            placeholder="Full Name"
            className="input"
          />
          <p className="text-red-500 text-sm">{errors.fullName?.message}</p>
        </div>

        <div>
          <input
            {...register("email")}
            placeholder="Email Address"
            className="input"
          />
          <p className="text-red-500 text-sm">{errors.email?.message}</p>
        </div>

        <div>
          <input
            {...register("phone")}
            placeholder="Phone Number"
            className="input"
          />
          <p className="text-red-500 text-sm">{errors.phone?.message}</p>
        </div>
      </div>

      {/* Business Info */}
      <h2 className="text-[1.25rem] mb-2">Business Details</h2>
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div>
          <input
            {...register("businessName")}
            placeholder="Business Name"
            className="input"
          />
          <p className="text-red-500 text-sm">{errors.businessName?.message}</p>
        </div>
        <div>
          <select {...register("businessType")} className="input">
            <option value="">Select Business Type</option>
            <option value="individual">Individual</option>
            <option value="registered">Registered Business</option>
            <option value="company">Company</option>
          </select>
          <p className="text-red-500 text-sm">{errors.businessType?.message}</p>
        </div>

        <div>
          <input
            {...register("businessAddress")}
            placeholder="Business Address"
            className="input"
          />
          <p className="text-red-500 text-sm">
            {errors.businessAddress?.message}
          </p>
        </div>

        <div>
          <input
            {...register("socials")}
            placeholder="Website or Social Link (Optional)"
            className="input"
          />
          <p className="text-red-500 text-sm">{errors.socials?.message}</p>
        </div>
      </div>

      <input
        {...register("productCategory")}
        placeholder="What will you sell?"
        className="input mb-6"
      />
      <p className="text-red-500 text-sm">{errors.productCategory?.message}</p>

      {/* Bank Details */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div>
          <input
            {...register("bankName")}
            placeholder="Bank Name"
            className="input"
          />
          <p className="text-red-500 text-sm">{errors.bankName?.message}</p>
        </div>
        <div>
          <input
            {...register("accountNumber")}
            placeholder="Account Number"
            className="input"
          />
          <p className="text-red-500 text-sm">
            {errors.accountNumber?.message}
          </p>
        </div>
      </div>

      {/* Uploads */}
      {/* <h2 className="text-[1.25rem] mb-2">Verification</h2>
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block mb-1">Upload Valid ID</label>
          <input type="file" {...register("idFile")} className="input" />
          <p className="text-red-500 text-sm">{errors.idFile?.message}</p>
        </div>
        <div>
          <label className="block mb-1">CAC Document (Optional)</label>
          <input type="file" {...register("cacFile")} className="input" />
        </div>
      </div> */}

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`bg-gradient-to-r from-[#009688] to-[#00695C] text-white px-6 py-3 rounded font-semibold ${
          isSubmitting
            ? "opacity-70 cursor-not-allowed"
            : "hover:from-[#00897B] hover:to-[#005B4F]"
        }`}
      >
        {isSubmitting ? "Processing..." : "Submit Application"}
      </button>
    </form>
  );
}
