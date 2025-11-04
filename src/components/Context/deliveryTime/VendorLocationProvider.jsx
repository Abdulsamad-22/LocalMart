import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../../../supabase-client";
import getBuyerLocation from "./getBuyerLocation";
import { geocodeAddress } from "./GeocodeVendorAddress";
import { getTravelTimes } from "./getTravelTimes";

const LocationContext = createContext();
export const useVendorLocation = () => useContext(LocationContext);
getBuyerLocation;

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
        // .select("vendor_coords, business_address, business_name");

        if (dbError) {
          console.error("Database error:", dbError);
          throw dbError;
        }

        console.log("Raw vendor data:", vendorData);

        if (!vendorData || vendorData.length === 0) {
          console.warn("No vendors found in database");
          setVendors([]);
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
            // const coordsAdress = await geocodeAddress(v.coords_address);
            console.log(`Geocoding result for ${v.business_name}:`, coords);

            if (coords && coords.lat && coords.lng) {
              vendorsWithCoords.push({
                name: v.business_name,
                address: v.business_address,
                id: v.vendor_id,
                // address: v.coords_address,
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
          return;
        }

        // Get buyer location
        console.log("Getting buyer location...");
        let buyer;
        try {
          buyer = await getBuyerLocation();
          console.log("Buyer location:", buyer);
        } catch (locationError) {
          console.error("Failed to get buyer location:", locationError);
          setError(
            "Could not get your location. Please enable location services."
          );
          return;
        }

        if (!buyer || !buyer.lat || !buyer.lng) {
          console.error("Invalid buyer location:", buyer);
          setError("Invalid location data received");
          return;
        }

        // Step 4: Calculate travel times
        console.log("Calculating travel times...");
        let travelTimeResults;
        try {
          travelTimeResults = await getTravelTimes(buyer, vendorsWithCoords);
          console.log("Travel time results:", travelTimeResults);
        } catch (travelError) {
          console.error("Travel time calculation failed:", travelError);
          // Continue with fallback state data
          travelTimeResults = vendorsWithCoords.map((v) => ({
            vendor: v,
            travelTime: null,
            state: getStateFromCoords(v.location.lat, v.location.lng),
            error: travelError.message,
          }));
        }

        // Process final results
        const finalVendors = travelTimeResults.map((result, i) => {
          console.log(`Processing result ${i}:`, result);

          const vendor = result.vendor;
          const travelTime = result.travelTime;
          const state = result.state;

          return {
            ...vendor,
            travelTime: travelTime ? Math.round(travelTime * 100) / 100 : null, // Round to 2 decimals
            state: state,
            hasRoute: travelTime !== null,
            error: result.error || null,
          };
        });

        console.log("Final vendors array:", finalVendors);
        setVendors(finalVendors);
        console.log(vendors);
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

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <h2>Error Loading Vendors</h2>
        <p style={{ color: "red" }}>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

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
