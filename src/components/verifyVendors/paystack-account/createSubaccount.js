import { PAYSTACK_KEY } from "./getBankCode";
export const createSubaccount = async (vendorData, bankCode, accountName) => {
  try {
    const response = await fetch("https://api.paystack.co/subaccount", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAYSTACK_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        business_name: vendorData.business_name,
        settlement_bank: bankCode,
        account_number: vendorData.account_number,
        percentage_charge: 5,
        description: `Subaccount for ${vendorData.business_name}`,
        primary_contact_email: vendorData.email,
        primary_contact_name: accountName || vendorData.full_name,
        primary_contact_phone: vendorData.phone_number,
        metadata: {
          vendor_id: vendorData.vendor_id,
        },
      }),
    });
    const result = await response.json();

    if (result.status) {
      console.log(`Subaccount created: ${result.data.subaccount_code}`);
      return {
        success: true,
        subaccountCode: result.data.subaccount_code,
        data: result.data,
      };
    } else {
      console.error(`Failed to create subaccount: ${result.message}`);

      return {
        success: false,
        error: result.message,
      };
    }
  } catch (error) {
    console.error("Error creating subaccount:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};
