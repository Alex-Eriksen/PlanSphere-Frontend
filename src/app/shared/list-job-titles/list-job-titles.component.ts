import { Component, DestroyRef, effect, inject, input, signal, WritableSignal } from "@angular/core";
import { SmallHeaderComponent } from "../small-header/small-header.component";
import { TranslateModule } from "@ngx-translate/core";
import { SubHeaderComponent } from "../sub-header/sub-header.component";
import { IPaginationSortPayload } from "../interfaces/pagination-sort-payload.interface";
import { SearchInputComponent } from "../search-input/search-input.component";
import { JobTitleService } from "../../core/features/jobTitle/services/job-title.service";
import { constructInitialSignalPaginatedResponse, copyPaginatedSignalResponse } from "../utilities/signals.utilities";
import { PaginationComponent } from "../pagination/pagination.component";
import { SelectFieldComponent } from "../select-field/select-field.component";
import { ButtonComponent } from "../button/button.component";
import { SmallListTableComponent } from "../small-list-table/small-list-table.component";
import { JobTitlePopupComponent } from "./job-title-popup/job-title-popup.component";
import { IJobTitlePopupInputs } from "./job-title-popup/job-title-popup-inputs.interface";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ISmallListTableInput } from "../interfaces/small-list-table-input.interface";
import { ITableAction } from "../interfaces/table-action.interface";
import { MatDialog } from "@angular/material/dialog";
import { DialogService } from "../ui-services/small-dialog.service";
import { ISignalPaginatedResponse } from "../interfaces/signal-paginated-response.interface";
import { SourceLevel } from "../../core/enums/source-level.enum";
import { jobTitleHeaders } from "../table-headers/job-title.header";
import { ITableSortingFilter } from "../interfaces/table-sorting-filter.interface";
import {
    BasePaginatedTableWithSearchComponent
} from "../base-paginated-table-with-search-abstract/base-paginated-table-with-search.abstract";

@Component({
  selector: 'ps-list-job-titles',
  standalone: true,
    imports: [
        SmallHeaderComponent,
        TranslateModule,
        SubHeaderComponent,
        SearchInputComponent,
        PaginationComponent,
        SelectFieldComponent,
        ButtonComponent,
        SmallListTableComponent,
    ],
  templateUrl: 'list-job-titles.component.html',
})
export class ListJobTitlesComponent extends BasePaginatedTableWithSearchComponent {
    readonly #jobTitleService = inject(JobTitleService);
    override paginatedData: ISignalPaginatedResponse<ISmallListTableInput> = constructInitialSignalPaginatedResponse();
    sourceLevelId = input.required<number>();
    sourceLevel = input.required<SourceLevel>();
    hasEditRights = input(false);
    readonly #destroyRef = inject(DestroyRef);
    headers = jobTitleHeaders;
    sortingFilterSignal: WritableSignal<ITableSortingFilter> = signal({
        sortBy: "name",
        sortDescending: false,
    });
    readonly loadDataEffect$ = effect(() => {this.loadDataWithCorrectParams()});
    override loadData(params: IPaginationSortPayload): void {
        this.isTableLoading = true;
        this.#jobTitleService.getJobTitles(params, this.sourceLevel(), this.sourceLevelId())
            .subscribe((paginatedProperties) => {
            copyPaginatedSignalResponse(this.paginatedData, paginatedProperties);
            this.disabledMap = new Map<number, boolean>();
            this.paginatedData.results().forEach((data) => this.disabledMap.set(data.id, !this.hasEditRights()));
            this.isTableLoading = false;
        });
    }

    override actions: ITableAction[] = [
        {
            callbackFn: (row: ISmallListTableInput) => this.openJobTitlePopup(true, row),
            labelFn: () => "JOB_TITLE.EDIT.TITLE",
            isVisible: (row: ISmallListTableInput) => row['sourceLevel'] === this.sourceLevel() && this.hasEditRights(),
        },
        {
            callbackFn: (row: ISmallListTableInput) => this.#openDeleteDialog(row),
            labelFn: () => "JOB_TITLE.DELETE.TITLE",
            isVisible: (row: ISmallListTableInput) => row['sourceLevel'] === this.sourceLevel() && this.hasEditRights(),
        },
    ]
    readonly #matDialog = inject(MatDialog);
    readonly #dialogService = inject(DialogService);
    readonly #isDeletingJobTitle = signal(false);
    protected disabledMap!: Map<number, boolean>;

    loadDataWithCorrectParams(): void {
        this.loadData({
            sortBy: this.sortingFilterSignal().sortBy,
            sortDescending: this.sortingFilterSignal().sortDescending,
            pageSize: this.paginatedData.pageSize(),
            pageNumber: this.paginatedData.currentPage(),
            search: this.searchSignal()
        });
    }

    openJobTitlePopup(isEditPopup: boolean, row?: ISmallListTableInput) {
        this.#matDialog.open<JobTitlePopupComponent, IJobTitlePopupInputs>(JobTitlePopupComponent, {
            minWidth: "75dvw",
            maxHeight: "95dvh",
            data: {
                jobTitleId: row != null ? row.id : undefined,
                isEditPopup: isEditPopup,
                sourceLevelId: this.sourceLevelId(),
                sourceLevel: this.sourceLevel(),
            }
        })
            .afterClosed()
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe(() => { this.loadDataWithCorrectParams(); })
    }

    #openDeleteDialog(row: ISmallListTableInput): void {
        this.#dialogService.open(
            {
                title: "JOB_TITLE.DELETE.TITLE",
                tooltipLabel: "JOB_TITLE.DELETE.TOOLTIP",
                callBack: () => this.#deleteJobTitle(row.id),
                submitLabel: "CONFIRM",
                isInputIncluded: false,
                descriptions: ["JOB_TITLE.DELETE.QUESTION", "JOB_TITLE.DELETE.CONFIRMATION"],
                isSubmitLoading: this.#isDeletingJobTitle,
                cancelLabel: "CANCEL",
            },
            "warning"
        );
    }

    #deleteJobTitle(id: number): void {
        this.#isDeletingJobTitle.set(true);
        this.#jobTitleService.deleteJobTitle(id).subscribe({
            next: () => this.loadDataWithCorrectParams(),
            complete: () => {
                this.#isDeletingJobTitle.set(false);
                this.#dialogService.close();
            },
        });
    }

    updateJobTitleInheritance(row: {row: any}) {
        this.#jobTitleService.toggleInheritance(row.row.id, this.sourceLevel(), this.sourceLevelId()).subscribe();
    }
}
