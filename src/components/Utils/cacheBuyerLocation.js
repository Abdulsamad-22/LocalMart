const LOCATION_CACHE_KEY = "buyer_location_cache";
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

/*
  Cache buyer location in localStorage
 */
export const cacheBuyerLocation = (location) => {
  try {
    const cacheData = {
      location,
      timestamp: Date.now(),
    };
    localStorage.setItem(LOCATION_CACHE_KEY, JSON.stringify(cacheData));
    console.log("Location cached:", location);
  } catch (error) {
    console.error("Failed to cache location:", error);
  }
};

/*
  Get cached buyer location if still valid
 */
export const getCachedBuyerLocation = () => {
  try {
    const cached = localStorage.getItem(LOCATION_CACHE_KEY);

    if (!cached) {
      console.log("No cached location found");
      return null;
    }

    const cacheData = JSON.parse(cached);
    const age = Date.now() - cacheData.timestamp;

    if (age > CACHE_DURATION) {
      console.log("Cached location expired");
      localStorage.removeItem(LOCATION_CACHE_KEY);
      return null;
    }

    console.log("Using cached location:", cacheData.location);
    return {
      ...cacheData.location,
      isCached: true,
    };
  } catch (error) {
    console.error("Failed to read cached location:", error);
    return null;
  }
};

/*
  Clear cached location
 */
export const clearCachedLocation = () => {
  localStorage.removeItem(LOCATION_CACHE_KEY);
};
