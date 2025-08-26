const ORS_API_KEY = import.meta.env.VITE_LEAFLET_ORS_KEY;
export const getTravelTimes = async (buyer, vendors) => {
  const locations = [
    [buyer.lng, buyer.lat], // first = buyer
    ...vendors.map((v) => [v.location.lng, v.location.lat]),
  ];

  const body = {
    locations,
    sources: [0], // Buyer is source
    destinations: vendors.map((_, i) => i + 1), // Vendors as destinations
    metrics: ["duration"],
    units: "m",
  };

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
    console.error("ORS Error:", errText);
    throw new Error(`ORS API error ${res.status}`);
  }

  const data = await res.json();

  if (!data.durations) {
    console.warn("No route found, falling back to state name");
    return vendors.map((v) => ({
      vendor: v,
      travelTime: null,
      state: getStateFromCoords(v.location.lat, v.location.lng),
    }));
  }

  return vendors.map((v, i) => ({
    vendor: v,
    travelTime: data.durations[0][i] / 60, // minutes
    state: null,
  }));
};

function getStateFromCoords(lat, lng) {
  if (lat >= 8 && lat <= 9.5 && lng >= 7 && lng <= 8) return "Abuja (FCT)";
  if (lat >= 6 && lat <= 6.7 && lng >= 3 && lng <= 3.6) return "Lagos";
  if (lat >= 9 && lat <= 10 && lng >= 7 && lng <= 8) return "Nasarawa";
  return "Unknown State";
}
