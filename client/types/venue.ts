export interface BookedDateRange {
  startDate: string;
  endDate: string;
}

export interface BlockedDateRange {
  startDate: string;
  endDate: string;
  blockedReason: string;
}

export interface Venue {
  id: string;
  name: string;
  description: string;
  type: string;
  address: string;
  city: string;
  pricePerDay: number;
  capacity: number;
  availableFrom: string;
  availableTo: string;
  bookedDates: BookedDateRange[];
  blockedDates: BlockedDateRange[];
  status: string;
  amenities: string[];
  images: string[];

  isAdvanceRequired: boolean;
  advancePercentage: number | null;
  balanceDueDaysBeforeEvent: number | null;

  isCancellationAllowed: boolean;
  cancellationDeadlineDays: number | null;
}

export interface CreateVenueRequest {
  name: string;
  description: string;
  type: string;
  address: string;
  city: string;
  pricePerDay: number;
  capacity: number;
  availableFrom: string;
  availableTo: string;
  amenities: string[];
  images?: string[];
  isAdvanceRequired: boolean;
  advancePercentage?: number;
  balanceDueDaysBeforeEvent?: number;
  isCancellationAllowed: boolean;
  cancellationDeadlineDays?: number;
}

export interface VenueSearchParams {
  city?: string;
  type?: string;
  capacity?: number;
  maxPrice?: number;
  startDate?: string;
  endDate?: string;
}