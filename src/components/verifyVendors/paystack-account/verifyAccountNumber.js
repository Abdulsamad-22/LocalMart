import { supabase } from "../../../supabase-client";
export const verifyAccountNumber = async (accountNumber, bankCode) => {
  try {
    const { data, error } = await supabase.functions.invoke("verify-account", {
      body: { accountNumber, bankCode },
    });

    if (error || !data.success) {
      console.error("Verification failed:", error);
      return { success: false, error: error?.message || data?.error };
    }

    return {
      success: true,
      accountName: data.accountName,
      accountNumber: data.accountNumber,
    };
  } catch (error) {
    console.error("Exception:", error);
    return { success: false, error: error.message };
  }
};
