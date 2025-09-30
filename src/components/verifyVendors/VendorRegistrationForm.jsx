import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { supabase } from "../../supabase-client";
import { useNavigate } from "react-router-dom";
// import { geocodeAddress } from "../deliveryTime/GeocodeVendorAddress";

const schema = yup.object({
  fullName: yup.string().required("Full name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().required("Phone number is required"),
  businessName: yup.string().required("Business name is required"),
  storeType: yup.string().required("Store type is required"),
  businessAddress: yup.string().required("Business address is required"),
  productCategory: yup.string().required("Product category is required"),
  socials: yup.string().required("A link to any business socials is required"),
  bankName: yup.string().required("Bank name is required"),
  accountNumber: yup
    .string()
    .matches(/^[0-9]{10}$/, "Account number must be 10 digits")
    .required("Account number is required"),
  // idFile: yup.mixed().required("A valid ID is required"),
});

export default function VendorRegistrationForm() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const selectedStoreType = useWatch({
    control,
    name: "storeType",
  });

  const placeholder =
    selectedStoreType === "online"
      ? "Enter reference address (e.g house address)"
      : selectedStoreType
      ? "Enter store address"
      : "Business Address";

  async function onSubmit(formData) {
    console.log("Submitting data:", formData);
    // const coordsAddress = await geocodeAddress(formData.businessAddress)
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    // const { data: user, error: authError } = await supabase.auth.getUser();
    if (authError) {
      console.error("Auth error:", authError);
      throw new Error(`Authentication error: ${authError.message}`);
    }

    if (!user) {
      console.error("No user found");
      throw new Error("Not authenticated - please log in");
    }

    console.log("authenticated user", user.id);

    try {
      const vendorData = {
        vendor_id: user.id,
        full_name: formData.fullName,
        email: formData.email,
        phone_number: formData.phone,
        business_name: formData.businessName,
        store_type: formData.storeType,
        // vendor_coords: coordsAddress,
        business_address: formData.businessAddress,
        product_category: formData.productCategory,
        socials: formData.socials,
        bank_name: formData.bankName,
        account_number: formData.accountNumber,
        created_at: new Date().toISOString(),
      };

      const { data: insertedData, error } = await supabase
        .from("vendors")
        .insert([vendorData])
        .select();

      if (error) {
        console.error("Error creating vendor:", error.message);
      } else {
        console.log("Inserted vendor:", insertedData);
        navigate("/vendorStore");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
    }
    reset();
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
            {...register("productCategory")}
            placeholder="What will you sell?"
            className="input"
          />
          <p className="text-red-500 text-sm">
            {errors.productCategory?.message}
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

      <div className="mb-6">
        <label className="block mb-2 font-medium">Store Type</label>

        <div className="flex items-center gap-4 mb-3">
          {[
            { value: "physical", label: "Physical Store Only" },
            { value: "online", label: "Online Store Only" },
            { value: "both", label: "Both Physical and Online" },
          ].map((option) => (
            <label key={option.value} className="flex items-center gap-1">
              <input
                type="radio"
                value={option.value}
                {...register("storeType")}
                className="text-[#009688] focus:ring-[#009688]"
              />
              <span>{option.label}</span>
            </label>
          ))}
          <p className="text-red-500 text-sm">{errors.storeType?.message}</p>
        </div>

        <input
          {...register("businessAddress")}
          placeholder={placeholder}
          className="input"
          disabled={!selectedStoreType}
        />
        <p className="text-red-500 text-sm">
          {errors.businessAddress?.message}
        </p>
      </div>

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
            ? "flex items-center gap-2 opacity-70 cursor-not-allowed"
            : "hover:from-[#00897B] hover:to-[#005B4F]"
        }`}
      >
        {isSubmitting ? (
          <>
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            Processing...
          </>
        ) : (
          "Submit Application"
        )}
      </button>
    </form>
  );
}
