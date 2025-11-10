export default function getBuyerLocation(timeout = 10000) {
  return new Promise((resolve, reject) => {
    // Check if geolocation is supported
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser"));
      return;
    }

    // Set timeout
    const timeoutId = setTimeout(() => {
      reject(new Error("Location request timed out"));
    }, timeout);

    // Get current position
    navigator.geolocation.getCurrentPosition(
      (position) => {
        clearTimeout(timeoutId);
        console.log("Geolocation success:", position);

        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        });
      },
      (error) => {
        clearTimeout(timeoutId);
        console.error("Geolocation error:", error);

        let errorMessage;
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage =
              "Location permission denied. Please enable location access.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage =
              "Position update is unavailable. Please check your GPS.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out. Please try again.";
            break;
          default:
            errorMessage = "An unknown error occurred getting your location.";
        }

        reject(new Error(errorMessage));
      },
      {
        enableHighAccuracy: false, // Set to false for faster response
        timeout: timeout - 1000, // Give 1 second buffer
        maximumAge: 300000, // Accept cached position up to 5 minutes old
      }
    );
  });
}
