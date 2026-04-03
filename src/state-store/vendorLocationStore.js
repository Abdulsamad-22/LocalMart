import { create } from "zustand";
import { supabase } from "../supabase-client";
import { cacheBuyerLocation } from "../components/Utils/cacheBuyerLocation";
import getBuyerLocation from "../components/Context/deliveryTime/getBuyerLocation";

const useStoreLocation = create((set) => ({
  vendors: [],
  loading: true,
  error: null,

  loadData: async () => {
    set({ loading: true, error: null });
    try {
      const { data: vendorData, error: dbError } = await supabase
        .from("vendors")
        .select("*");

      if (dbError) {
        console.error("Database error", dbError);
        throw dbError;
      }

      if (!vendorData || vendorData.length === 0) {
        console.warn("No vendors found in database");
        set({ vendors: [], loading: false });
        return;
      }

      // Get buyer location without failling
      let buyer = null;
      let shouldCalculateDistance = false;

      if (!buyer) {
        try {
          buyer = await getBuyerLocation(10000);
          if (buyer?.lat && buyer?.lng) {
            shouldCalculateDistance = true;
          }
        } catch (locationError) {
          console.error("Failed to get buyer location:", locationError);
          shouldCalculateDistance = false;
        }
      } else {
        shouldCalculateDistance = true; // cache hit, skip re-fetching
      }

      if (!shouldCalculateDistance) {
        const vendorsWithoutDistance = vendorData.map((v) => ({
          name: v.business_name,
          address: v.business_address,
          id: v.vendor_id,
          location: null,
          travelTime: null,
          hasRoute: false,
        }));
        set({ vendors: vendorsWithoutDistance, loading: false });
        return;
      }
      // Geocode vendor addresses
      const vendorsWithCoords = [];
      for (const v of vendorData) {
        if (!v.business_address) continue;

        try {
          const coords = await geocodeVendorAddress(v.business_address);
          if (coords?.lat && coords?.lng) {
            vendorsWithCoords.push({
              name: v.business_name,
              address: v.business_address,
              id: v.vendor_id,
              location: coords,
            });
          }
        } catch (geocodeError) {
          console.error(
            `Geocoding failed for ${v.business_name}:`,
            geocodeError,
          );
        }
      }

      if (vendorsWithCoords.length === 0) {
        const vendorsWithoutCoords = vendorData.map((v) => ({
          name: v.business_name,
          address: v.business_address,
          id: v.vendor_id,
          location: null,
          travelTime: null,
          hasRoute: false,
        }));
        set({ vendors: vendorsWithoutCoords, loading: false });
        return;
      }

      // Calculate travel times
      let travelTimeResults;
      try {
        travelTimeResults = await getTravelTimes(buyer, vendorsWithCoords);
      } catch (travelError) {
        console.error("Travel time calculation failed:", travelError);
        travelTimeResults = vendorsWithCoords.map((v) => ({
          vendor: v,
          travelTime: null,
          error: travelError.message,
        }));
      }

      const finalVendors = travelTimeResults.map((result) => {
        const travelTime = result.travelTime;
        const shouldShowTime = travelTime !== null && travelTime <= 240;
        return {
          ...result.vendor,
          travelTime: shouldShowTime
            ? Math.round(travelTime * 100) / 100
            : null,
          hasRoute: shouldShowTime,
          error: result.error || null,
        };
      });

      set({ vendors: finalVendors, loading: false });
      console.log(
        "Vendor data loaded with location and travel times:",
        finalVendors,
      );

      // Cache buyer location only if it's a fresh real location
      if (buyer && !buyer.isFallback) {
        cacheBuyerLocation(buyer);
      }
    } catch (error) {
      console.error("Error in loadData:", error);

      // Fallback — load vendors without any location data
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
            hasRoute: false,
          }));
          set({ vendors: fallbackVendors, loading: false });
        }
      } catch (fallbackError) {
        // fixed: now actually sets the error state so UI can show it
        set({
          error: `Failed to load vendor data: ${error.message}`,
          loading: false,
        });
      }
    }
  },
}));

export default useStoreLocation;
