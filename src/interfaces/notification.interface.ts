export interface INotification {
  id?: number;
  user_id: number;
  type: 'booking_confirmed' | 'booking_cancelled' | 'review_replied' | 'trip_updated' | 'message';
  title: string;
  message: string;
  link?: string | null;
  read: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface INotificationInput {
  type: string;
  title: string;
  message: string;
  link?: string | null;
}

