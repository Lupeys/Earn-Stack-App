const BASE_URL =
  process.env.PAYPAL_ENV === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

async function getAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_SECRET;

  if (!clientId || !secret) {
    throw new Error("PAYPAL_CLIENT_ID and PAYPAL_SECRET must be set in .env");
  }

  const credentials = Buffer.from(`${clientId}:${secret}`).toString("base64");
  const res = await fetch(`${BASE_URL}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`PayPal token fetch failed: ${err}`);
  }

  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

export interface PayPalPayoutResult {
  success: boolean;
  batch_id?: string;
  error?: string;
}

export async function sendPayPalPayout(
  paypalEmail: string,
  amountCAD: number,
  internalPayoutId: number
): Promise<PayPalPayoutResult> {
  // Dev / sandbox mode: skip real API call when no credentials present
  if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_SECRET) {
    console.log(
      `[PayPal DEV] Would send $${amountCAD.toFixed(2)} CAD to ${paypalEmail} (payout #${internalPayoutId})`
    );
    return { success: true, batch_id: `DEV_BATCH_${internalPayoutId}` };
  }

  try {
    const token = await getAccessToken();

    const body = {
      sender_batch_header: {
        sender_batch_id: `earnstack_${internalPayoutId}_${Date.now()}`,
        email_subject: "Your EarnStack payout is on the way",
        email_message:
          "Your earnings have been approved and sent to your PayPal account. Thanks for completing tasks on EarnStack.ca.",
      },
      items: [
        {
          recipient_type: "EMAIL",
          amount: {
            value: amountCAD.toFixed(2),
            currency: "CAD",
          },
          receiver: paypalEmail,
          note: `EarnStack payout #${internalPayoutId}`,
          sender_item_id: `item_${internalPayoutId}`,
        },
      ],
    };

    const res = await fetch(`${BASE_URL}/v1/payments/payouts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = (await res.json()) as { message?: string };
      return {
        success: false,
        error: err.message ?? `PayPal API error: ${res.status}`,
      };
    }

    const data = (await res.json()) as {
      batch_header: { payout_batch_id: string };
    };

    return {
      success: true,
      batch_id: data.batch_header.payout_batch_id,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown PayPal error",
    };
  }
}
