import { useEffect, useState } from "react";
import { supabase } from "../../supabase-client";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthProvider";
import VendorShopDisplay from "./VendorShopDisplay";
import { CopySimple } from "@phosphor-icons/react";

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
    <div className="container mx-auto px-3 py-8">
      <div className="flex flex-col md:flex-row items-start md:items-center md:justify-between">
        {/* Dashboard Header */}
        <div className="bg-[#009688]/8 rounded-lg py-6 mb-2 md:mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            My Shop Dashboard
          </h1>
          <p className="text-gray-600 mb-4">
            Welcome back,{" "}
            {vendorData?.business_name || vendorData?.full_name || user?.email}!
          </p>

          <Link
            to={`/vendor/${vendorData?.vendor_id}`}
            className="text-cyan-600 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            View Public Shop
          </Link>

          {/* Dashboard Actions */}
          <div className="flex flex-wrap gap-4 mt-3">
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
        <div className="bg-gray-50 rounded-lg mb-8">
          <button
            onClick={() => {
              navigator.clipboard.writeText(shareUrl);
              alert("Shop URL copied to clipboard!");
            }}
            className="flex items-center gap-1 bg-[#009688]/10 text-sm text-[009688] px-3 py-3 rounded hover:bg-[009688]"
          >
            <CopySimple size={20} />
            Copy shop link
          </button>
        </div>
      </div>

      {/* Shop Display */}
      <VendorShopDisplay vendorId={vendorData.vendor_id} isOwner={true} />
    </div>
  );
}
