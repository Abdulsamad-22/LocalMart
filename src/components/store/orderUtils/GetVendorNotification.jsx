import { supabase } from "../../../supabase-client";
export const getVendorNotifications = async (vendorId, unreadOnly = false) => {
  try {
    let query = supabase
      .from("vendor_notifications")
      .select("*")
      .eq("vendor_id", vendorId)
      .order("created_at", { ascending: false });

    if (unreadOnly) {
      query = query.eq("is_read", false);
    }

    const { data, error } = await query;

    if (error) throw error;
    return { success: true, notifications: data };
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return { success: false, error: error.message };
  }
};
