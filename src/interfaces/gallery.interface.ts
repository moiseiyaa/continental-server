export interface IGallery {
  _id?: string;
  trip: string;
  title: string;
  description?: string;
  imageUrl: string;
  publicId: string;
  uploadedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IGalleryInput {
  trip: string;
  title: string;
  description?: string;
}
