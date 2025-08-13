export interface ApiError {
  message: string;
  code?: number;
  details?: Record<string, unknown>;
}