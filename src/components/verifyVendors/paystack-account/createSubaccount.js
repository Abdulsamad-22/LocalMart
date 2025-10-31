import { supabase } from "../../../supabase-client";
export const createSubaccount = async (vendorData, bankCode, accountName) => {
  try {
    const { data, error } = await supabase.functions.invoke(
      "create-subaccount",
      {
        body: { vendorData, bankCode, accountName },
      }
    );

    if (error || !data.success) {
      console.error("Subaccount creation failed:", error);
      return { success: false, error: error?.message || data?.error };
    }

    return {
      success: true,
      subaccountCode: data.subaccountCode,
      data: data.data,
    };
  } catch (error) {
    console.error("Exception:", error);
    return { success: false, error: error.message };
  }
};
