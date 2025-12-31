export interface INewsletter {
  _id?: string;
  email: string;
  name?: string;
  isActive: boolean;
  unsubscribedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface INewsletterInput {
  email: string;
  name?: string;
}
