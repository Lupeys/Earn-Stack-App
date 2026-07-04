import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM = process.env.RESEND_FROM || "verify@earnstack.ca";

export async function sendVerificationEmail(email: string, code: string): Promise<boolean> {
  if (!RESEND_API_KEY) {
    console.log(`[DEV] Verification code for ${email}: ${code}`);
    return true;
  }

  try {
    const resend = new Resend(RESEND_API_KEY);
    await resend.emails.send({
      from: RESEND_FROM,
      to: email,
      subject: "Verify your EarnStack account",
      html: `
        <div style="max-width:480px;margin:0 auto;font-family:system-ui,sans-serif">
          <h1 style="color:#059669">EarnStack</h1>
          <p>Your verification code is:</p>
          <p style="font-size:32px;font-weight:bold;letter-spacing:4px;background:#f0fdf4;padding:16px;border-radius:8px;text-align:center">${code}</p>
          <p style="color:#6b7280">This code expires in 10 minutes. If you didn't request this, you can ignore this email.</p>
        </div>
      `,
    });
    return true;
  } catch (err) {
    console.error("[Resend] Failed to send verification email:", err);
    return false;
  }
}
