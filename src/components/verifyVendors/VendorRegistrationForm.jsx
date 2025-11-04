import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { supabase } from "../../supabase-client";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getBankCode } from "./paystack-account/getBankCode";
import { verifyAccountNumber } from "./paystack-account/verifyAccountNumber";
import { createSubaccount } from "./paystack-account/createSubaccount";
import { updateSubaccount } from "./paystack-account/updateSubaccount";
import {
  User,
  Storefront,
  CreditCard,
  ShieldCheck,
} from "@phosphor-icons/react";
import { useAuth } from "../Context/AuthProvider";
import "../../styles/RadioButton.css";
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
  // accountName: yup.string().required("Account name is required"),
  accountNumber: yup
    .string()
    .matches(/^[0-9]{10}$/, "Account number must be 10 digits")
    .required("Account number is required"),
  returnPolicy: yup.string().required("A return policy deadline is required"),
  deliveryDuration: yup.string().required("Delivery duration is required"),
  // idFile: yup.mixed().required("A valid ID is required"),
});

export default function VendorRegistrationForm() {
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const vendorData = location.state?.vendorData;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control,
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (!vendorData) return;

    if (vendorData) {
      reset({
        fullName: vendorData.full_name || "",
        email: vendorData.email || "",
        phone: vendorData.phone_number || "",
        businessName: vendorData.business_name || "",
        storeType: vendorData.store_type || "",
        businessAddress: vendorData.business_address || "",
        productCategory: vendorData.product_category || "",
        socials: vendorData.socials || "",
        bankName: vendorData.bank_name || "",
        accountNumber: vendorData.account_number || "",
        returnPolicy: vendorData.return_policy || "",
        deliveryDuration: vendorData.delivery_duration || "",
      });
    }
  }, []);

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

  // const [step, setStep] = useState(1);

  // const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
  // const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  async function onSubmit(formData) {
    try {
      setLoading(true);
      console.log("Submitting data:", formData);
      // const coordsAddress = await geocodeAddress(formData.businessAddress)

      if (!user) {
        console.error("No user found");
        throw new Error("Not authenticated - please log in");
      }

      const { data: existingVendor, error: checkError } = await supabase
        .from("vendors")
        .select("*")
        .eq("vendor_id", user.id)
        .single();

      if (checkError && checkError.code !== "PGRST116") {
        // PGRST116 = no rows returned
        console.error("Error checking existing vendor:", checkError);
        throw new Error("Failed to check vendor status");
      }

      const isUpdate = !!existingVendor;
      console.log(
        isUpdate ? "Updating existing vendor" : "Creating new vendor"
      );

      const bankCode = await getBankCode(formData.bankName);

      if (!bankCode) {
        alert("Bank not found. please check bank information and try again");
        return;
      }

      const verification = await verifyAccountNumber(
        formData.accountNumber,
        bankCode
      );

      if (!verification.success) {
        alert(`Account verification failed: ${verification.error}`);
        return;
      }

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
        bank_code: bankCode,
        account_number: formData.accountNumber,
        account_name: verification.accountName,
        return_policy: formData.returnPolicy,
        delivery_duration: formData.deliveryDuration,
        updated_at: new Date().toISOString(),
      };

      if (!isUpdate) {
        vendorData.created_at = new Date().toISOString();
      }

      let subaccountCode = existingVendor?.subaccount_code;

      // Check if bank details changed - need to create/update subaccount
      const bankDetailsChanged =
        isUpdate &&
        (existingVendor.bank_name !== formData.bankName ||
          existingVendor.account_number !== formData.accountNumber);

      if (!isUpdate || bankDetailsChanged) {
        console.log(
          bankDetailsChanged
            ? "Bank details changed, updating subaccount..."
            : "Creating new subaccount..."
        );

        // If updating and subaccount exists, we need to update it
        if (isUpdate && existingVendor.subaccount_code) {
          // Update existing subaccount
          const updateResult = await updateSubaccount(
            existingVendor.subaccount_code,
            {
              business_name: vendorData.business_name,
              settlement_bank: bankCode,
              account_number: vendorData.account_number,
              primary_contact_email: vendorData.email,
              primary_contact_name: verification.accountName,
              primary_contact_phone: vendorData.phone_number,
            }
          );

          if (!updateResult.success) {
            alert(`Failed to update payment account: ${updateResult.error}`);
            return;
          }

          subaccountCode = existingVendor.subaccount_code;
          console.log(`Subaccount updated: ${subaccountCode}`);
        } else {
          // Create new subaccount
          const subaccountResult = await createSubaccount(
            vendorData,
            bankCode,
            verification.accountName
          );

          if (!subaccountResult.success) {
            alert(`Failed to setup payment account: ${subaccountResult.error}`);
            return;
          }

          subaccountCode = subaccountResult.subaccountCode;
          console.log(`Subaccount created: ${subaccountCode}`);
        }
      } else {
        console.log("Using existing subaccount:", subaccountCode);
      }

      vendorData.subaccount_code = subaccountCode;
      vendorData.payment_setup_complete = true; // stiil in view to add to table

      if (isUpdate) {
        // Update existing vendor - only update changed fields
        const { error } = await supabase
          .from("vendors")
          .update([vendorData])
          .eq("vendor_id", user.id)
          .select();

        if (error) {
          console.error("Error updating vendor:", error);
          alert("Failed to update vendor information. Please try again.");
          return;
        }

        console.log("Vendor updated successfully!");
        alert("Your vendor information has been updated successfully!");
      } else {
        // Add new vendor information
        const { error } = await supabase.from("vendors").insert([vendorData]);

        if (error) {
          // Check for duplicate key error
          if (error.code === "23505") {
            console.error("Duplicate vendor detected");
            alert("A vendor account already exists for this user.");
            return;
          }

          console.error("Error creating vendor:", error);
          alert("Failed to create vendor account. Please try again.");
          return;
        }

        console.log("Vendor created successfully!");
        alert("Registration successful! Your payment account is ready.");
      }

      navigate("/my-shop");
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setLoading(false);
      reset(undefined, { keepDefaultValues: false });
    }
    // reset();
  }

  return (
    <div className="flex flex-col items-center justify-center px-6 my-12">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-semibold text-[#1f2937]">
          Vendor Registration
        </h2>
        <p className="text-gray-700 text-sm">
          Register your business and start selling on LocalMart Now!!
        </p>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        // onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
        noValidate
        className="w-full md:w-[50%] mx-auto"
      >
        {/* Personal Information */}

        <div className="mb-4 rounded-[10px] bg-white p-6 shadow">
          <div className="flex items-start gap-2 mb-6">
            <User size={24} />
            <div>
              <h2 className="font-semibold my-0 py-0">Personal Information</h2>
              <p className="text-sm text-gray-400 my-0 py-0">
                Tell us about yourself
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="flex flex-col">
              <label
                htmlFor="fullName"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Full Name
              </label>
              <input
                {...register("fullName", {
                  required: "Full name is required",
                })}
                id="fullName"
                type="text"
                placeholder="John Doe"
                className="input rounded-lg placeholder:text-gray-400"
              />
              <p className="text-red-500 text-sm">{errors.fullName?.message}</p>
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <input
                {...register("email", {
                  required: "Email is required",
                })}
                id="email"
                type="email"
                placeholder="johndoe@email.com"
                className="input rounded-lg placeholder:text-gray-400"
              />
              <p className="text-red-500 text-sm">{errors.email?.message}</p>
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="phone"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Phone Number
              </label>
              <input
                {...register("phone", {
                  required: "Phone number is required",
                })}
                id="phone"
                type="tel"
                placeholder="+234 801 234 5678"
                className="input rounded-lg placeholder:text-gray-400"
              />
              <p className="text-red-500 text-sm">{errors.phone?.message}</p>
            </div>
          </div>
        </div>

        {/* Business Information */}
        <div className="mb-4 rounded-[10px] bg-white p-6 shadow">
          <div className="flex items-start gap-2 mb-6">
            <Storefront size={24} />
            <div>
              <h3 className="font-semibold my-0 py-0">Business Information</h3>
              <p className="text-sm text-gray-400 my-0 py-0">
                Details about your business
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1">
                Business Name
              </label>
              <input
                {...register("businessName", {
                  required: "Business name is required",
                })}
                placeholder="Business Name"
                className="input rounded-lg placeholder:text-gray-400"
              />
              <p className="text-red-500 text-sm">
                {errors.businessName?.message}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1">
                Business Type
              </label>
              <select
                {...register("businessType")}
                className="input rounded-lg placeholder:text-gray-400"
              >
                <option value="">Select Business Type</option>
                <option value="individual">Individual</option>
                <option value="registered">Registered Business</option>
                <option value="company">Company</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1">
                Business Category
              </label>
              <input
                {...register("productCategory")}
                placeholder="What will you sell?"
                className="input rounded-lg placeholder:text-gray-400"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1">
                Social Link
              </label>
              <input
                {...register("socials")}
                placeholder="Website or Social Link (Optional)"
                className="input rounded-lg placeholder:text-gray-400"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Store Type
              </label>
              <div className="flex gap-6">
                {[
                  { value: "physical", label: "Physical Store" },
                  { value: "online", label: "Online Store" },
                  { value: "both", label: "Both" },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1"
                  >
                    <input
                      type="radio"
                      value={opt.value}
                      {...register("storeType")}
                      className="custom-radio"
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Business Address
              </label>
              <input
                {...register("businessAddress")}
                placeholder={placeholder}
                className="input rounded-lg placeholder:text-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Business policies */}
        <div className="bg-white mb-4 rounded-[10px] p-6 shadow">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck size={24} />
              <h4 className="text-lg font-semibold text-gray-800">
                Business Policies
              </h4>
            </div>

            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Return Policy Duration
              </label>
              <select
                {...register("returnPolicy")}
                className="input rounded-lg"
              >
                <option value="">Select Return Policy</option>
                <option value="3">3 days return</option>
                <option value="7">7 days return</option>
                <option value="14">14 days return</option>
                <option value="30">30 days return</option>
              </select>
              <p className="text-sm text-gray-500 mt-1">
                Specify how many days customers have to return a product.
              </p>
              <p className="text-red-500 text-sm">
                {errors.returnPolicy?.message}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1">
                Average Delivery Duration
              </label>
              <input
                {...register("deliveryDuration")}
                placeholder="e.g. 3–5 business days"
                className="input rounded-lg placeholder:text-gray-400"
              />
              <p className="text-sm text-gray-500 mt-1">
                Estimated number of days required to deliver an order.
              </p>
              <p className="text-red-500 text-sm">
                {errors.deliveryDuration?.message}
              </p>
            </div>
          </div>
        </div>

        {/* Bank account Information */}
        <div className="p-6 shadow rounded-[10px] bg-white">
          <div className="flex items-start gap-2 mb-6">
            <CreditCard size={24} />
            <div>
              <h2 className="font-semibold my-0 py-0">Bank Details</h2>
              <p className="text-sm text-gray-400 my-0 py-0">
                Details about your payment account
              </p>
            </div>
          </div>
          <div className="md:col-span-2 gap-6 mb-8">
            <div>
              <label
                htmlFor="bank-name"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Bank Name
              </label>
              <input
                {...register("bankName")}
                placeholder="Bank Name"
                className="input rounded-lg placeholder:text-gray-400"
              />
              <p className="text-red-500 text-sm">{errors.bankName?.message}</p>
            </div>

            <div>
              <label
                htmlFor="account-number"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Account number
              </label>
              <input
                {...register("accountNumber")}
                placeholder="Account Number"
                className="input rounded-lg placeholder:text-gray-400"
              />
              <p className="text-red-500 text-sm">
                {errors.accountNumber?.message}
              </p>
            </div>
          </div>

          {/* Submit */}
          <button
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
        </div>
      </form>
    </div>
  );
}
