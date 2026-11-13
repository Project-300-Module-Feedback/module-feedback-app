export interface ModuleItem {
  _id: string;
  code: string;
  name: string;
  year: number;
  semester: number;
  reviewCount?: number;
}

export interface Review {
  _id: string;
  overall: number;
  teaching: number;
  content: number;
  assessmentFairness: number;
  hoursPerWeek?: number;
  yearTaken: string;
  recommend: boolean;
  headline: string;
  body: string;
  createdAt: string;
}

export interface ReviewStats {
  overall: number | null;
  teaching: number | null;
  content: number | null;
  assessmentFairness: number | null;
  hoursPerWeek: number | null;
  recommendPercent: number | null;
}

export interface ModuleReviews {
  count: number;
  enough: boolean;
  minReviews: number;
  stats: ReviewStats | null;
  ratings: { rating: number; count: number }[];
  reviews: Review[];
}

// what the review form sends to POST /reviews
export interface NewReview {
  moduleId: string;
  overall: number;
  teaching: number;
  content: number;
  assessmentFairness: number;
  hoursPerWeek: number;
  yearTaken: string;
  recommend: boolean;
  headline: string;
  body: string;
}