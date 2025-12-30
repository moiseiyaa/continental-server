// Centralized, responsive HTML e-mail templates for Continental Travels & Tours
// -----------------------------------------------------------------------------
// NOTE:  All styling is inline to maximise compatibility across e-mail clients.
//        Images use absolute URLs; update HOST_URL if you host assets elsewhere.
// -----------------------------------------------------------------------------

const HOST_URL = 'https://www.continentaltravelsandtours.com';
const LOGO_URL = `${HOST_URL}/images/ui/logo.png`;

/** Returns a full branded HTML document wrapping the supplied content. */
function baseTemplate(title: string, contentHtml: string): string {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="x-ua-compatible" content="ie=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
    <style>
      /* Mobile-friendly styles */
      body {margin:0;padding:0;font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif;background-color:#f4f4f7;color:#51545e;}
      a {color:#1a82e2;text-decoration:none;}
      .email-wrapper {width:100%;background-color:#f4f4f7;padding:20px 0;}
      .email-content {width:100%;}
      .email-body {background-color:#ffffff;width:100%;margin:0 auto;padding:0;border-top:1px solid #eaeaec;border-bottom:1px solid #eaeaec;}
      .content-cell {padding:35px;}
      h1 {margin-top:0;color:#333333;font-size:22px;font-weight:700;}
      p {font-size:16px;line-height:1.5;margin:0 0 15px;}
      .button {display:inline-block;background-color:#1a82e2;color:#ffffff;padding:12px 24px;border-radius:4px;font-size:16px;}
      .footer {width:100%;text-align:center;color:#6b6e76;font-size:12px;padding:20px 0;}
      @media only screen and (max-width:600px) { .content-cell {padding:20px;} h1 {font-size:20px;} }
    </style>
  </head>
  <body>
    <table role="presentation" class="email-wrapper" cellspacing="0" cellpadding="0" align="center">
      <tr>
        <td align="center">
          <table role="presentation" class="email-content" cellspacing="0" cellpadding="0" width="600">
            <!-- Logo -->
            <tr>
              <td style="text-align:center;padding:20px 10px;">
                <img src="${LOGO_URL}" alt="Continental Travels & Tours" style="width:120px; height:auto;" />
              </td>
            </tr>
            <!-- Email Body -->
            <tr>
              <td class="email-body">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td class="content-cell">
                      ${contentHtml}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <!-- Footer -->
            <tr>
              <td class="footer">
                <p>&copy; ${new Date().getFullYear()} Continental Travels & Tours. All rights reserved.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function verificationTemplate(verificationUrl: string): string {
  return baseTemplate(
    'Verify your email',
    `<h1>Confirm your email address</h1>
     <p>Click the button below to verify your email and activate your account.</p>
     <p style="text-align:center;">
       <a class="button" href="${verificationUrl}" target="_blank">Verify Email</a>
     </p>
     <p>If the button above does not work, copy and paste the following link into your browser:</p>
     <p><a href="${verificationUrl}">${verificationUrl}</a></p>`
  );
}

export function passwordResetTemplate(resetUrl: string): string {
  return baseTemplate(
    'Reset your password',
    `<h1>Reset password request</h1>
     <p>You recently requested to reset your password. Click the button below to choose a new one.</p>
     <p style="text-align:center;">
       <a class="button" href="${resetUrl}" target="_blank">Reset Password</a>
     </p>
     <p>This link will expire in 10 minutes. If you didn't request a password reset, you can safely ignore this email.</p>`
  );
}

export function welcomeTemplate(name: string): string {
  return baseTemplate(
    'Welcome to Continental Travels & Tours',
    `<h1>Welcome aboard, ${name}!</h1>
     <p>We're thrilled to have you join the Continental Travels family. Explore our tour packages and start planning your next adventure today.</p>
     <p>If you have any questions, just reply to this email—we're here to help.</p>
     <p>Happy travels!</p>`
  );
}

export interface BookingDetails {
  bookingId: string;
  tourName: string;
  date: string;
  travelers: number;
  totalAmount: number;
}

export function bookingConfirmationTemplate(name: string, d: BookingDetails): string {
  return baseTemplate(
    `Booking confirmation #${d.bookingId}`,
    `<h1>Booking confirmed!</h1>
     <p>Dear ${name}, thank you for booking with Continental Travels & Tours.</p>
     <h2 style="margin-top:25px;">Your trip details</h2>
     <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="font-size:15px;">
       <tr><td><strong>Booking ID:</strong></td><td>${d.bookingId}</td></tr>
       <tr><td><strong>Tour:</strong></td><td>${d.tourName}</td></tr>
       <tr><td><strong>Date:</strong></td><td>${d.date}</td></tr>
       <tr><td><strong>Travelers:</strong></td><td>${d.travelers}</td></tr>
       <tr><td><strong>Total Paid:</strong></td><td>$${d.totalAmount.toFixed(2)}</td></tr>
     </table>
     <p style="margin-top:25px;">We look forward to guiding you on this adventure!</p>`
  );
}

export function newsletterWelcomeTemplate(name?: string): string {
  return baseTemplate(
    'Welcome to our newsletter',
    `<h1>Hello${name ? ` ${name}` : ''}!</h1>
     <p>Thank you for subscribing to Continental Travels & Tours updates. Expect inspiring stories, special discounts, and travel tips landing in your inbox soon.</p>
     <p>Safe travels!</p>`
  );
}

export function contactConfirmationTemplate(name: string): string {
  return baseTemplate(
    'We received your message',
    `<h1>Hi ${name},</h1>
     <p>Thank you for reaching out to Continental Travels & Tours. We have received your message and our team will get back to you shortly.</p>
     <p>Warm regards,<br/>The Continental Travels Team</p>`
  );
}
