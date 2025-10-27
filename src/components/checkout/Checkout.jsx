import { useFormContext } from "react-hook-form";
import "../../styles/Checkbox.css";

export default function Checkout() {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext();

  const deliveryOption = watch("deliveryOption");

  return (
    <div className="flex-1">
      <div className=" space-y-6">
        <div className="bg-[#fff] p-4 rounded-[8px]">
          <div className="mb-3">
            <h3 className="text-[1.25rem] text-gray-700 font-semibold">
              Contact Information
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
            {/* Full Name */}
            <div className="flex flex-col">
              <label
                htmlFor="firstName"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                First Name
              </label>
              <input
                {...register("firstName", {
                  required: "First name is required",
                })}
                id="firstName"
                type="text"
                placeholder="John"
                className="input rounded-[12px] placeholder:text-gray-400"
              />
              <p className="text-red-500 text-sm">
                {errors.firstName?.message}
              </p>
            </div>

            {/* Last name */}
            <div className="flex flex-col">
              <label
                htmlFor="lastName"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Last Name
              </label>
              <input
                {...register("lastName", {
                  required: "Last name is required",
                })}
                id="lastName"
                type="text"
                placeholder="Doe"
                className="input rounded-[12px] placeholder:text-gray-400"
              />
              <p className="text-red-500 text-sm">{errors.lastName?.message}</p>
            </div>
          </div>

          <div className="mb-5">
            <div className="flex flex-col">
              <label
                htmlFor="address"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Address
              </label>
              <textarea
                {...register("address", {
                  required: "Address is required",
                })}
                className="w-full h-[90px] rounded-[12px] p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#009688]"
                placeholder="Briefly enter your contact address..."
              />

              <p className="text-red-500 text-sm">{errors.address?.message}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            {/* Email */}
            <div className="flex flex-col">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                {...register("email", {
                  required: "Email is required",
                })}
                id="email"
                type="email"
                placeholder="johndoe@email.com"
                className="input rounded-[12px] placeholder:text-gray-400"
              />
              <p className="text-red-500 text-sm">{errors.email?.message}</p>
            </div>

            {/* Phone */}
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
                className="input rounded-[12px] placeholder:text-gray-400"
              />
              <p className="text-red-500 text-sm">{errors.phone?.message}</p>
            </div>
          </div>

          <div className="flex items-center gap-[4px]">
            <input
              className="checkbox"
              type="checkbox"
              {...register("deliveryOption")}
            />
            <span className="text-sm text-gray-600 font-medium">
              Deliver to a different address
            </span>
          </div>
        </div>

        {deliveryOption && (
          <div className="bg-[#fff] p-4 rounded-[8px]">
            <div className="mb-3">
              <h3 className="text-[1.25rem] text-gray-700 font-semibold">
                Recepient Information
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
              {/* First Name */}
              <div className="flex flex-col">
                <label
                  htmlFor="receiversFirstName"
                  className="text-sm font-medium text-gray-700 mb-1"
                >
                  First Name
                </label>
                <input
                  {...register("receiversFirstName", {
                    required: deliveryOption ? "First name is required" : false,
                  })}
                  id="firstName"
                  type="text"
                  placeholder="John"
                  className="input rounded-[12px] placeholder:text-gray-400"
                />
                <p className="text-red-500 text-sm">
                  {errors.receiversFirstName?.message}
                </p>
              </div>

              {/* Last name */}
              <div className="flex flex-col">
                <label
                  htmlFor="recieversLastName"
                  className="text-sm font-medium text-gray-700 mb-1"
                >
                  Last Name
                </label>
                <input
                  {...register("receiversLastName", {
                    required: deliveryOption ? "Last name is required" : false,
                  })}
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  className="input rounded-[12px] placeholder:text-gray-400"
                />
                <p className="text-red-500 text-sm">
                  {errors.receiversLastName?.message}
                </p>
              </div>
            </div>

            <div className="mb-5">
              <div className="flex flex-col">
                <label
                  htmlFor="receiversAddress"
                  className="text-sm font-medium text-gray-700 mb-1"
                >
                  Address
                </label>
                <textarea
                  {...register("receiversAddress", {
                    required: deliveryOption ? "Address is required" : false,
                  })}
                  className="w-full h-[90px] rounded-[12px] p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#009688]"
                  placeholder="Briefly enter your contact address..."
                />

                <p className="text-red-500 text-sm">
                  {errors.receiversAddress?.message}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              {/* Email */}
              <div className="flex flex-col">
                <label
                  htmlFor="receiversEmail"
                  className="text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  {...register("receiversEmail", {
                    required: deliveryOption ? "Email is required" : false,
                  })}
                  id="email"
                  type="email"
                  placeholder="johndoe@email.com"
                  className="input rounded-[12px] placeholder:text-gray-400"
                />
                <p className="text-red-500 text-sm">
                  {errors.receiversEmail?.message}
                </p>
              </div>

              {/* Phone */}
              <div className="flex flex-col">
                <label
                  htmlFor="receiversPhone"
                  className="text-sm font-medium text-gray-700 mb-1"
                >
                  Phone Number
                </label>
                <input
                  {...register("receiversPhone", {
                    required: deliveryOption
                      ? "Phone number is required"
                      : false,
                  })}
                  id="phone"
                  type="tel"
                  placeholder="+234 801 234 5678"
                  className="input rounded-[12px] placeholder:text-gray-400"
                />
                <p className="text-red-500 text-sm">
                  {errors.receiversPhone?.message}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
