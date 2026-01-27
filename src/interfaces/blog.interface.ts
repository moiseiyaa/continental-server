export interface IBlog {
  _id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  category: string;
  tags: string[];
  featuredImage?: string;
  published: boolean;
  publishedAt?: Date;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBlogInput {
  title: string;
  slug?: string;
  content: string;
  excerpt: string;
  author: string;
  category: string;
  tags?: string[];
  featuredImage?: string;
  published?: boolean;
  publishedAt?: Date;
}

