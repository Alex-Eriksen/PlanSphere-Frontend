import { WritableSignal } from "@angular/core";

export interface ISignalPaginatedResponse<T = any> { // IPaginatedResponse is only for the data coming from backend
  currentPage: WritableSignal<number>;
  totalPages: WritableSignal<number>;
  totalCount: WritableSignal<number>;
  pageSize: WritableSignal<number>;
  results: WritableSignal<T[]>;
}
