import Paystack from "@paystack/inline-js";
import { useCallback } from "react";

export const usePaystackPayment = () => {
  const initializePayment = useCallback((config, onSuccess, onClose) => {
    const paystack = new Paystack();

    paystack.newTransaction({
      key: config.publicKey,
      email: config.email,
      amount: config.amount,
      reference: config.reference,
      subaccount: config.subaccount,
      split: config.split,
      split_code: config.split_code,
      metadata: config.metadata,

      onSuccess: (transaction) => {
        console.log("✅ Payment successful:", transaction);
        if (onSuccess) onSuccess(transaction);
      },

      onCancel: () => {
        console.log("❌ Payment cancelled");
        if (onClose) onClose();
      },

      onError: (error) => {
        console.error("❌ Payment error:", error);
        alert("Payment failed. Please try again.");
      },
    });
  }, []);
  return initializePayment;
};
