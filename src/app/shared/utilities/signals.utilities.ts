import { signal } from "@angular/core";
import { ISignalPaginatedResponse } from "../interfaces/signal-paginated-response.interface";
import { IPaginatedResponse } from "../interfaces/paginated-response.interface";

export function constructInitialSignalPaginatedResponse<T = any>(): ISignalPaginatedResponse<T> {
    return {
        currentPage: signal(1),
        pageSize: signal(10),
        totalPages: signal(0),
        totalCount: signal(0),
        results: signal([]),
    };
}

export const mapToSignalPaginatedResponse = (paginatedResponse: IPaginatedResponse): ISignalPaginatedResponse => {
    return {
        currentPage: signal(paginatedResponse.currentPage),
        totalCount: signal(paginatedResponse.totalCount),
        pageSize: signal(paginatedResponse.pageSize),
        totalPages: signal(paginatedResponse.totalPages),
        results: signal(paginatedResponse.results),
    };
};

export const copyPaginatedSignalResponse = (
    paginatedSignal1: ISignalPaginatedResponse,
    paginatedSignal2: ISignalPaginatedResponse,
) => {
    paginatedSignal1.results.set(paginatedSignal2.results());
    paginatedSignal1.totalPages.set(paginatedSignal2.totalPages());
    paginatedSignal1.totalCount.set(paginatedSignal2.totalCount());
    paginatedSignal1.pageSize.set(paginatedSignal2.pageSize());
};
