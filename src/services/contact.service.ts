import { IContact, IContactInput, IContactResponse } from '../interfaces/contact.interface';
import Contact from '../models/contact.model';
import { sendEmail } from './email.service';

export const createContact = async (contactData: IContactInput): Promise<IContact> => {
  const contact = await Contact.create(contactData);

  // Send confirmation email to user
  try {
    await sendEmail({
      email: contactData.email,
      subject: 'We received your message',
      message: `Hi ${contactData.name},\n\nThank you for contacting Continental Travels & Tours. We have received your message and will get back to you as soon as possible.\n\nBest regards,\nContinental Travels & Tours Team`,
    });
  } catch (error) {
    console.error('Error sending confirmation email:', error);
  }

  return contact;
};

export const getContactById = async (contactId: string): Promise<IContact | null> => {
  return await Contact.findById(contactId).populate('respondedBy', 'name email');
};

export const getAllContacts = async (
  page: number = 1,
  limit: number = 10,
  filters?: { status?: string }
): Promise<{ contacts: IContact[]; total: number; pages: number }> => {
  const skip = (page - 1) * limit;
  const query: any = {};

  if (filters?.status) {
    query.status = filters.status;
  }

  const total = await Contact.countDocuments(query);
  const contacts = await Contact.find(query)
    .populate('respondedBy', 'name email')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  return {
    contacts,
    total,
    pages: Math.ceil(total / limit),
  };
};

export const updateContactStatus = async (
  contactId: string,
  status: 'new' | 'read' | 'responded' | 'closed'
): Promise<IContact | null> => {
  return await Contact.findByIdAndUpdate(
    contactId,
    { status },
    { new: true, runValidators: true }
  ).populate('respondedBy', 'name email');
};

export const respondToContact = async (
  contactId: string,
  responseData: IContactResponse,
  userId: string
): Promise<IContact | null> => {
  const contact = await Contact.findByIdAndUpdate(
    contactId,
    {
      response: responseData.response,
      status: 'responded',
      respondedAt: new Date(),
      respondedBy: userId,
    },
    { new: true, runValidators: true }
  ).populate('respondedBy', 'name email');

  // Send response email to user
  if (contact) {
    try {
      await sendEmail({
        email: contact.email,
        subject: `Response to your inquiry: ${contact.subject}`,
        message: `Hi ${contact.name},\n\n${responseData.response}\n\nBest regards,\nContinental Travels & Tours Team`,
      });
    } catch (error) {
      console.error('Error sending response email:', error);
    }
  }

  return contact;
};

export const deleteContact = async (contactId: string): Promise<IContact | null> => {
  return await Contact.findByIdAndDelete(contactId);
};

export const getContactStats = async (): Promise<any> => {
  const stats = await Contact.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  const result = {
    total: 0,
    new: 0,
    read: 0,
    responded: 0,
    closed: 0,
  };

  stats.forEach((stat: any) => {
    result[stat._id as keyof typeof result] = stat.count;
    result.total += stat.count;
  });

  return result;
};
