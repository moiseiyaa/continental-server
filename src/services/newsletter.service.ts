import { INewsletter, INewsletterInput } from '../interfaces/newsletter.interface';
import Newsletter from '../models/newsletter.model';
import { sendEmail } from './email.service';

export const subscribeToNewsletter = async (data: INewsletterInput): Promise<INewsletter> => {
  // Check if already subscribed
  const existing = await Newsletter.findOne({ email: data.email });
  if (existing) {
    if (existing.isActive) {
      throw new Error('Email already subscribed to newsletter');
    }
    // Reactivate if previously unsubscribed
    existing.isActive = true;
    existing.unsubscribedAt = null;
    return await existing.save();
  }

  const subscriber = await Newsletter.create(data);

  // Send welcome email
  try {
    await sendEmail({
      email: data.email,
      subject: 'Welcome to Continental Travels & Tours Newsletter',
      message: `Hi ${data.name || 'there'},\n\nThank you for subscribing to our newsletter. You'll now receive updates about our latest tours, special offers, and travel tips.\n\nBest regards,\nContinental Travels & Tours Team`,
    });
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }

  return subscriber;
};

export const unsubscribeFromNewsletter = async (email: string): Promise<INewsletter | null> => {
  return await Newsletter.findOneAndUpdate(
    { email },
    {
      isActive: false,
      unsubscribedAt: new Date(),
    },
    { new: true }
  );
};

export const getNewsletterSubscriber = async (email: string): Promise<INewsletter | null> => {
  return await Newsletter.findOne({ email });
};

export const getAllSubscribers = async (
  page: number = 1,
  limit: number = 10,
  activeOnly: boolean = true
): Promise<{ subscribers: INewsletter[]; total: number; pages: number }> => {
  const skip = (page - 1) * limit;
  const query: any = {};

  if (activeOnly) {
    query.isActive = true;
  }

  const total = await Newsletter.countDocuments(query);
  const subscribers = await Newsletter.find(query)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  return {
    subscribers,
    total,
    pages: Math.ceil(total / limit),
  };
};

export const deleteSubscriber = async (email: string): Promise<INewsletter | null> => {
  return await Newsletter.findOneAndDelete({ email });
};

export const getNewsletterStats = async (): Promise<any> => {
  const total = await Newsletter.countDocuments();
  const active = await Newsletter.countDocuments({ isActive: true });
  const unsubscribed = await Newsletter.countDocuments({ isActive: false });

  return {
    total,
    active,
    unsubscribed,
    unsubscribeRate: total > 0 ? ((unsubscribed / total) * 100).toFixed(2) : 0,
  };
};

export const sendNewsletterEmail = async (
  subject: string,
  message: string
): Promise<{ sent: number; failed: number }> => {
  const subscribers = await Newsletter.find({ isActive: true });
  let sent = 0;
  let failed = 0;

  for (const subscriber of subscribers) {
    try {
      await sendEmail({
        email: subscriber.email,
        subject,
        message,
      });
      sent++;
    } catch (error) {
      console.error(`Failed to send email to ${subscriber.email}:`, error);
      failed++;
    }
  }

  return { sent, failed };
};
