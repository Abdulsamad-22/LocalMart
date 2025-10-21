import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthProvider";
import VendorShopDisplay from "./VendorShopDisplay";
import {
  CopySimple,
  PencilSimple,
  ShareNetwork,
  DotsThreeVertical,
} from "@phosphor-icons/react";
import { useState } from "react";

export default function MyVendorShop() {
  const { user, vendorData, loading: authLoading, isVendor } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

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

  const handleEditStore = (vendorData) => {
    navigate("/vendor-registration", { state: { vendorData } });
  };

  return (
    <div className="container mx-auto px-3 py-8">
      <div className="">
        {/* Dashboard Header */}
        <div className="bg-[#009688]/8 rounded-lg py-6 mb-2 md:mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-[1.5rem] md:text-3xl font-bold text-gray-800 mb-2">
                My Shop Dashboard
              </h1>
              <p className="text-gray-600 mb-4">
                Welcome back,{" "}
                {vendorData?.business_name ||
                  vendorData?.full_name ||
                  user?.email}
                !
              </p>
            </div>
            {/* Share Shop Section */}
            <div>
              <div className="hidden md:flex gap-4 bg-gray-50 rounded-lg mb-8">
                <div>
                  <button
                    onClick={() => handleEditStore(vendorData)}
                    className="flex items-center bg-[#009688]/10 text-sm text-[#009688] p-2 rounded-md gap-1"
                  >
                    <PencilSimple size={18} /> Edit store
                  </button>
                </div>
                <button className="flex items-center bg-[#009688] text-[#fff] p-2 rounded-md gap-1">
                  <ShareNetwork size={18} />
                  Share
                </button>
              </div>
              <DotsThreeVertical
                onClick={toggleMenu}
                className="block md:hidden cursor-pointer"
                size={32}
              />
            </div>
            {/* Mobile Menu */}
            {isMenuOpen && (
              <div className="absolute top-[96%] left-0 w-full bg-[#fff] p-4 rounded-b-[10px] shadow-lg md:hidden"></div>
            )}
          </div>

          <Link
            to={`/vendor/${vendorData?.vendor_id}`}
            className="text-cyan-600 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            View Public Shop
          </Link>

          {/* Dashboard Actions */}
          <div className="flex gap-2 md:gap-4 mt-3">
            <Link
              to="/add-product"
              className="flex-1 md:flex-none bg-[#009688] text-[#fff] text-[0.875rem] md:text-[1rem] px-4 py-2 rounded"
            >
              Add New Product
            </Link>
            <Link
              to="/manage-products"
              className="flex-1 md:flex-none bg-blue-500 text-[#fff] text-[0.875rem] md:text-[1rem] px-4 py-2 rounded"
            >
              Manage Products
            </Link>
            <Link
              to="/orders"
              className="flex-1 md:flex-none bg-purple-600 text-[#fff] text-[0.875rem] md:text-[1rem] px-4 py-2 rounded hover:bg-purple-700"
            >
              View Orders
            </Link>
          </div>
        </div>

        {/* Share Shop Section */}
        {/* <div className="flex gap-4 bg-gray-50 rounded-lg mb-8"> */}
        {/* <div>
            <button
              onClick={() => handleEditStore(vendorData)}
              className="flex items-center bg-[#009688]/10 text-sm text-[#009688] p-2 rounded-md gap-1"
            >
              <PencilSimple size={18} /> Edit store
            </button>
          </div>
          <button className="flex items-center bg-[#009688] text-[#fff] p-2 rounded-md gap-1">
            <ShareNetwork size={18} />
            Share
          </button> */}
        {/* <button
            onClick={() => {
              navigator.clipboard.writeText(shareUrl);
              alert("Shop URL copied to clipboard!");
            }}
            className="flex items-center gap-1 bg-[#009688]/10 text-sm text-[#009688] px-3 py-3 rounded hover:bg-[#009688]"
          >
            <CopySimple size={20} />
            Copy shop link
          </button> */}
        {/* </div> */}
      </div>

      {/* Shop Display */}
      <VendorShopDisplay vendorId={vendorData.vendor_id} isOwner={true} />
    </div>
  );
}
