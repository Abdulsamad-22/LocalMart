import Paystack from "@paystack/inline-js";
import { useCallback } from "react";

export const usePaystackPayment = () => {
  const initializePayment = useCallback((config, onSuccess, onClose) => {
    try {
      // Validate required fields
      if (!config.publicKey) {
        alert("Payment Error: Public key is missing");
        return;
      }

      if (!config.publicKey.startsWith("pk_")) {
        alert("Payment Error: Invalid public key (must start with pk_)");
        return;
      }

      if (!config.email) {
        alert("Payment Error: Email is missing");
        return;
      }

      if (
        !config.amount ||
        typeof config.amount !== "number" ||
        config.amount <= 0
      ) {
        alert("Payment Error: Invalid amount");
        return;
      }

      if (!config.ref) {
        alert("Payment Error: Reference is missing");
        return;
      }

      // Build transaction object
      const transactionConfig = {
        key: config.publicKey,
        email: config.email,
        amount: config.amount,
        ref: config.ref,

        onSuccess: (transaction) => {
          console.log("Payment successful:", transaction);
          if (onSuccess) onSuccess(transaction);
        },
        onClose: () => {
          console.log("Payment closed");
          if (onClose) onClose();
        },
      };

      if (
        config.subaccount &&
        typeof config.subaccount === "string" &&
        config.subaccount.length > 0
      ) {
        transactionConfig.subaccount = config.subaccount;
        console.log("Adding subaccount:", config.subaccount);
      } else if (config.subaccount !== undefined) {
        console.warn("Invalid subaccount, skipping:", config.subaccount);
      }

      // Split if it's a valid object with subaccounts array
      if (
        config.split &&
        typeof config.split === "object" &&
        Array.isArray(config.split.subaccounts) &&
        config.split.subaccounts.length > 0
      ) {
        // Validate each subaccount in split
        const validSubaccounts = config.split.subaccounts.filter(
          (sub) =>
            sub.subaccount &&
            typeof sub.subaccount === "string" &&
            typeof sub.share === "number" &&
            sub.share > 0
        );

        if (validSubaccounts.length > 0) {
          transactionConfig.split = {
            type: config.split.type || "flat",
            bearer_type: config.split.bearer_type || "all-proportional",
            subaccounts: validSubaccounts.map((sub) => ({
              subaccount: sub.subaccount,
              share: Math.round(sub.share),
            })),
          };
          console.log("Adding split:", transactionConfig.split);
        } else {
          console.warn("No valid subaccounts in split, skipping");
        }
      } else if (config.split !== undefined) {
        console.warn("Invalid split config, skipping:", config.split);
      }

      // Add metadata if it's a valid object
      if (
        config.metadata &&
        typeof config.metadata === "object" &&
        !Array.isArray(config.metadata) &&
        Object.keys(config.metadata).length > 0
      ) {
        transactionConfig.metadata = config.metadata;
        console.log("Adding metadata:", config.metadata);
      } else if (config.metadata !== undefined) {
        console.warn("Invalid metadata, skipping:", config.metadata);
      }

      console.log("Final transaction config:", transactionConfig);

      const paystack = new Paystack();
      paystack.newTransaction(transactionConfig);
    } catch (error) {
      console.error("Error initializing payment:", error);

      if (error.issues && Array.isArray(error.issues)) {
        console.error("Validation issues:", error.issues);

        error.issues.forEach((issue, index) => {
          console.error(`Issue ${index + 1}:`, issue);
        });

        const issueMessages = error.issues
          .map((issue, index) => `${index + 1}. ${issue.message}`)
          .join("\n");

        alert(`Payment validation failed:\n\n${issueMessages}`);
      } else {
        alert(`Payment initialization failed: ${error.message}`);
      }
    }
  }, []);

  return initializePayment;
};
