export interface Rating {
  id?: string;
  instructorId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt?: Date;
}

export interface RatingForm {
  rating: number;
  comment: string;
}
