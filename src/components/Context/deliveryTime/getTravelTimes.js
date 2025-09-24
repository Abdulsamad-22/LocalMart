const ORS_API_KEY = import.meta.env.VITE_LEAFLET_ORS_KEY;
export const getTravelTimes = async (buyer, vendors) => {
  // Validate inputs
  if (!buyer || !buyer.lat || !buyer.lng) {
    throw new Error("Invalid buyer location");
  }

  // Validate vendor locations
  const validVendors = vendors.filter(
    (v) => v.location && v.location.lat && v.location.lng
  );

  if (validVendors.length === 0) {
    console.error("No vendors have valid locations");
    return vendors.map((v) => ({
      vendor: v,
      travelTime: null,
      state: getStateFromCoords(v.location?.lat, v.location?.lng),
    }));
  }

  const locations = [
    [buyer.lng, buyer.lat],
    ...validVendors.map((v) => [v.location.lng, v.location.lat]),
  ];

  const body = {
    locations,
    sources: [0], // Buyer is source
    destinations: validVendors.map((_, i) => i + 1), // Vendors as destinations
    metrics: ["duration"],
    units: "m", // meters for duration (seconds)
  };

  try {
    const res = await fetch(
      "https://api.openrouteservice.org/v2/matrix/driving-car",
      {
        method: "POST",
        headers: {
          Authorization: ORS_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error("ORS Error Response:", errText);

      // Try to parse error for more info
      try {
        const errorObj = JSON.parse(errText);
        console.error("Parsed error:", errorObj);
      } catch (e) {
        console.error("Raw error text:", errText);
      }

      throw new Error(`ORS API error ${res.status}: ${errText}`);
    }

    const data = await res.json();
    console.log("ORS Response data:", data);

    // Check if durations array exists and has valid data
    if (!data.durations || !data.durations[0]) {
      console.warn("No durations in response, falling back to state names");
      return vendors.map((v) => ({
        vendor: v,
        travelTime: null,
        state: getStateFromCoords(v.location?.lat, v.location?.lng),
      }));
    }

    const durations = data.durations[0]; // First row (from buyer to all vendors)
    console.log("Durations array:", durations);

    // Map results back to original vendors array using business_name as identifier
    return vendors.map((vendor, originalIndex) => {
      // Find this vendor's index in validVendors by comparing business names
      const validIndex = validVendors.findIndex((v) => v.name === vendor.name);

      if (validIndex === -1) {
        // This vendor wasn't in validVendors (invalid location)
        return {
          vendor,
          travelTime: null,
          state: getStateFromCoords(vendor.location?.lat, vendor.location?.lng),
        };
      }

      const durationSeconds = durations[validIndex];
      console.log(`Vendor ${vendor.name}: ${durationSeconds} seconds`);

      return {
        vendor,
        travelTime: durationSeconds !== null ? durationSeconds / 60 : null, // Convert to minutes
        state:
          durationSeconds === null
            ? getStateFromCoords(vendor.location.lat, vendor.location.lng)
            : null,
      };
    });
  } catch (error) {
    console.error("Error in getTravelTimes:", error);

    // Return fallback data with state information
    return vendors.map((v) => ({
      vendor: v,
      travelTime: null,
      state: getStateFromCoords(v.location?.lat, v.location?.lng),
      error: error.message,
    }));
  }
};

function getStateFromCoords(lat, lng) {
  if (lat >= 8 && lat <= 9.5 && lng >= 7 && lng <= 8) return "Abuja (FCT)";
  if (lat >= 6 && lat <= 6.7 && lng >= 3 && lng <= 3.6) return "Lagos";
  if (lat >= 9 && lat <= 10 && lng >= 7 && lng <= 8) return "Nasarawa";
  return "Unknown State";
}
