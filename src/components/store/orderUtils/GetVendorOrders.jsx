import { supabase } from "../../../supabase-client";
export const getVendorOrders = async (vendorId, filters = {}) => {
  try {
    let query = supabase
      .from("vendor_orders")
      .select(
        `
        *,
        order_items:order_items(
          *,
          product:products(name, image_url)
        )
      `
      )
      .eq("vendor_id", vendorId)
      .order("created_at", { ascending: false });

    // Apply filters
    if (filters.status) {
      query = query.eq("status", filters.status);
    }
    if (filters.startDate) {
      query = query.gte("created_at", filters.startDate);
    }
    if (filters.endDate) {
      query = query.lte("created_at", filters.endDate);
    }

    const { data, error } = await query;

    if (error) throw error;
    return { success: true, orders: data };
  } catch (error) {
    console.error("Error fetching vendor orders:", error);
    return { success: false, error: error.message };
  }
};
