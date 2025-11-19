import { useState, useEffect } from "react";
import { getVendorNotifications } from "./orderUtils/GetVendorNotification";
import { getVendorOrders } from "./orderUtils/GetVendorOrders";
import { getVendorSalesAnalytics } from "./orderUtils/GetVendorAnalytics";
import { CurrencyNgn, Bell } from "@phosphor-icons/react";

export default function OrderDashboard({ vendorId }) {
  const [orders, setOrders] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [period, setPeriod] = useState("month");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [vendorId, period]);

  const loadDashboardData = async () => {
    setLoading(true);

    // Load orders
    const ordersResult = await getVendorOrders(vendorId);
    if (ordersResult.success) {
      setOrders(ordersResult.orders);
    }

    // Load analytics
    const analyticsResult = await getVendorSalesAnalytics(vendorId, period);
    if (analyticsResult.success) {
      setAnalytics(analyticsResult.analytics);
    }

    // Load notifications
    const notificationsResult = await getVendorNotifications(vendorId, true);
    if (notificationsResult.success) {
      setNotifications(notificationsResult.notifications);
    }

    setLoading(false);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6 mt-20">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-gray-500 text-sm">Total Sales</h3>
          <p className="flex items-center text-2xl font-bold">
            <CurrencyNgn className="font-bold" size={24} />{" "}
            {analytics?.totalSales.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-gray-500 text-sm">Your Earnings</h3>
          <p className="flex items-center text-2xl font-bold text-green-600">
            <CurrencyNgn className="font-bold" size={24} />{" "}
            {analytics?.totalEarnings.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-gray-500 text-sm">Platform Fees</h3>
          <p className="flex items-center text-2xl font-bold text-red-600">
            <CurrencyNgn className="font-bold" size={24} />
            {analytics?.totalFees.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-gray-500 text-sm">Total Orders</h3>
          <p className="text-2xl font-bold">{analytics?.orderCount}</p>
        </div>
      </div>

      {notifications.length > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h3 className="flex items-center font-medium mb-2">
            <Bell /> New Notifications ({notifications.length})
          </h3>
          {notifications.slice(0, 3).map((notif) => (
            <p key={notif.id} className="text-sm">
              {notif.message}
            </p>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between rounded-lg p-4">
        <h2 className="text-[1.125rem] md:text-[1.25rem] font-medium border-b border-[#009688]">
          Recent Orders
        </h2>
        {orders.map((order) => (
          <div key={order.id} className="p-4 border-b hover:bg-gray-50">
            <div className="flex justify-between">
              <div>
                <p className="font-semibold">{order.customer_name}</p>
                <p className="text-sm text-gray-500">{order.customer_email}</p>
                <p className="text-sm">Ref: {order.payment_reference}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">
                  ₦{order.total_amount.toLocaleString()}
                </p>
                <p className="text-sm text-green-600">
                  You earn: ₦{order.vendor_amount.toLocaleString()}
                </p>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    order.status === "pending"
                      ? "bg-yellow-100"
                      : "bg-green-100"
                  }`}
                >
                  {order.status}
                </span>
              </div>
            </div>
          </div>
        ))}

        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="px-4 py-2 border rounded"
        >
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
          <option value="all">All Time</option>
        </select>
      </div>
    </div>
  );
}
