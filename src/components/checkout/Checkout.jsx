import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useCart } from "../Context/CartProvider";
import { supabase } from "../../supabase-client";
import { useVendorLocation } from "../Context/deliveryTime/VendorLocationProvider";
import CalculatePaymentSplit from "../Utils/CalculatePaymentSplit";
import { usePaystackPayment } from "../../hooks/usePaymentHook";
import { PAYSTACK_KEY } from "../verifyVendors/paystack-account/getBankCode";
import { verifyPayment } from "../cart/verifyPayment";
import { createOrderRecords } from "../Cart/createOrderRecords";

const schema = yup.object({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  address: yup.string().required("Address number is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().required("Phone number is required"),
  deliveryOption: yup.string().required("This input is required"),
});

export default function Checkout() {
  const [loading, setLoading] = useState(false);
  const { cartItems } = useCart();
  const { setVendors } = useVendorLocation();
  const initializePayment = usePaystackPayment();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const fetchVendors = async () => {
      const vendorIds = [...new Set(cartItems.map((item) => item.vendor_id))];

      const { data, error } = await supabase
        .from("vendors")
        .select("vendor_id, subaccount_code, business_name")
        .in("vendor_id", vendorIds);

      if (data) setVendors(data);

      if (cartItems.length > 0) {
        fetchVendors();
      }
    };
  }, [cartItems]);

  const handleCheckout = () => {
    setLoading(true);
    const paymentData = CalculatePaymentSplit(cartItems, vendors, 5);
    console.log("💰 Payment Summary:", paymentData.summary);

    const config = {
      reference: `order_${Date.now()}_${user.id}`,
      email: user.email,
      amount: paymentData.totalAmount, // Total amount in kobo
      publicKey: PAYSTACK_KEY,
      split_code: undefined, // We'll use subaccounts instead
      subaccount:
        paymentData.splits.length === 1
          ? paymentData.splits[0].subaccount
          : undefined,
      split:
        paymentData.splits.length > 1
          ? {
              type: "flat",
              bearer_type: "all-proportional", // Everyone bears charges proportionally
              subaccounts: paymentData.splits,
            }
          : undefined,
      metadata: {
        order_items: cartItems.length,
        vendor_count: vendors.length,
        platform_fee: paymentData.summary.platformFee,
        custom_fields: [
          {
            display_name: "Order Type",
            variable_name: "order_type",
            value: "multi_vendor_cart",
          },
        ],
      },
    };

    initializePayment(
      config,
      (transaction) => handlePaymentSuccess(transaction, paymentData),
      () => handlePaymentClose()
    );
  };

  const handlePaymentSuccess = async (transaction, paymentData) => {
    try {
      console.log("Payment callback received");
      console.log("Transaction:", transaction);
      console.log("Reference:", transaction.reference);

      const verificationResult = await verifyPayment(transaction.reference);

      if (!verificationResult.success) {
        alert(
          `Payment verification failed: ${verificationResult.error}\nReference: ${transaction.reference}`
        );
        return;
      }

      await createOrderRecords({
        reference: reference.reference,
        cartItems,
        vendors,
        paymentData,
        user,
      });

      showNotification(
        "Payment successful! Your orders have been created.",
        "success"
      );
      alert("🎉 Order successful!");

      navigate("/carts");
    } catch (error) {
      console.error("❌ Error handling payment success:", error);
      showNotification(
        "Payment was successful, but there was an issue creating your order. Please contact support.",
        "error"
      );
    }
  };

  const handlePaymentClose = () => {
    console.log("Payment modal closed");
    showNotification("Payment was cancelled", "info");
  };

  // const testVerification = async () => {
  //   console.log("🧪 Testing function...");

  //   const { data, error } = await supabase.functions.invoke("verify-payment", {
  //     body: { reference: "test_12345" },
  //   });

  //   console.log("Test data:", data);
  //   console.log("Test error:", error);
  // };

  return (
    <div className="flex-1">
      <form className=" space-y-6" onSubmit={handleSubmit(handleCheckout)}>
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
                {...register("fullName", {
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
              className="w-4 h-4"
              type="checkbox"
              {...register("deliveryOption", {
                required: "This input is required",
              })}
            />
            <span className="text-sm text-gray-600 font-medium">
              Deliver to a different address
            </span>
          </div>
        </div>

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
                htmlFor="firstName"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                First Name
              </label>
              <input
                {...register("fullName", {
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
        </div>
      </form>
    </div>
  );
}
