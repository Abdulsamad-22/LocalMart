import { supabase } from "../../../supabase-client";

/**
 * Update an existing Paystack subaccount
 * @param {string} subaccountCode - The subaccount code (e.g., "ACCT_xxxxx")
 * @param {object} updateData - Data to update
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const updateSubaccount = async (subaccountCode, updateData) => {
  try {
    console.log("Updating subaccount:", subaccountCode);
    console.log("Update data:", updateData);

    // Call the Edge Function
    const { data, error } = await supabase.functions.invoke(
      "update-subaccount",
      {
        body: {
          subaccountCode,
          updateData,
        },
      }
    );

    // Check for errors
    if (error) {
      console.error("❌ Error updating subaccount:", error);
      return {
        success: false,
        error: error.message || "Failed to update subaccount",
      };
    }

    // Check response data
    if (!data || !data.success) {
      console.error("Update failed:", data?.error);
      return {
        success: false,
        error: data?.error || "Failed to update subaccount",
      };
    }

    console.log("Subaccount updated successfully:", data.data);
    return {
      success: true,
      data: data.data,
    };
  } catch (error) {
    console.error("Exception updating subaccount:", error);
    return {
      success: false,
      error: error.message || "An unexpected error occurred",
    };
  }
};
