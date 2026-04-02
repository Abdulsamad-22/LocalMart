import { supabase } from "../../supabase-client";

export default async function createOrderRecords({
  reference,
  cartItems,
  vendorInfo,
  paymentData,
  user,
  checkoutData,
}) {
  try {
    // Group items by vendor
    const vendorGroups = cartItems.reduce((groups, item) => {
      const vendorId = item.vendor_id;
      if (!groups[vendorId]) {
        groups[vendorId] = [];
      }
      groups[vendorId].push(item);
      return groups;
    }, {});

    // Create separate orders for each vendor
    const orderPromises = Object.entries(vendorGroups).map(
      async ([vendorId, items]) => {
        const vendor = vendorInfo.find(
          (v) => v.vendor_id.toString() === vendorId,
        );
        const orderTotal = items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0,
        );
        const platformFee = Math.round(orderTotal * 0.05 * 100) / 100;
        const vendorAmount = orderTotal - platformFee;

        // Create main order record
        const { data: order, error: orderError } = await supabase
          .from("orders")
          .insert({
            customer_id: user.id,
            vendor_id: vendorId,
            payment_reference: reference,
            total_amount: orderTotal,
            platform_fee: platformFee,
            vendor_amount: vendorAmount,
            status: "paid",

            // Contact/Billing Info
            contact_firstname: checkoutData.contact.firstname,
            contact_surname: checkoutData.contact.surname,
            contact_email: checkoutData.contact.email,
            contact_phone: checkoutData.contact.phone,
            contact_address: checkoutData.contact.address,

            // Delivery Info
            delivery_firstname: checkoutData.delivery.firstname,
            delivery_surname: checkoutData.delivery.surname,
            delivery_email: checkoutData.delivery.email,
            delivery_phone: checkoutData.delivery.phone,
            delivery_address: checkoutData.delivery.address,

            // Flag
            is_different_delivery: checkoutData.isDifferentDelivery,
            created_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (orderError) throw orderError;

        // Create vendor-specific order record
        const { data: vendorOrder, error: vendorOrderError } = await supabase
          .from("vendor_orders")
          .insert({
            order_id: order.id,
            vendor_id: vendorId,
            customer_id: user.id,
            customer_name: `${checkoutData.contact.firstname} ${checkoutData.contact.surname}`,
            customer_email: checkoutData.contact.email,
            customer_phone: checkoutData.contact.phone || null,
            payment_reference: reference,
            payment_date: new Date().toISOString(), // Payment timestamp
            total_amount: orderTotal,
            platform_fee: platformFee,
            vendor_amount: vendorAmount,
            status: "paid",
            is_read: false,

            // Contact/Billing Info
            contact_firstname: checkoutData.contact.firstname,
            contact_surname: checkoutData.contact.surname,
            contact_email: checkoutData.contact.email,
            contact_phone: checkoutData.contact.phone,
            contact_address: checkoutData.contact.address,

            // Delivery Info
            delivery_firstname: checkoutData.delivery.firstname,
            delivery_surname: checkoutData.delivery.surname,
            delivery_email: checkoutData.delivery.email,
            delivery_phone: checkoutData.delivery.phone,
            delivery_address: checkoutData.delivery.address,

            // Flag
            is_different_delivery: checkoutData.isDifferentDelivery,
          })
          .select()
          .single();

        if (vendorOrderError) throw vendorOrderError;

        // Create order items
        const orderItems = items.map((item) => ({
          // mapping items from above  not item
          order_id: order.id,
          product_id: item.id,
          vendor_id: vendorId,
          quantity: item.quantity,
          price: item.price,
          total: item.price * item.quantity,
        }));

        const { error: itemsError } = await supabase
          .from("order_items")
          .insert(orderItems);

        if (itemsError) throw itemsError;

        // Create notification for vendor
        const itemNames = items.map((item) => item.name).join(", ");
        const deliveryName = `${checkoutData.delivery.firstname} ${checkoutData.delivery.surname}`;
        const deliveryInfo = checkoutData.isDifferentDelivery
          ? `Deliver to: ${deliveryName} at ${checkoutData.delivery.address} (📞 ${checkoutData.delivery.phone})`
          : `Deliver to: ${deliveryName} at ${checkoutData.delivery.address} (📞 ${checkoutData.delivery.phone})`;
        const { error: notificationError } = await supabase
          .from("vendor_notifications")
          .insert({
            vendor_id: vendorId,
            order_id: vendorOrder.id,
            title: " Payment Received - New Order!",
            message: `Payment confirmed! You've received ₦${vendorAmount.toLocaleString()} (after ₦${platformFee.toLocaleString()} platform fee) from ${
              checkoutData.contact.firstname
            } ${
              checkoutData.contact.surname
            }. ${deliveryInfo}. Items: ${itemNames}. Ref: ${reference}`,
            type: "payment",
            is_read: false,
          });

        // Log but don't throw on notification failure
        if (notificationError) {
          console.error(
            "Notification failed for vendor:",
            vendorId,
            notificationError,
          );
        }

        // Send email notification to vendor will be later implemented
        // if (vendor?.email) {
        //   try {
        //     await sendVendorOrderNotification({
        //       vendorEmail: vendor.email,
        //       vendorName: vendor.business_name,
        //       orderTotal,
        //       vendorAmount, // Include vendor amount
        //       platformFee, // Include platform fee
        //       customerName: user.user_metadata?.full_name || user.email,
        //       customerEmail: user.email, // Include customer email
        //       items,
        //       reference,
        //     });
        //   } catch (emailError) {
        //     console.error("Email notification failed:", emailError);
        //     // Don't throw - order is already paid
        //   }
        // }

        return { order, vendorOrder };
      },
    );

    const orders = await Promise.all(orderPromises);
    console.log(" All orders created successfully:", orders);

    return { success: true, orders };
  } catch (error) {
    console.error(" Error creating order records:", error);
    return { success: false, error: error.message };
  }
}
