import { useEffect } from "react";
import useStoreLocation from "../state-store/vendorLocationStore";

export default function VendorLocationInitializer() {
  const loadData = useStoreLocation((state) => state.loadData);

  useEffect(() => {
    loadData();
  }, []);
  return null;
}
