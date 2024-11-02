export interface IPaginatedResponse<T = any> {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  results: T[];
}
