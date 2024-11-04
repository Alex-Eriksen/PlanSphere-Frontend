import { IPaginationPayload } from "./pagination-payload.interface";

export interface IPaginationSortPayload extends IPaginationPayload {
    sortBy?: string;
    sortDescending?: boolean;
}
