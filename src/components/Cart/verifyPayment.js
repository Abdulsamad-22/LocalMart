import { supabase } from "../../supabase-client";

export const verifyPayment = async (reference) => {
  try {
    const { data, error } = await supabase.functions.invoke("verify-payment", {
      body: { reference: reference },
    });

    console.log("📦 Data received:", data);
    console.log("❌ Error received:", error);

    if (error) {
      console.error("Verification error:", error);
      return { success: false, error: error.message };
    }

    if (!data) {
      console.error("No data returned");
      return { success: false, error: "No response from verification service" };
    }
    console.log("✅ Verification successful");
    return data;
  } catch (error) {
    console.error("Error calling function:", error);
    return { success: false, error: error.message };
  }
};
