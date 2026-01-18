import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthProvider";
import VendorShopDisplay from "./VendorShopDisplay";
import { useEffect } from "react";
import { PencilSimple, ShareNetwork } from "@phosphor-icons/react";
import ShareStore from "./ShareStore";

export default function MyVendorShop({ setOpenOverlay, openOverlay }) {
  const {
    user,
    vendorData,
    loading: authLoading,
    isVendor,
    loadingVendor,
  } = useAuth();
  const navigate = useNavigate();
  console.log(isVendor);

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
  if (loadingVendor) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-500 text-lg">Checking vendor status...</div>
      </div>
    );
  }

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

  useEffect(() => {
    if (openOverlay) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // Cleanup in case component unmounts while overlay is open
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [openOverlay]);

  return (
    <div className="px-4 md:px-12 py-8">
      {openOverlay && (
        <div
          className="fixed top-[10%] left-1/2 transform -translate-x-1/2 z-[8] 
        w-[90%] sm:w-[60%] md:w-[40%] lg:w-[30%] 
        bg-white rounded-xl shadow-lg p-6 
        transition-all duration-300 ease-out 
        animate-slideUp"
        >
          <ShareStore vendorData={vendorData} setOpenOverlay={setOpenOverlay} />
        </div>
      )}
      <div className="my-12">
        {/* Dashboard Header */}
        <div className="bg-[#009688]/8 rounded-lg py-6 mb-2 md:mb-8">
          <div className="flex items-center justify-between">
            <div className="mb-4">
              <h1 className="text-[1.5rem] md:text-3xl font-bold text-gray-800 mb-[2px] md:mb-2">
                My Shop Dashboard
              </h1>
              <p className="text-gray-600 text-[0.875rem] md:text-[1rem]">
                Welcome back,{" "}
                {vendorData?.business_name ||
                  vendorData?.full_name ||
                  user?.email}
                !
              </p>
            </div>
            {/* Share Shop Section */}
            <div>
              <div className="flex gap-4 bg-gray-50 rounded-lg mb-8">
                <div>
                  <button
                    onClick={() => handleEditStore(vendorData)}
                    className="flex items-center bg-[#009688]/10 text-sm text-[#009688] p-2 rounded-md gap-1"
                  >
                    <PencilSimple size={18} />{" "}
                    <span className="hidden md:inline">Edit store</span>
                  </button>
                </div>
                <button
                  onClick={() => setOpenOverlay(!openOverlay)}
                  className="flex items-center bg-[#009688] text-[#fff] p-2 rounded-md gap-1"
                >
                  <ShareNetwork size={18} />
                  <span className="hidden md:inline">Share</span>
                </button>
              </div>
            </div>
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
              className="flex-1 md:flex-none text-center bg-[#009688] text-[#fff] text-[0.875rem] md:text-[1rem] px-1 md:px-4 py-2 rounded"
            >
              Add New Product
            </Link>
            <Link
              to="/manage-products"
              className="flex-1 md:flex-none text-center bg-blue-500 text-[#fff] text-[0.875rem] md:text-[1rem] px-1 md:px-4 py-2 rounded"
            >
              Manage Products
            </Link>
            <Link
              to="/orders"
              className="flex-1 md:flex-none text-center bg-purple-600 text-[#fff] text-[0.875rem] md:text-[1rem] px-1 md:px-4 py-2 rounded hover:bg-purple-700"
            >
              View Orders
            </Link>
          </div>
        </div>
      </div>

      {/* Shop Display */}
      <VendorShopDisplay vendorId={vendorData.vendor_id} isOwner={true} />
    </div>
  );
}
