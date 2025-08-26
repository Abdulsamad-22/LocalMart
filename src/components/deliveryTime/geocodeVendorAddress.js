const ORS_API_KEY = import.meta.env.VITE_LEAFLET_ORS_KEY;

export const geocodeAddress = async (address) => {
  const res = await fetch(
    `https://api.openrouteservice.org/geocode/search?api_key=${ORS_API_KEY}&text=${encodeURIComponent(
      address
    )}`
  );

  const data = await res.json();
  if (data.features.length === 0) return null;

  return {
    lat: data.features[0].geometry.coordinates[1],
    lng: data.features[0].geometry.coordinates[0],
  };
};
