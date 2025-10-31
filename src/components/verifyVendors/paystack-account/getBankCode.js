// import {supabase} from ""
import { supabase } from "../../../supabase-client";

export const getBankCode = async (bankName) => {
  try {
    const { data, error } = await supabase.functions.invoke("get-bank-code", {
      body: { bankName },
    });

    if (error || !data.success) {
      console.error("Error getting bank code:", error);
      return null;
    }

    return data.bankCode;
  } catch (error) {
    console.error("Exception:", error);
    return null;
  }
};
