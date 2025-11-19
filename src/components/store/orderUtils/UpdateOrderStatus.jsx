import { supabase } from "../../../supabase-client";
export const updateOrderStatus = async (orderId, status) => {
  try {
    const { error } = await supabase
      .from("vendor_orders")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Error updating order status:", error);
    return { success: false, error: error.message };
  }
};
