import { useEffect, useState } from "react";
import { supabase } from "../../supabase-client";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthProvider";
import VendorShopDisplay from "./VendorShopDisplay";

export default function MyVendorShop() {
  const { user, vendorData, loading: authLoading, isVendor } = useAuth();

  if (authLoading) {
    console.log("auth loading");
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Show error if not a vendor
  if (!isVendor) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="text-red-500 text-lg mb-4">
          You need to register as a vendor to access this page
        </div>
        <Link to="/vendor-registration" className="text-blue-500 underline">
          Register as Vendor
        </Link>
      </div>
    );
  }

  const shareUrl = `${window.location.origin}/vendor/${vendorData?.vendor_id}`;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Dashboard Header */}
      <div className="bg-blue-50 rounded-lg p-6 mb-8">
        <h1 className="text-3xl font-bold text-blue-900 mb-2">
          My Shop Dashboard
        </h1>
        <p className="text-blue-700 mb-4">
          Welcome back,{" "}
          {vendorData?.business_name || vendorData?.full_name || user?.email}!
        </p>

        {/* Dashboard Actions */}
        <div className="flex flex-wrap gap-4">
          <Link
            to="/add-product"
            className="bg-[#009688] text-[#fff] px-4 py-2 rounded"
          >
            Add New Product
          </Link>
          <Link
            to="/manage-products"
            className="bg-blue-500 text-[#fff] px-4 py-2 rounded"
          >
            Manage Products
          </Link>
          <Link
            to="/orders"
            className="bg-purple-600 text-[#fff] px-4 py-2 rounded hover:bg-purple-700"
          >
            View Orders
          </Link>
        </div>
      </div>

      {/* Share Shop Section */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Share Your Shop</h2>
        <div className="flex items-center gap-4">
          <Link
            to={`/vendor/${vendorData?.vendor_id}`}
            className="text-blue-600 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            View Public Shop
          </Link>
          <button
            onClick={() => {
              navigator.clipboard.writeText(shareUrl);
              alert("Shop URL copied to clipboard!");
            }}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Copy Shop URL
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Share this URL:{" "}
          <code className="bg-gray-200 px-2 py-1 rounded">{shareUrl}</code>
        </p>
      </div>

      {/* Shop Display */}
      <VendorShopDisplay vendorId={vendorData.vendor_id} isOwner={true} />
    </div>
  );
}
