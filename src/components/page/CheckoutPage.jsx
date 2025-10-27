import Checkout from "../checkout/Checkout";
import CheckoutSummary from "../checkout/CheckoutSummary";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState, useEffect } from "react";
import { FormProvider } from "react-hook-form";
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
import { useAuth } from "../Context/AuthProvider";
import { useNavigate } from "react-router-dom";

const schema = yup.object({
  // Contact Information
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  address: yup.string().required("Address is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().required("Phone number is required"),

  // Checkbox for alternate delivery address
  deliveryOption: yup.boolean().optional(),

  // Delivery (Receiver) Information
  receiversFirstName: yup.string().when("deliveryOption", {
    is: true,
    then: (schema) => schema.required("First name is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  receiversLastName: yup.string().when("deliveryOption", {
    is: true,
    then: (schema) => schema.required("Last name is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  receiversAddress: yup.string().when("deliveryOption", {
    is: true,
    then: (schema) => schema.required("Address is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  receiversEmail: yup.string().when("deliveryOption", {
    is: true,
    then: (schema) =>
      schema.email("Invalid email").required("Email is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  receiversPhone: yup.string().when("deliveryOption", {
    is: true,
    then: (schema) => schema.required("Phone number is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

export default function CheckoutProvider() {
  const [loading, setLoading] = useState(false);
  const { cartItems } = useCart();
  const { setVendors, vendors } = useVendorLocation();
  const { user } = useAuth();
  const initializePayment = usePaystackPayment();
  const methods = useForm({
    resolver: yupResolver(schema),
  });
  const navigate = useNavigate();

  const showNotification = (message, type) => {
    // You can replace this with your preferred notification system
    console.log(`${type}: ${message}`);
    alert(message); // Temporary fallback
  };
  useEffect(() => {
    const fetchVendors = async () => {
      if (cartItems.length === 0) return;

      const vendorIds = [...new Set(cartItems.map((item) => item.vendor_id))];

      const { data, error } = await supabase
        .from("vendors")
        .select("vendor_id, subaccount_code, business_name")
        .in("vendor_id", vendorIds);

      if (data) setVendors(data);
      if (error) console.error("Error fetching vendors:", error);
    };

    fetchVendors(); // Call it once when cartItems changes
  }, [cartItems]);

  // useEffect(() => {
  //   const fetchVendors = async () => {
  //     const vendorIds = [...new Set(cartItems.map((item) => item.vendor_id))];
  //     if (cartItems.length === 0) return;

  //     const { data, error } = await supabase
  //       .from("vendors")
  //       .select("vendor_id, subaccount_code, business_name")
  //       .in("vendor_id", vendorIds);

  //     if (data) setVendors(data);
  //     if (error) console.error("Error fetching vendors:", error);

  //     // if (cartItems.length > 0) {
  //     //   fetchVendors();
  //     // }
  //   };
  //   fetchVendors();
  // }, [cartItems]);

  const handleCheckout = (formData) => {
    if (vendors.length === 0) {
      alert("Please wait, loading vendor information...");
      return;
    }

    setLoading(true);
    const paymentData = CalculatePaymentSplit(cartItems, vendors, 5);
    console.log("💰 Payment Summary:", paymentData.summary);
    console.log("delivery information", formData);
    console.log("payout is clicked");

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
        reference: transaction.reference,
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
      console.error("Error handling payment success:", error);
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

  return (
    <>
      <div className="bg-[#009688] text-[1.75rem] text-[#fff] text-center font-semibold p-8 mt-[5rem]">
        <h2 className="">Checkout</h2>
      </div>

      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(handleCheckout)}
          className="grid grid-cols-1 md:grid-cols-[60%_38%] gap-12 px-4 md:px-12 my-4 md:my-8"
        >
          <Checkout />
          <CheckoutSummary loading={loading} />
        </form>
      </FormProvider>
    </>
  );
}
