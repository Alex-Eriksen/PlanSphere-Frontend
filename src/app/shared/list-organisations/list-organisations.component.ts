import { Component, DestroyRef, effect, inject, input, OnInit, signal, WritableSignal } from "@angular/core";
import { constructInitialSignalPaginatedResponse, copyPaginatedSignalResponse } from "../utilities/signals.utilities";
import { ISignalPaginatedResponse } from "../interfaces/signal-paginated-response.interface";
import { ISmallListTableInput } from "../interfaces/small-list-table-input.interface";
import { BasePaginatedTableWithSearchComponent } from "../base-paginated-table-with-search-abstract/base-paginated-table-with-search.abstract";
import { organisationHeaders } from "../table-headers/organisation.headers";
import { ITableSortingFilter } from "../interfaces/table-sorting-filter.interface";
import { MatDialog } from "@angular/material/dialog";
import { DialogService } from "../ui-services/small-dialog.service";
import { PaginationComponent } from "../pagination/pagination.component";
import { SmallListTableComponent } from "../small-list-table/small-list-table.component";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ITableAction } from "../interfaces/table-action.interface";
import { OrganisationPopupComponent } from "./organisation-popup/organisation-popup.component";
import { IOrganisationPopupInputs } from "./organisation-popup/organisation-popup-inputs.interfaces";
import { ButtonComponent } from "../button/button.component";
import { SearchInputComponent } from "../search-input/search-input.component";
import { SmallHeaderComponent } from "../small-header/small-header.component";
import { SubHeaderComponent } from "../sub-header/sub-header.component";
import { TranslateModule } from "@ngx-translate/core";
import { IPaginationSortPayload } from "../interfaces/pagination-sort-payload.interface";
import { OrganisationService } from "../../core/features/organisations/services/organisation.service";

@Component({
  selector: 'ps-list-organisations',
  standalone: true,
    imports: [
        PaginationComponent,
        SmallListTableComponent,
        ButtonComponent,
        SearchInputComponent,
        SmallHeaderComponent,
        SubHeaderComponent,
        TranslateModule
    ],
  templateUrl: './list-organisations.component.html',
  styleUrl: './list-organisations.component.scss'
})
export class ListOrganisationsComponent extends BasePaginatedTableWithSearchComponent implements OnInit{
    readonly #organisationService = inject(OrganisationService);
    override paginatedData: ISignalPaginatedResponse<ISmallListTableInput> = constructInitialSignalPaginatedResponse();
    readonly #matDialog = inject(MatDialog);
    readonly #dialogService = inject(DialogService);
    readonly #isDeletingOrganisation = signal(false);
    readonly #destroyRef = inject(DestroyRef);
    sourceLevelId = input.required<number>();
    headers = organisationHeaders;
    sortingFilterSignal: WritableSignal<ITableSortingFilter> = signal({
        sortBy: "name",
        sortDescending: false,
    });

    readonly loadDataEffect$ = effect(() => {this.loadDataWithCorrectParams()});

    override actions: ITableAction[] = [
        {
            callbackFn: (row: ISmallListTableInput) => this.openOrganisationPopup(true, row),
            labelFn: () => "ORGANISATION.EDIT.TITLE",
        },
        {
            callbackFn: (row: ISmallListTableInput) => this.#openDeleteDialog(row),
            labelFn: () => "ORGANISATION.DELETE.TITLE",
        },
    ]

    ngOnInit() {
        this.isTableLoading = true;
        this.loadDataWithCorrectParams();
    }

    override loadData(params: IPaginationSortPayload): void {
        this.isTableLoading = true;
        this.#organisationService.getListOfOrganisations(params).subscribe((paginatedProperties) => {
            copyPaginatedSignalResponse(this.paginatedData, paginatedProperties);
            this.isTableLoading = false;
        });
    }


    loadDataWithCorrectParams(): void {
        this.loadData({
            sortBy: this.sortingFilterSignal().sortBy,
            sortDescending: this.sortingFilterSignal().sortDescending,
            pageSize: this.paginatedData.pageSize(),
            pageNumber: this.paginatedData.currentPage(),
            search: this.searchSignal()
        });
    }

    openOrganisationPopup(isEditPopup: boolean, row?: ISmallListTableInput) {
        this.#matDialog.open<OrganisationPopupComponent, IOrganisationPopupInputs>(OrganisationPopupComponent, {
            minWidth: "75dvw",
            maxHeight: "95dvh",
            data: {
                sourceLevelId: row != null ? row.id : this.sourceLevelId(),
                isEditPopup: isEditPopup,
            }
        })
            .afterClosed()
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe(() => { this.loadDataWithCorrectParams(); })
    }

    #openDeleteDialog(row: ISmallListTableInput) {
        this.#dialogService.open(
            {
                title: 'ORGANISATION.DELETE.TITLE',
                tooltipLabel: "ORGANISATION.DELETE.TOOLTIP",
                callBack: () => this.#deleteOrganisation(row.id),
                submitLabel: "CONFIRM",
                isInputIncluded: false,
                descriptions: ["ORGANISATION.DELETE.QUESTION", "ORGANISATION.DELETE.CONFIRMATION"],
                isSubmitLoading: this.#isDeletingOrganisation,
                cancelLabel: "CANCEL",
            },
            "warning"
        )
    }

    #deleteOrganisation(id: number): void {
        this.#isDeletingOrganisation.set(true);
        this.#organisationService.delete(id).subscribe({
            next: () => this.loadDataWithCorrectParams(),
            complete: () => {
                this.#isDeletingOrganisation.set(false);
                this.#dialogService.close();
            },
        });
    }

}
