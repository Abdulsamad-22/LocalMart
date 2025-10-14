export const PAYSTACK_KEY = import.meta.env.VITE_PAYSTACK_KEY;
export const getBankCode = async (bankName) => {
  try {
    const response = await fetch(
      "https://api.paystack.co/bank?country=nigeria",
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
      const normalizedInput = bankName.toLowerCase().trim();

      let bank = result.data.find(
        (b) => b.name.toLowerCase() === normalizedInput
      );

      // Try exact match
      if (!bank) {
        bank = result.data.find(
          (b) =>
            b.name.toLowerCase().includes(normalizedInput) ||
            normalizedInput.includes(b.name.toLowerCase())
        );
      }

      // Try partial match
      if (bank) {
        console.log(`found bank: ${bank.name} (${bank.code})`);
        return bank.code;
      }

      console.warn(`Bank not found for: ${bankName}`);
      return null;
    }
  } catch (error) {
    console.error("Error fetching banks:", error);
    return null;
  }
};
