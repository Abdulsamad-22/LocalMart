import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

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
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    console.log("Validated Vendor Data:", data);
    console.log(errors);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-4xl mx-auto p-6 bg-white shadow rounded-lg space-y-6 my-12"
    >
      <h2 className="text-2xl font-semibold text-[#1f2937]">
        Vendor Registration
      </h2>

      {/* Personal Details */}
      <h2 className="text-[1.25rem]">Personal Details</h2>
      <div className="grid md:grid-cols-2 gap-4">
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
      <h2 className="text-[1.25rem]">Business Details *</h2>
      <div className="grid md:grid-cols-2 gap-4">
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
        className="input"
      />
      <p className="text-red-500 text-sm">{errors.productCategory?.message}</p>

      {/* Bank Details */}
      <div className="grid md:grid-cols-2 gap-4">
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
      <h2 className="text-[1.25rem]">Verification</h2>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1">Upload Valid ID</label>
          <input type="file" {...register("idFile")} className="input" />
          <p className="text-red-500 text-sm">{errors.idFile?.message}</p>
        </div>
        <div>
          <label className="block mb-1">CAC Document (Optional)</label>
          <input type="file" {...register("cacFile")} className="input" />
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="bg-gradient-to-r from-[#009688] to-[#00695C] text-white px-6 py-3 rounded font-semibold"
      >
        Submit Application
      </button>
    </form>
  );
}
