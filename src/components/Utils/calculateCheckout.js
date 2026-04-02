export function calculateCheckout(items) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.item_price * item.quantity,
    0,
  );
  const savings = items.reduce(
    (sum, item) => sum + (item.originalPrice - item.price) * item.quantity,
    0,
  );
  const deliveryCost = 15.99; // Free delivery over Ngn 50000
  const tax = subtotal * 0.07; // 7% tax
  const total = subtotal + (subtotal < 50000 ? deliveryCost : 0) + tax;
  return { subtotal, savings, tax, total };
}
