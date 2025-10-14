import { PAYSTACK_KEY } from "./getBankCode";
export const updateSubaccount = async (subaccountCode, updateData) => {
  try {
    const response = await fetch(
      `https://api.paystack.co/subaccount/${subaccountCode}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${PAYSTACK_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          business_name: updateData.business_name,
          settlement_bank: updateData.settlement_bank,
          account_number: updateData.account_number,
          primary_contact_email: updateData.primary_contact_email,
          primary_contact_name: updateData.primary_contact_name,
          primary_contact_phone: updateData.primary_contact_phone,
          description: `Updated subaccount for ${updateData.business_name}`,
        }),
      }
    );

    const result = await response.json();

    if (result.status) {
      console.log(`Subaccount updated successfully`);
      return {
        success: true,
        data: result.data,
      };
    } else {
      console.error(`Failed to update subaccount: ${result.message}`);
      return {
        success: false,
        error: result.message,
      };
    }
  } catch (error) {
    console.error("Error updating subaccount:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};
