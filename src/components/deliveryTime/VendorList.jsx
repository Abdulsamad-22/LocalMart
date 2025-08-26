import { useEffect, useState } from "react";
import { supabase } from "../../supabase-client";
import getBuyerLocation from "./GetBuyerLocation";
import { geocodeAddress } from "./GeocodeVendorAddress";
import { getTravelTimes } from "./getTravelTimes";

function getStateFromCoords(lat, lng) {
  if (lat >= 8 && lat <= 9.5 && lng >= 7 && lng <= 8) return "Abuja (FCT)";
  if (lat >= 6 && lat <= 6.7 && lng >= 3 && lng <= 3.6) return "Lagos State";
  if (lat >= 9 && lat <= 10 && lng >= 7 && lng <= 9) return "Nasarawa State";
  return "Unknown State";
}

export default function VendorList() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const { data: vendorData, error } = await supabase
          .from("vendors")
          .select("business_address, business_name");

        if (error) throw error;

        const vendorsWithCoords = [];
        for (const v of vendorData) {
          const coords = await geocodeAddress(v.business_address);
          if (coords) {
            vendorsWithCoords.push({
              name: v.business_name,
              address: v.business_address,
              location: coords,
            });
            console.log("Vendor coords sent:", [coords.lng, coords.lat]);
          } else {
            console.warn("Skipped vendor:", v.business_address);
          }
        }

        const buyer = await getBuyerLocation();

        console.log("Buyer coords sent:", [buyer.lng, buyer.lat]);

        const travelTimes = await getTravelTimes(buyer, vendorsWithCoords);

        const finalVendors = vendorsWithCoords.map((v, i) => {
          const durationSec = travelTimes[i];
          return {
            ...v,
            travelTime: durationSec ? durationSec / 60 : null,
            state: !durationSec
              ? getStateFromCoords(v.location.lat, v.location.lng)
              : null,
          };
        });

        setVendors(finalVendors);
      } catch (error) {
        console.error("Error loading vendors:", error.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);
  if (loading) return <p>Loading vendors…</p>;
  return (
    <div>
      <h2>Test Vendor</h2>
      <ul>
        {vendors.map((v, i) => (
          <li key={i}>
            {v.id},
            {v.travelTime
              ? `delivery time: ${v.travelTime.toFixed(1)} mins away`
              : "no route found"}
          </li>
        ))}
      </ul>
    </div>
  );
}
