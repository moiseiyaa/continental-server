export interface IReview {
  _id?: string;
  trip: string;
  user: string;
  rating: number;
  title: string;
  comment: string;
  helpful: number;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IReviewInput {
  trip: string;
  rating: number;
  title: string;
  comment: string;
}
