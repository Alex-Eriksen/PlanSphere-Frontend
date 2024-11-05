import { Component, effect, inject, OnInit, signal, WritableSignal } from "@angular/core";
import { CompanyService } from "../../../../../../core/features/company/services/company.service";
import { IPaginationSortPayload } from "../../../../../../shared/interfaces/pagination-sort-payload.interface";
import { BasePaginatedTableWithSearchComponent } from "../../../../../../shared/base-paginated-table-with-search-abstract/base-paginated-table-with-search.abstract";
import { ISignalPaginatedResponse } from "../../../../../../shared/interfaces/signal-paginated-response.interface";
import { ISmallListTableInput } from "../../../../../../shared/interfaces/small-list-table-input.interface";
import { constructInitialSignalPaginatedResponse, copyPaginatedSignalResponse } from "../../../../../../shared/utilities/signals.utilities";
import { SmallListTableComponent } from "../../../../../../shared/small-list-table/small-list-table.component";
import { companyTableHeaders } from "../../../../../../shared/table-headers/company-table.headers";
import { ITableSortingFilter } from "../../../../../../shared/interfaces/table-sorting-filter.interface";
import { ITableAction } from "../../../../../../shared/interfaces/table-action.interface";
import { DialogService } from "../../../../../../core/services/dialog.service";
import { PaginationComponent } from "../../../../../../shared/pagination/pagination.component";
import { SubHeaderComponent } from "../../../../../../shared/sub-header/sub-header.component";
import { TranslateModule } from "@ngx-translate/core";
import { SmallHeaderComponent } from "../../../../../../shared/small-header/small-header.component";
import { SearchInputComponent } from "../../../../../../shared/search-input/search-input.component";
import { ButtonComponent } from "../../../../../../shared/button/button.component";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";


@Component({
  selector: 'ps-companies',
  standalone: true,
    imports: [
        SmallListTableComponent,
        PaginationComponent,
        SubHeaderComponent,
        TranslateModule,
        SmallHeaderComponent,
        SearchInputComponent,
        ButtonComponent
    ],
  templateUrl: './companies.component.html',
  styleUrl: './companies.component.scss'
})
export class CompaniesComponent extends BasePaginatedTableWithSearchComponent implements OnInit {
    readonly #companyService = inject(CompanyService)
    readonly #dialogService = inject(DialogService)
    readonly #router = inject(Router)
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
        }
    ]

    ngOnInit(){
        this.isTableLoading = true;
        this.loadDataWithCorrectParams();
    }

    readonly #isDeletingCompany = signal(false);
    readonly #matDialog = inject(MatDialog);
    override loadData(params: IPaginationSortPayload) {
        this.isTableLoading = true;
        this.#companyService.listCompanies(params).subscribe((paginatedProperties) => {
            copyPaginatedSignalResponse(this.paginatedData, paginatedProperties);
            this.isTableLoading = false;
        })
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
        this.#companyService.deleteCompany(id).subscribe({
           next: () => this.loadDataWithCorrectParams(),
            complete: () => {
               this.#isDeletingCompany.set(false);
               this.#dialogService.close();
            }
        });
    }

    loadCompaniesList(params: IPaginationSortPayload): void {

        this.#companyService.listCompanies(params).subscribe({

        })
    }

}
