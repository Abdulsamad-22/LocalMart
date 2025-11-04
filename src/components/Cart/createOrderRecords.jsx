import { supabase } from "../../supabase-client";

export const createOrderRecords = async ({
  reference,
  cartItems,
  vendors,
  paymentData,
  user,
}) => {
  try {
    const vendorGroups = cartItems.reduce((groups, item) => {
      const vendorId = item.vendor_id;

      if (!groups[vendorId]) {
        groups[vendorId] = [];
      }

      groups[vendorId].push(item);
      return groups;
    }, {});

    const orderPromises = Object.entries(vendorGroups).map(
      async ([vendorId, items]) => {
        const vendor = vendors.find((v) => v.vendor_id.toString() === vendorId);
        const orderTotal = items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
        const platformFee = Number((orderTotal * (0.05 * 100)) / 100);
        const vendorAmount = orderTotal - platformFee;

        const { data: order, error: orderError } = supabase
          .from("orders")
          .insert({
            customer_id: user.id,
            vendor_id: parseInt(vendorId),
            payment_reference: reference,
            total_amount: orderTotal,
            platform_fee: platformFee,
            vendor_amount: vendorAmount,
            status: "paid",
            created_at: new Date().toISOString(),
          })
          .select();

        if (orderError) {
          alert("Error fetching updating your orders", orderError);
        }

        // Order items
        const orderItems = items.map((item) => ({
          order_id: order.id,
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
          total: item.price * item.quantity,
        }));

        const { error: itemsError } = supabase
          .from("order_items")
          .insert(orderItems);
        if (itemsError) {
          console.log("Unable to upload order items", itemsError);
        }

        return order;
      }
    );
    const orders = await Promise.all(orderPromises);
    console.log("All orders created successfully:", orders);

    return { success: true, orders };
  } catch (error) {
    console.error("Error creating order records:", error);
    return { success: false, error: error.message };
  }
};
