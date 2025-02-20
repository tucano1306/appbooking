export interface ReviewUser {
  id: number;
  firstName: string;
  lastName: string;
}

export interface Review {
  id: number;
  userId: number;
  hotelId: number;
  rating: number;
  comment: string;
  user: ReviewUser;
  createdAt: string;
}