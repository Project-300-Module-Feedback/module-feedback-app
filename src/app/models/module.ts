import { Course } from './course';

export interface ModuleSummary {
  _id: string;
  code: string;
  name: string;
  courseIds: Course[];
  year: number;
  semester: number;
  credits: number;
  assessment?: string;
  averageRating: number | null;
  averageHoursPerWeek: number | null;
  reviewCount: number;
  recommendedPercentage: number | null;
}

export interface ModuleReview {
  _id: string;
  overall: number;
  hoursPerWeek?: number;
  recommend: boolean;
  yearTaken: string;
  headline: string;
  body: string;
  createdAt?: string;
}

export interface ModuleDetail {
  module: ModuleSummary;
  reviews: ModuleReview[];
  ratingDistribution: { rating: number; count: number }[];
}