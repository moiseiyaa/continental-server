import sgMail from '@sendgrid/mail';

// Ensure SENDGRID_API_KEY is set at startup
if (!process.env.SENDGRID_API_KEY) {
  throw new Error('SENDGRID_API_KEY environment variable is not defined');
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Options for sending an email via SendGrid.
 */
export interface SendGridEmailOptions {
  /** Recipient email address */
  to: string;
  /** Email subject */
  subject: string;
  /** HTML body */
  html: string;
  /** Optional plain-text body. If omitted we strip HTML tags from `html`. */
  text?: string;
}

/**
 * Send an email using the SendGrid Web API.
 *
 * Throws the underlying error if the SendGrid request fails so that callers
 * can decide how to handle retries.
 */
export async function sendEmailViaSendGrid(options: SendGridEmailOptions): Promise<void> {
  const msg = {
    to: options.to,
    from: {
      email: process.env.EMAIL_FROM as string,
      name: process.env.EMAIL_FROM_NAME || 'Continental Travels & Tours',
    },
    subject: options.subject,
    text: options.text ?? options.html.replace(/<[^>]*>/g, ''),
    html: options.html,
  } as const;

  try {
    await sgMail.send(msg);
    // Optionally log success, but avoid leaking PII in production logs
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.log(`SendGrid: email queued to ${options.to}`);
    }
  } catch (err) {
    // Provide detailed logging while maintaining type safety
    const error = err as unknown;
    if (error && typeof error === 'object') {
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      const sgError = error as { message?: string; response?: { body?: unknown } };
      // eslint-disable-next-line no-console
      console.error('SendGrid error:', sgError.message ?? error);
      if (sgError.response?.body) {
        // eslint-disable-next-line no-console
        console.error('SendGrid response body:', sgError.response.body);
      }
    } else {
      // eslint-disable-next-line no-console
      console.error('Unknown error while sending email via SendGrid', error);
    }
    throw error;
  }
}
