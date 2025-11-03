export default function CalculatePaymentSplit(
  cartItems,
  vendors,
  platformFeePercentage = 5
) {
  const splits = [];
  let totalAmount = 0;
  const vendorTotals = {};

  cartItems.forEach((item) => {
    const vendorId = item.vendor_id.toString();
    const itemTotal = item.price * item.quantity;

    totalAmount += itemTotal;

    if (!vendorTotals[vendorId]) {
      vendorTotals[vendorId] = 0;
    }
    vendorTotals[vendorId] += itemTotal;
  });

  // Create spilts for each vendor
  Object.entries(vendorTotals).forEach(([vendorId, vendorAmount]) => {
    const vendor = vendors.find((v) => v.vendor_id.toString() === vendorId);

    if (
      vendor &&
      vendor.subaccount_code &&
      typeof vendor.subaccount_code === "string"
    ) {
      const platformFee = Math.round(
        vendorAmount * (platformFeePercentage / 100)
      );
      const vendorReceives = vendorAmount - platformFee;

      splits.push({
        subaccount: vendor.subaccount_code,
        share: Math.round(vendorReceives * 100),
        transaction_charge_type: "flat",
        transaction_charge: 0,
      });
    }
  });
  return {
    totalAmount: Math.round(totalAmount * 100), // Convert to kobo
    splits,
    vendorTotals,
    summary: {
      totalAmount,
      platformFee: Object.values(vendorTotals).reduce(
        (sum, amount) =>
          Math.round(sum + amount * (platformFeePercentage / 100)),
        0
      ),
      vendorPayouts: splits.reduce((sum, split) => sum + split.share, 0) / 100,
    },
  };
}
