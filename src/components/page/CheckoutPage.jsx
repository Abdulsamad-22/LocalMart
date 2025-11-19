import Checkout from "../checkout/Checkout";
import CheckoutSummary from "../checkout/CheckoutSummary";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState, useEffect } from "react";
import { FormProvider } from "react-hook-form";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useCart } from "../Context/CartProvider";
import { supabase } from "../../supabase-client";
import CalculatePaymentSplit from "../Utils/CalculatePaymentSplit";
import { usePaystackPayment } from "../../hooks/usePaymentHook";
// import { verifyPayment } from "../Cart/verifyPayment";
import { createOrderRecords } from "../Cart/createOrderRecords";
import { useAuth } from "../Context/AuthProvider";
import { useNavigate } from "react-router-dom";

const paystack_publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

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

const structureCheckoutData = (formData) => {
  return {
    contact: {
      firstname: formData.firstName,
      surname: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
    },
    delivery: formData.deliveryOption
      ? {
          firstname: formData.receiversFirstName,
          surname: formData.receiversLastName,
          email: formData.receiversEmail,
          phone: formData.receiversPhone,
          address: formData.receiversAddress,
        }
      : {
          firstname: formData.firstName,
          surname: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
        },
    isDifferentDelivery: formData.deliveryOption || false,
  };
};

export default function CheckoutProvider() {
  const [loading, setLoading] = useState(false);
  const { cartItems } = useCart();
  const [vendorInfo, setVendorInfo] = useState([]);
  const { user } = useAuth();
  const methods = useForm({
    resolver: yupResolver(schema),
  });
  const navigate = useNavigate();

  const showNotification = (message, type) => {
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

      if (data) setVendorInfo(data);
      if (error) console.error("Error fetching vendors:", error);
    };

    fetchVendors();
  }, [cartItems]);

  const initializePayment = usePaystackPayment();

  const handleCheckout = (formData) => {
    const checkoutData = structureCheckoutData(formData);
    console.log(checkoutData);
    try {
      setLoading(true);
      if (!user || !user.email) {
        alert("Please log in to continue");
        return;
      }

      console.log("User:", user);

      // 2. Validate cart
      if (cartItems.length === 0) {
        alert("Your cart is empty");
        return;
      }
      if (vendorInfo?.length === 0) {
        alert("Please wait, loading vendor information...");
        return;
      }

      const paymentData = CalculatePaymentSplit(cartItems, vendorInfo, 5);

      const config = {
        publicKey: paystack_publicKey,
        email: user.email,
        amount: Math.round(Number(paymentData.totalAmount)),
        reference: `order_${Date.now()}_${user.id}`,
      };

      // Add subaccount if single vendor has a valid subaccount
      if (paymentData.splits.length === 1) {
        const split = paymentData.splits[0];

        if (
          split.subaccount &&
          typeof split.subaccount === "string" &&
          split.subaccount.length > 0
        ) {
          config.subaccount = split.subaccount;
          console.log("Single vendor - subaccount:", config.subaccount);
        } else {
          console.error(
            "Invalid subaccount for single vendor:",
            split.subaccount
          );
          alert("Vendor payment setup incomplete. Cannot proceed.");
          return;
        }
      }

      // Add split if multiple vendors has a valid subaccounts
      else if (paymentData.splits.length > 1) {
        // Validate all splits have required data
        const invalidSplits = paymentData.splits.filter(
          (split) =>
            !split.subaccount ||
            typeof split.subaccount !== "string" ||
            !split.share ||
            typeof split.share !== "number" ||
            split.share <= 0
        );

        if (invalidSplits.length > 0) {
          console.error("Invalid splits found:", invalidSplits);
          alert("Some vendors have incomplete payment setup. Cannot proceed.");
          return;
        }

        config.split = {
          type: "flat",
          bearer_type: "all-proportional",
          subaccounts: paymentData.splits.map((split) => ({
            subaccount: split.subaccount,
            share: Math.round(Number(split.share)),
          })),
        };

        console.log("Multiple vendors - split:", config.split);
      }

      config.metadata = {
        customer_id: user.id,
        order_items: cartItems.length,
        vendor_count: vendorInfo.length,
      };
      console.log("Metadata:", config.metadata);

      console.log("Final config before payment:", config);

      // Initialize payment
      initializePayment(
        config,
        (transaction) =>
          handlePaymentSuccess(transaction, paymentData, checkoutData),
        () => handlePaymentClose()
      );

      // Initialize payment
      // try {
      //   initializePayment(
      //     config,
      //     (transaction) => handlePaymentSuccess(transaction, paymentData),
      //     () => handlePaymentClose()
      //   );
      // } catch (paystackError) {
      //   console.error("Paystack Error:", paystackError);
      //   console.error("Error name:", paystackError.name);
      //   console.error("Error message:", paystackError.message);

      //   // Log the validation issues
      //   if (paystackError.issues) {
      //     console.error("Validation Issues:", paystackError.issues);

      //     paystackError.issues.forEach((issue, index) => {
      //       console.error(`Issue ${index + 1}:`, {
      //         path: issue.path,
      //         message: issue.message,
      //         code: issue.code,
      //         expected: issue.expected,
      //         received: issue.received,
      //       });
      //     });
      //   }

      //   throw paystackError;
      // }
    } catch (error) {
      console.error("Checkout error:", error);
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
      alert(`Checkout failed: ${error.message}`);
      alert("Checkout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (
    transaction,
    paymentData,
    checkoutData
  ) => {
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
        vendorInfo,
        paymentData,
        user,
        checkoutData: checkoutData,
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
          <CheckoutSummary loading={loading} vendorInfo={vendorInfo} />
        </form>
      </FormProvider>
    </>
  );
}
