import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../../../supabase-client";
import getBuyerLocation from "./getBuyerLocation";
import { geocodeAddress } from "./GeocodeVendorAddress";
import { getTravelTimes } from "./getTravelTimes";
import {
  getCachedBuyerLocation,
  cacheBuyerLocation,
} from "../../Utils/cacheBuyerLocation";

const LocationContext = createContext();
export const useVendorLocation = () => useContext(LocationContext);

function getStateFromCoords(lat, lng) {
  if (!lat || !lng) return "Unknown State";
  if (lat >= 8 && lat <= 9.5 && lng >= 7 && lng <= 8) return "Abuja (FCT)";
  if (lat >= 6 && lat <= 6.7 && lng >= 3 && lng <= 3.6) return "Lagos State";
  if (lat >= 9 && lat <= 10 && lng >= 7 && lng <= 9) return "Nasarawa State";
  return "Unknown State";
}

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
          setError("No vendor locations could be found");
          setLoading(false);
          return;
        }

        // Get buyer location with timeout and fallback
        console.log("Getting buyer location...");
        let buyer;

        try {
          // Try to get location with timeout
          buyer = await getBuyerLocation(10000); // 10 second timeout
          console.log("Buyer location obtained:", buyer);
        } catch (locationError) {
          console.error("Failed to get buyer location:", locationError);

          // Check if we have cached location
          const cachedLocation = getCachedBuyerLocation();

          if (cachedLocation) {
            console.log("Using cached location:", cachedLocation);
            buyer = cachedLocation;
          } else {
            // Use default fallback location (e.g., Abuja city center)
            console.warn("Using fallback location (Abuja)");
            buyer = {
              lat: 9.0765,
              lng: 7.3986,
              isFallback: true,
            };

            // Show warning to user
            setError(
              "Could not get your exact location. Showing results based on Abuja. " +
                "Please enable location services for accurate results."
            );
          }
        }

        if (!buyer || !buyer.lat || !buyer.lng) {
          console.error("Invalid buyer location:", buyer);
          setError("Invalid location data received");
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

          // Continue with fallback - show vendors without travel times
          travelTimeResults = vendorsWithCoords.map((v) => ({
            vendor: v,
            travelTime: null,
            state: getStateFromCoords(v.location.lat, v.location.lng),
            error: travelError.message,
          }));
        }

        // Process final results
        const finalVendors = travelTimeResults.map((result, i) => {
          const vendor = result.vendor;
          const travelTime = result.travelTime;
          const state = result.state;

          return {
            ...vendor,
            travelTime: travelTime ? Math.round(travelTime * 100) / 100 : null,
            state: state,
            hasRoute: travelTime !== null,
            error: result.error || null,
          };
        });

        console.log("Final vendors array:", finalVendors);
        setVendors(finalVendors);

        // Cache buyer location for future use
        if (!buyer.isFallback) {
          cacheBuyerLocation(buyer);
        }
      } catch (error) {
        console.error("Error in loadData:", error);
        setError(`Failed to load vendor data: ${error.message}`);
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
