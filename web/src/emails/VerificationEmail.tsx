import { SITE_NAME, SITE_URL } from "@/lib/constants";

export function verificationEmailHtml(token: string): string {
  const verifyUrl = `${SITE_URL}/verify?token=${token}`;

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #0f172a;">
  <h2 style="color: #1d4ed8;">Verify your email</h2>
  <p>Thanks for subscribing to <strong>${SITE_NAME}</strong>!</p>
  <p>Click the button below to verify your email and start receiving job alerts:</p>
  <p style="text-align: center; margin: 30px 0;">
    <a href="${verifyUrl}" style="background-color: #1d4ed8; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
      Verify Email Address
    </a>
  </p>
  <p style="color: #64748b; font-size: 14px;">Or copy this link: ${verifyUrl}</p>
  <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
  <p style="color: #64748b; font-size: 12px;">If you didn't subscribe, you can safely ignore this email.</p>
</body>
</html>`;
}
