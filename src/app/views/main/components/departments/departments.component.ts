import { Component, DestroyRef, effect, inject, input, OnInit, signal, WritableSignal } from "@angular/core";
import { SmallListTableComponent } from "../../../../shared/small-list-table/small-list-table.component";
import { PaginationComponent } from "../../../../shared/pagination/pagination.component";
import { SubHeaderComponent } from "../../../../shared/sub-header/sub-header.component";
import { TranslateModule } from "@ngx-translate/core";
import { SmallHeaderComponent } from "../../../../shared/small-header/small-header.component";
import { SearchInputComponent } from "../../../../shared/search-input/search-input.component";
import { ButtonComponent } from "../../../../shared/button/button.component";
import { CompaniesPopupComponent } from "../organisation/components/companies/components/companies-popup.component";
import { InputComponent } from "../../../../shared/input/input.component";
import { BasePaginatedTableWithSearchComponent } from "../../../../shared/base-paginated-table-with-search-abstract/base-paginated-table-with-search.abstract";
import { DepartmentService } from "../../../../core/features/department/services/department.service";
import { Router } from "@angular/router";
import { ISignalPaginatedResponse } from "../../../../shared/interfaces/signal-paginated-response.interface";
import { ISmallListTableInput } from "../../../../shared/interfaces/small-list-table-input.interface";
import { constructInitialSignalPaginatedResponse, copyPaginatedSignalResponse } from "../../../../shared/utilities/signals.utilities";
import { departmentTableHeaders } from "../../../../shared/table-headers/department-table.headers";
import { ITableSortingFilter } from "../../../../shared/interfaces/table-sorting-filter.interface";
import { ITableAction } from "../../../../shared/interfaces/table-action.interface";
import { MatDialog } from "@angular/material/dialog";
import { IPaginationSortPayload } from "../../../../shared/interfaces/pagination-sort-payload.interface";
import { DialogService } from "../../../../core/services/dialog.service";
import { DepartmentsPopupComponent } from "./components/departments-popup.component";
import { IDepartmentsPopupInputs } from "./components/departments-popup-inputs.component";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

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
        ButtonComponent,
        CompaniesPopupComponent,
        InputComponent
    ],
  templateUrl: './departments.component.html',
  styleUrl: './departments.component.scss'
})
export class DepartmentsComponent extends BasePaginatedTableWithSearchComponent implements OnInit {
    companyId = input.required<number>()
    readonly #departmentService = inject(DepartmentService)
    readonly #dialogService = inject(DialogService)
    readonly #router = inject(Router);
    readonly #destroyRef = inject(DestroyRef);
    override paginatedData: ISignalPaginatedResponse<ISmallListTableInput> = constructInitialSignalPaginatedResponse();
    headers = departmentTableHeaders;
    sortingFilterSignal: WritableSignal<ITableSortingFilter> = signal({
        sortBy: "name",
        sortDescending: false,
    });
    readonly loadDataEffect$ = effect(() => {this.loadDataWithCorrectParams()});

    override actions: ITableAction[] = [
        {
            callbackFn: (row: ISmallListTableInput) => this.#router.navigate(['department', row.id]),
            labelFn: () => "DEPARTMENT.DEPARTMENT_DETAILS",
        },
        {
            callbackFn: (row: ISmallListTableInput) => this.#openDeleteDialog(row),
            labelFn:() => "DEPARTMENT.DELETE.TITLE",
        }
    ]

    ngOnInit() {
        this.isTableLoading = true;
        this.loadDataWithCorrectParams();
    }

    readonly #isDeletingDepartment = signal(false);
    readonly #matDialog = inject(MatDialog);

    override loadData(params: IPaginationSortPayload) {
        this.isTableLoading = true;
        this.#departmentService.listDepartments(this.companyId(), params).subscribe((paginatedProperties) => {
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
                title: "DEPARTMENT.DELETE.TITLE",
                tooltipLabel: "DEPARTMENT.DELETE.TOOLTIP",
                callBack: () => this.#deleteDepartment(row.id),
                submitLabel: "CONFIRM",
                isInputIncluded: false,
                descriptions: ["DEPARTMENT.DELETE.QUESTION", "DEPARTMENT.DELETE.CONFIRMATION"],
                isSubmitLoading: this.#isDeletingDepartment,
                cancelLabel: "CANCEL",
            },
            "confirmation"
        );
    }

    #deleteDepartment(id: number): void {
        this.#isDeletingDepartment.set(true);
        this.#departmentService.deleteDepartment(this.companyId(),id).subscribe({
            next: () => this.loadDataWithCorrectParams(),
            complete: () => {
                this.#isDeletingDepartment.set(false);
                this.#dialogService.close();
            }
        });
    }

    openDepartmentPopup(): void {
        this.#matDialog.open<DepartmentsPopupComponent, IDepartmentsPopupInputs>(DepartmentsPopupComponent, {
            minWidth: "50dvh",
            maxHeight: "95dvh",
            data: {
                sourceLevelId: this.companyId()
            }
        })
            .afterClosed()
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe(() => {this.loadDataWithCorrectParams()})
    }
}
