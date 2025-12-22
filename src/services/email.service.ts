import nodemailer from 'nodemailer';

interface EmailOptions {
  email: string;
  subject: string;
  message: string;
}

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  const transporter = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE || 'gmail',
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_FROM_EMAIL || process.env.SMTP_EMAIL,
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  await transporter.sendMail(mailOptions);
};

export const sendVerificationEmail = async (
  email: string,
  verificationToken: string,
  frontendUrl: string = 'http://localhost:3000'
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
    email,
    subject: 'Email Verification - Continental Travels & Tours',
    message,
  });
};

export const sendPasswordResetEmail = async (
  email: string,
  resetToken: string,
  frontendUrl: string = 'http://localhost:3000'
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
    email,
    subject: 'Password Reset Request - Continental Travels & Tours',
    message,
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
    email,
    subject: 'Welcome to Continental Travels & Tours',
    message,
  });
};
