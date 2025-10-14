import { PAYSTACK_KEY } from "./getBankCode";
export const verifyAccountNumber = async (accountNumber, bankCode) => {
  try {
    const response = await fetch(
      `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${PAYSTACK_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json();

    if (result.status) {
      console.log(`Account verified: ${result.data.account_name}`);

      return {
        success: true,
        accountName: result.data.account_name,
      };
    } else {
      console.error(`Account verification failed: ${result.message}`);

      return {
        success: false,
        error: result.message,
      };
    }
  } catch (error) {
    console.error("Error verifying account:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};
