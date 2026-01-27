import sgMail from '@sendgrid/mail';
import {
  verificationTemplate,
  passwordResetTemplate,
  welcomeTemplate,
  bookingConfirmationTemplate,
  BookingDetails,
  contactConfirmationTemplate,
  newsletterWelcomeTemplate,
} from '../templates/emailTemplates';

// Make email service optional for development
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
} else {
  console.warn('⚠️  SENDGRID_API_KEY not set - email functionality disabled');
}

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export const sendEmail = async (options: SendEmailOptions): Promise<void> => {
  // Skip email if API key not configured (development mode)
  if (!process.env.SENDGRID_API_KEY) {
    console.log(`📧 [DEV MODE] Email would be sent to: ${options.to}`);
    console.log(`📧 [DEV MODE] Subject: ${options.subject}`);
    return;
  }

  try {
    const msg = {
      to: options.to,
      from: {
        email: process.env.EMAIL_FROM || 'noreply@continental.com',
        name: process.env.EMAIL_FROM_NAME || 'Continental Travels',
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

  const message = verificationTemplate(verificationUrl);

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

  const message = passwordResetTemplate(resetUrl);

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
  const message = welcomeTemplate(name);

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
  const message = bookingConfirmationTemplate(name, bookingDetails as BookingDetails);

  await sendEmail({
    to: email,
    subject: `Booking Confirmation #${bookingDetails.bookingId}`,
    html: message,
  });
};