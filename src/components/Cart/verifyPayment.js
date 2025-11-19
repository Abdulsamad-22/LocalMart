import { supabase } from "../../supabase-client";

export const verifyPayment = async (reference) => {
  try {
    const { data, error } = await supabase.functions.invoke("verify-payment", {
      body: { reference: reference },
    });

    if (error) {
      console.error("Verification error:", error);
      return { success: false, error: error.message };
    }

    if (!data) {
      console.error("No data returned");
      return { success: false, error: "No response from verification service" };
    }
    return data;
  } catch (error) {
    console.error("Error calling function:", error);
    return { success: false, error: error.message };
  }
};
