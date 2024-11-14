import { Component, DestroyRef, effect, inject, input, OnInit, signal, WritableSignal } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { CompaniesPopupComponent } from "./components/companies-popup/companies-popup.component";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ICompaniesPopupInputs } from "./components/companies-popup/companies-popup-inputs.interface";
import { SmallListTableComponent } from "../small-list-table/small-list-table.component";
import { PaginationComponent } from "../pagination/pagination.component";
import { SubHeaderComponent } from "../sub-header/sub-header.component";
import { SmallHeaderComponent } from "../small-header/small-header.component";
import { SearchInputComponent } from "../search-input/search-input.component";
import { ButtonComponent } from "../button/button.component";
import { InputComponent } from "../input/input.component";
import { BasePaginatedTableWithSearchComponent } from "../base-paginated-table-with-search-abstract/base-paginated-table-with-search.abstract";
import { CompanyService } from "../../core/features/company/services/company.service";
import { DialogService } from "../../core/services/dialog.service";
import { ISignalPaginatedResponse } from "../interfaces/signal-paginated-response.interface";
import { ISmallListTableInput } from "../interfaces/small-list-table-input.interface";
import { constructInitialSignalPaginatedResponse, copyPaginatedSignalResponse } from "../utilities/signals.utilities";
import { companyTableHeaders } from "../table-headers/company-table.headers";
import { ITableSortingFilter } from "../interfaces/table-sorting-filter.interface";
import { ITableAction } from "../interfaces/table-action.interface";
import { IPaginationSortPayload } from "../interfaces/pagination-sort-payload.interface";

@Component({
    selector: 'ps-companies-list',
    standalone: true,
    imports: [
        SmallListTableComponent,
        PaginationComponent,
        SubHeaderComponent,
        TranslateModule,
        SmallHeaderComponent,
        SearchInputComponent,
        ButtonComponent,
        CompaniesPopupComponent,
        InputComponent
    ],
    templateUrl: './companies-list.component.html',
    styleUrl: './companies-list.component.scss'
})
export class CompaniesListComponent extends BasePaginatedTableWithSearchComponent implements OnInit {
    readonly #companyService = inject(CompanyService)
    isUserCompanies = input(false)
    organisationId = input.required<number>();
    readonly #dialogService = inject(DialogService)
    readonly #router = inject(Router)
    readonly #destroyRef = inject(DestroyRef)
    hasEditRights = input(false);
    override paginatedData: ISignalPaginatedResponse<ISmallListTableInput> = constructInitialSignalPaginatedResponse();
    headers = companyTableHeaders;
    sortingFilterSignal: WritableSignal<ITableSortingFilter> = signal({
        sortBy: "name",
        sortDescending: false,
    });
    readonly loadDataEffect$ = effect(() => {this.loadDataWithCorrectParams()});

    override actions: ITableAction[] = [
        {
            callbackFn: (row: ISmallListTableInput) => this.#router.navigate(['company',row.id]),
            labelFn: () => "COMPANY.COMPANY_DETAILS"
        },
        {
            callbackFn: (row: ISmallListTableInput) => this.#openDeleteDialog(row),
            labelFn: () => "COMPANY.DELETE.TITLE",
            isVisible: () => !this.isUserCompanies() && this.hasEditRights()
        }
    ]

    ngOnInit(){
        this.isTableLoading = true;
        this.loadDataWithCorrectParams();
        this.isTableLoading = false;
    }

    readonly #isDeletingCompany = signal(false);
    readonly #matDialog = inject(MatDialog);
    override loadData(params: IPaginationSortPayload) {
        this.isTableLoading = true;
        this.#companyService.listCompanies(this.organisationId(), params, this.isUserCompanies()).subscribe((paginatedProperties) => {
            copyPaginatedSignalResponse(this.paginatedData, paginatedProperties);
        })
        this.isTableLoading = false;
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

    #openDeleteDialog(row: ISmallListTableInput): void {
        this.#dialogService.open(
            {
                title: "COMPANY.DELETE.TITLE",
                tooltipLabel: "COMPANY.DELETE.TOOLTIP",
                callBack: () => this.#deleteCompany(row.id),
                submitLabel: "CONFIRM",
                isInputIncluded: false,
                descriptions: ["COMPANY.DELETE.QUESTION", "COMPANY.DELETE.CONFIRMATION"],
                isSubmitLoading: this.#isDeletingCompany,
                cancelLabel: "CANCEL",
            },
            "confirmation"
        );
    }

    #deleteCompany(id: number): void {
        this.#isDeletingCompany.set(true);
        this.#companyService.deleteCompany(this.organisationId(), id).subscribe({
            next: () => this.loadDataWithCorrectParams(),
            complete: () => {
                this.#isDeletingCompany.set(false);
                this.#dialogService.close();
            }
        });
    }

    openCompanyPopup() : void {
        this.#matDialog.open<CompaniesPopupComponent, ICompaniesPopupInputs>(CompaniesPopupComponent, {
            minWidth: "50dvh",
            maxHeight: "95dvh",
            data: {
                sourceLevelId: this.organisationId()
            }
        })
            .afterClosed()
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe(() => { this.loadDataWithCorrectParams();})
    }

}
