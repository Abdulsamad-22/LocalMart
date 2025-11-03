import { usePaystackPayment } from "../../hooks/usePaymentHook";
export const TestMinimalPayment = () => {
  const initializePayment = usePaystackPayment();

  const testPayment = () => {
    const config = {
      publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
      email: "test@example.com",
      amount: 50000, // Simple amount
      reference: `test_${Date.now()}`,
      // No subaccount, no split - just basics
    };

    console.log("🧪 Minimal test config:", config);

    initializePayment(
      config,
      (tx) => console.log("Test success:", tx),
      () => console.log("Test closed")
    );
  };

  return (
    <button
      onClick={testPayment}
      className="bg-blue-500 text-white px-4 py-2 rounded"
    >
      Test Minimal Payment
    </button>
  );
};
