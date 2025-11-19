import { supabase } from "../../../supabase-client";
export const getVendorSalesAnalytics = async (vendorId, period = "all") => {
  try {
    let query = supabase
      .from("vendor_orders")
      .select("total_amount, vendor_amount, platform_fee, created_at")
      .eq("vendor_id", vendorId)
      .eq("status", "paid");

    // Filter by period
    const now = new Date();
    if (period === "today") {
      const today = new Date(now.setHours(0, 0, 0, 0)).toISOString();
      query = query.gte("created_at", today);
    } else if (period === "week") {
      const weekAgo = new Date(now.setDate(now.getDate() - 7)).toISOString();
      query = query.gte("created_at", weekAgo);
    } else if (period === "month") {
      const monthAgo = new Date(now.setMonth(now.getMonth() - 1)).toISOString();
      query = query.gte("created_at", monthAgo);
    } else if (period === "year") {
      const yearAgo = new Date(
        now.setFullYear(now.getFullYear() - 1)
      ).toISOString();
      query = query.gte("created_at", yearAgo);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Calculate totals
    const totalSales = data.reduce(
      (sum, order) => sum + parseFloat(order.total_amount),
      0
    );
    const totalEarnings = data.reduce(
      (sum, order) => sum + parseFloat(order.vendor_amount),
      0
    );
    const totalFees = data.reduce(
      (sum, order) => sum + parseFloat(order.platform_fee),
      0
    );
    const orderCount = data.length;

    return {
      success: true,
      analytics: {
        totalSales: Math.round(totalSales * 100) / 100,
        totalEarnings: Math.round(totalEarnings * 100) / 100,
        totalFees: Math.round(totalFees * 100) / 100,
        orderCount,
        averageOrderValue:
          orderCount > 0
            ? Math.round((totalSales / orderCount) * 100) / 100
            : 0,
      },
    };
  } catch (error) {
    console.error("Error fetching sales analytics:", error);
    return { success: false, error: error.message };
  }
};
