import sgMail from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  throw new Error('SENDGRID_API_KEY is not defined in environment variables');
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export const sendEmail = async (options: SendEmailOptions): Promise<void> => {
  try {
    const msg = {
      to: options.to,
      from: {
        email: process.env.EMAIL_FROM!,
        name: process.env.EMAIL_FROM_NAME!,
      },
      subject: options.subject,
      text: options.text || options.html.replace(/<[^>]*>/g, ''),
      html: options.html,
    };

    await sgMail.send(msg);
    console.log('Email sent successfully');
  } catch (error: unknown) {
    console.error('Error sending email:');
    if (error instanceof Error) {
      console.error(error.message);
      if ('response' in error) {
        console.error('Error details:', (error as any).response?.body);
      }
    }
    throw error;
  }
};

export const sendVerificationEmail = async (
  email: string,
  verificationToken: string,
  frontendUrl: string = process.env.FRONTEND_URL || 'http://localhost:3000'
): Promise<void> => {
  const verificationUrl = `${frontendUrl}/auth/verify-email?token=${verificationToken}`;

  const message = `
    <h2>Email Verification</h2>
    <p>Please click the link below to verify your email address:</p>
    <a href="${verificationUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
      Verify Email
    </a>
    <p>Or copy and paste this link in your browser:</p>
    <p>${verificationUrl}</p>
    <p>This link will expire in 24 hours.</p>
  `;

  await sendEmail({
    to: email,
    subject: 'Email Verification - Continental Travels & Tours',
    html: message,
  });
};

export const sendPasswordResetEmail = async (
  email: string,
  resetToken: string,
  frontendUrl: string = process.env.FRONTEND_URL || 'http://localhost:3000'
): Promise<void> => {
  const resetUrl = `${frontendUrl}/auth/reset-password?token=${resetToken}`;

  const message = `
    <h2>Password Reset Request</h2>
    <p>You have requested to reset your password. Please click the link below to reset it:</p>
    <a href="${resetUrl}" style="background-color: #dc3545; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
      Reset Password
    </a>
    <p>Or copy and paste this link in your browser:</p>
    <p>${resetUrl}</p>
    <p>This link will expire in 10 minutes.</p>
    <p>If you did not request this, please ignore this email.</p>
  `;

  await sendEmail({
    to: email,
    subject: 'Password Reset Request - Continental Travels & Tours',
    html: message,
  });
};

export const sendWelcomeEmail = async (
  email: string,
  name: string
): Promise<void> => {
  const message = `
    <h2>Welcome to Continental Travels & Tours!</h2>
    <p>Hi ${name},</p>
    <p>Thank you for registering with us. We're excited to have you on board!</p>
    <p>You can now explore our amazing travel packages and book your next adventure.</p>
    <p>If you have any questions, feel free to contact us.</p>
    <p>Happy travels!</p>
    <p>Best regards,<br>Continental Travels & Tours Team</p>
  `;

  await sendEmail({
    to: email,
    subject: 'Welcome to Continental Travels & Tours',
    html: message,
  });
};

export const sendBookingConfirmation = async (
  email: string,
  name: string,
  bookingDetails: {
    bookingId: string;
    tourName: string;
    date: string;
    travelers: number;
    totalAmount: number;
  }
): Promise<void> => {
  const message = `
    <h2>Booking Confirmation</h2>
    <p>Dear ${name},</p>
    <p>Thank you for booking with Continental Travels & Tours!</p>
    
    <h3>Booking Details:</h3>
    <p><strong>Booking ID:</strong> ${bookingDetails.bookingId}</p>
    <p><strong>Tour:</strong> ${bookingDetails.tourName}</p>
    <p><strong>Date:</strong> ${bookingDetails.date}</p>
    <p><strong>Number of Travelers:</strong> ${bookingDetails.travelers}</p>
    <p><strong>Total Amount:</strong> $${bookingDetails.totalAmount.toFixed(2)}</p>
    
    <p>If you have any questions about your booking, please don't hesitate to contact us.</p>
    <p>We look forward to welcoming you on your adventure!</p>
    
    <p>Best regards,<br>Continental Travels & Tours Team</p>
  `;

  await sendEmail({
    to: email,
    subject: `Booking Confirmation #${bookingDetails.bookingId}`,
    html: message,
  });
};