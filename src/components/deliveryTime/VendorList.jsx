import { useEffect, useState } from "react";
import { supabase } from "../../supabase-client";
import getBuyerLocation from "./GetBuyerLocation";
import { geocodeAddress } from "./GeocodeVendorAddress";
import { getTravelTimes } from "./getTravelTimes";

function getStateFromCoords(lat, lng) {
  if (!lat || !lng) return "Unknown State";
  if (lat >= 8 && lat <= 9.5 && lng >= 7 && lng <= 8) return "Abuja (FCT)";
  if (lat >= 6 && lat <= 6.7 && lng >= 3 && lng <= 3.6) return "Lagos State";
  if (lat >= 9 && lat <= 10 && lng >= 7 && lng <= 9) return "Nasarawa State";
  return "Unknown State";
}

export default function VendorList({ vendors, setVendors }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        console.log("=== VendorList Debug ===");

        // Fetch vendors from database
        console.log("Fetching vendors from database...");
        const { data: vendorData, error: dbError } = await supabase
          .from("vendors")
          .select("business_address, business_name");

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
          // console.log(
          //   `Processing vendor ${index + 1}/${vendorData.length}: ${
          //     v.business_name
          //   }`
          // );

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
      } catch (error) {
        console.error("Error in loadData:", error);
        setError(`Failed to load vendor data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div>
        <p>Loading vendors and calculating delivery times...</p>
        <p>
          <small>This may take a few moments</small>
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2>Error Loading Vendors</h2>
        <p style={{ color: "red" }}>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  if (vendors.length === 0) {
    return (
      <div>
        <h2>No Vendors Found</h2>
        <p>No vendors are currently available in your area.</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Available Vendors</h2>
      <p>Found {vendors.length} vendor(s)</p>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {vendors.map((vendor, i) => (
          <li
            key={vendor.name || i}
            style={{
              padding: "10px",
              border: "1px solid #ddd",
              margin: "5px 0",
              borderRadius: "5px",
            }}
          >
            <div>
              <strong>{vendor.name}</strong>
              <br />
              <small>{vendor.address}</small>
            </div>

            <div style={{ marginTop: "5px" }}>
              {vendor.hasRoute ? (
                <span style={{ color: "green" }}>
                  🚗 Delivery time: {vendor.travelTime} minutes
                </span>
              ) : vendor.state ? (
                <span style={{ color: "orange" }}>
                  📍 Located in: {vendor.state}
                </span>
              ) : (
                <span style={{ color: "red" }}>❌ Location unavailable</span>
              )}
            </div>

            {vendor.error && (
              <div style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>
                Error: {vendor.error}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
