import { Component, signal, WritableSignal, EffectRef, effect } from "@angular/core";
import { IPaginationSortPayload } from "../interfaces/pagination-sort-payload.interface";
import { ITableAction } from "../interfaces/table-action.interface";
import { ITableSortingFilter } from "../interfaces/table-sorting-filter.interface";
import { ITableHeader } from "../interfaces/table-header.interface";
import { constructInitialSignalPaginatedResponse } from "../utilities/signals.utilities";

@Component({
    standalone: true,
    template: "",
    styles: "",
})
export abstract class BasePaginatedTableWithSearchComponent<T = number, PType = IPaginationSortPayload> {
    actions: ITableAction<T>[] = [];
    abstract headers: ITableHeader[];
    abstract sortingFilterSignal: WritableSignal<ITableSortingFilter>;
    paginatedData = constructInitialSignalPaginatedResponse();
    isTableLoading = false;
    searchSignal: WritableSignal<string> = signal("");
    abstract readonly loadDataEffect$: EffectRef;
    readonly #resetPaginationOnSearchEffect$ = effect(
        () => {
            this.searchSignal();
            this.paginatedData.currentPage.set(1);
        },
        { allowSignalWrites: true },
    );

    abstract loadData(params: PType): void;
}
