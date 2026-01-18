import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../Context/AuthProvider";
import { supabase } from "../../supabase-client";
import VendorShopDisplay from "./VendorShopDisplay";

export default function PublicVendorShop() {
  const { id: vendorId } = useParams();
  const { user, vendorData, isVendor, loadingVendor } = useAuth();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOwnShop, setIsOwnShop] = useState(false);

  useEffect(() => {
    async function fetchPublicVendorData() {
      try {
        setLoading(true);
        setError(null);

        if (!vendorId) {
          setError("Invalid shop URL");
          setLoading(false);
          return;
        }

        console.log("Fetching public shop data for vendor:", vendorId);

        const { data: vendorData, error: vendorError } = await supabase
          .from("vendors")
          .select("*")
          // .eq("vendor_id", vendorId)
          .single();

        if (vendorError) {
          if (vendorError.code === "PGRST116") {
            setError("Shop not found");
          } else {
            setError("Error loading shop");
          }
          setLoading(false);
          return;
        }

        setVendor(vendorData);

        if (loadingVendor) {
          if (isVendor && vendorData.vendor_id === vendorId) {
            setIsOwnShop(true);
          }
        }
      } catch (err) {
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchPublicVendorData();
  }, [vendorId, isVendor, vendorData]); //vendorId isVendor vendorData

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading shop...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }
  return (
    <div className="py-8 my-10 md:my-12">
      {/* Show banner if viewing own shop */}
      {isOwnShop !== false && (
        <div className=" border border-[#009688] bg-[#009688]/10 py-4 px-4 md:px-12 mb-6">
          <p className="text-gray-900 text-[0.875rem] md:text-[1rem]">
            This is how your shop appears to customers.
            <Link to="/my-shop" className="ml-2 text-gray-900 underline">
              Go to Dashboard
            </Link>
          </p>
        </div>
      )}

      {/* Public Shop Header */}
      <div className="text-center mb-8 px-4">
        <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-[0rem] md:mb-2">
          {vendor.business_name || vendor.name}
        </h1>
        {vendor.product_category && (
          <p className="text-[0.875rem] md:text-[1rem] text-gray-600 max-w-2xl mx-auto">
            {vendor.product_category}
          </p>
        )}
        {vendor.business_address && (
          <p className="text-gray-500 mt-2">📍 {vendor.business_address}</p>
        )}

        {/* Contact info if available */}
        <div className="flex justify-center gap-[0.5rem] md:gap-4 mt-4 text-sm text-gray-600">
          {vendor.phone_number && (
            <span className="flex items-center gap-2 text-[0.75rem] md:text-[1rem]">
              📞 {vendor.phone_number}
            </span>
          )}
          {vendor.email && <span>📧 {vendor.email}</span>}
          {/* {vendor.socials && (
            <a href={vendor.socials} target="_blank" rel="noopener noreferrer">
              📧 Social media handle
            </a>
          )} */}
        </div>
      </div>

      <div className="px-4 md:px-12">
        {/* Shop Display */}
        <VendorShopDisplay
          vendorId={vendor.vendor_id}
          isOwner={false}
          currentUser={user}
        />
      </div>
    </div>
  );
}
