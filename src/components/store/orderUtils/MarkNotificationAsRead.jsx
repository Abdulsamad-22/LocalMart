import { supabase } from "../../../supabase-client";
export const markNotificationAsRead = async (notificationId) => {
  try {
    const { error } = await supabase
      .from("vendor_notifications")
      .update({ is_read: true })
      .eq("id", notificationId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return { success: false, error: error.message };
  }
};
