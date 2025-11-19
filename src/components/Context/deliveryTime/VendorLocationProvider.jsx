import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../../../supabase-client";
import getBuyerLocation from "./getBuyerLocation";
import { geocodeAddress } from "./geocodeVendorAddress";
import { getTravelTimes } from "./getTravelTimes";
import {
  getCachedBuyerLocation,
  cacheBuyerLocation,
} from "../../Utils/cacheBuyerLocation";

const LocationContext = createContext();
export const useVendorLocation = () => useContext(LocationContext);

// function getStateFromCoords(lat, lng) {
//   if (!lat || !lng) return "Unknown State";
//   if (lat >= 8 && lat <= 9.5 && lng >= 7 && lng <= 8) return "Abuja (FCT)";
//   if (lat >= 6 && lat <= 6.7 && lng >= 3 && lng <= 3.6) return "Lagos State";
//   if (lat >= 9 && lat <= 10 && lng >= 7 && lng <= 9) return "Nasarawa State";
//   return "Unknown State";
// }

export default function VendorLocationProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        console.log("=== VendorList Debug ===");

        // Fetch vendors from database
        console.log("Fetching vendors from database...");
        const { data: vendorData, error: dbError } = await supabase
          .from("vendors")
          .select("*");

        if (dbError) {
          console.error("Database error:", dbError);
          throw dbError;
        }

        console.log("Raw vendor data:", vendorData);

        if (!vendorData || vendorData.length === 0) {
          console.warn("No vendors found in database");
          setVendors([]);
          setLoading(false);
          return;
        }

        // Get buyer location without failling
        console.log("Getting buyer location...");
        let buyer = null;
        let shouldCalculateDistance = false;

        try {
          buyer = await getBuyerLocation(10000); // 10 second timeout
          console.log("Buyer location obtained:", buyer);

          if (buyer && buyer.lat && buyer.lng) {
            shouldCalculateDistance = true;
          }
        } catch (locationError) {
          console.error("Failed to get buyer location:", locationError);
          console.log("Will display vendors without distance calculation");
          shouldCalculateDistance = false;
        }

        if (!shouldCalculateDistance) {
          const vendorsWithoutDistance = vendorData.map((v) => ({
            name: v.business_name,
            address: v.business_address,
            id: v.vendor_id,
            location: null,
            travelTime: null,
            // state: null,
            hasRoute: false,
          }));

          console.log("Returning vendors without distance calculation");
          setVendors(vendorsWithoutDistance);
          setLoading(false);
          return;
        }

        // Geocode vendor addresses
        console.log("Geocoding vendor addresses...");
        const vendorsWithCoords = [];

        for (const [index, v] of vendorData.entries()) {
          console.log(
            `Processing vendor ${index + 1}/${vendorData.length}: ${
              v.business_name
            }`
          );

          if (!v.business_address) {
            console.warn(`Vendor ${v.business_name} has no address, skipping`);
            continue;
          }

          try {
            const coords = await geocodeAddress(v.business_address);
            console.log(`Geocoding result for ${v.business_name}:`, coords);

            if (coords && coords.lat && coords.lng) {
              vendorsWithCoords.push({
                name: v.business_name,
                address: v.business_address,
                id: v.vendor_id,
                location: coords,
              });
              console.log(
                `Added vendor: ${v.business_name} at [${coords.lng}, ${coords.lat}]`
              );
            } else {
              console.warn(`Invalid coords for ${v.business_name}:`, coords);
            }
          } catch (geocodeError) {
            console.error(
              `Geocoding failed for ${v.business_name}:`,
              geocodeError
            );
          }
        }

        console.log(
          `Successfully geocoded ${vendorsWithCoords.length}/${vendorData.length} vendors`
        );

        if (vendorsWithCoords.length === 0) {
          console.error("No vendors could be geocoded");
          const vendorsWithoutCoords = vendorData.map((v) => ({
            name: v.business_name,
            address: v.business_address,
            id: v.vendor_id,
            location: null,
            travelTime: null,
            // state: null,
            hasRoute: false,
          }));
          setVendors(vendorsWithoutCoords);
          setLoading(false);
          return;
        }

        // Calculate travel times
        console.log("Calculating travel times...");
        let travelTimeResults;

        try {
          travelTimeResults = await getTravelTimes(buyer, vendorsWithCoords);
          console.log("Travel time results:", travelTimeResults);
        } catch (travelError) {
          console.error("Travel time calculation failed:", travelError);

          travelTimeResults = vendorsWithCoords.map((v) => ({
            vendor: v,
            travelTime: null,
            // state: getStateFromCoords(v.location.lat, v.location.lng),
            error: travelError.message,
          }));
        }

        const finalVendors = travelTimeResults.map((result, i) => {
          const vendor = result.vendor;
          const travelTime = result.travelTime;
          // const state = result.state;

          const shouldShowTime = travelTime !== null && travelTime <= 240;

          return {
            ...vendor,
            travelTime: shouldShowTime
              ? Math.round(travelTime * 100) / 100
              : null,
            // state: state,
            hasRoute: shouldShowTime,
            error: result.error || null,
          };
        });

        console.log("Final vendors array:", finalVendors);
        setVendors(finalVendors);

        // Cache buyer location for future use
        if (buyer && !buyer.isFallback) {
          cacheBuyerLocation(buyer);
        }
      } catch (error) {
        console.error("Error in loadData:", error);

        try {
          const { data: fallbackData } = await supabase
            .from("vendors")
            .select("*");

          if (fallbackData) {
            const fallbackVendors = fallbackData.map((v) => ({
              name: v.business_name,
              address: v.business_address,
              id: v.vendor_id,
              location: null,
              travelTime: null,
              // state: null,
              hasRoute: false,
            }));
            setVendors(fallbackVendors);
          }
        } catch (fallbackError) {
          setError(`Failed to load vendor data: ${error.message}`);
        }
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // if (loading) {
  //   return (
  //     <div className="flex justify-center items-center min-h-screen">
  //       <p>Loading products and calculating delivery times...</p>
  //       <p>
  //         <small>This may take a few moments</small>
  //       </p>
  //     </div>
  //   );
  // }

  // if (error) {
  //   return (
  //     <div className="flex justify-center items-center min-h-screen">
  //       <h2>Error Loading Vendors</h2>
  //       <p style={{ color: "red" }}>{error}</p>
  //       <button onClick={() => window.location.reload()}>Try Again</button>
  //     </div>
  //   );
  // }

  if (vendors.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <h2 className="text-[#009688] text-[1.5rem] font-semibold">
          LocalMart
        </h2>
        <small>Please wait...</small>
      </div>
    );
  }

  return (
    <LocationContext.Provider value={{ vendors, setVendors }}>
      {children}
    </LocationContext.Provider>
  );
}
