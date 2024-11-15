import { Component, OnInit, input, inject, DestroyRef, WritableSignal, signal, effect } from "@angular/core";
import { BasePaginatedTableWithSearchComponent } from "../base-paginated-table-with-search-abstract/base-paginated-table-with-search.abstract";
import { TeamService } from "../../core/features/team/services/team.service";
import { SmallListTableComponent } from "../small-list-table/small-list-table.component";
import { PaginationComponent } from "../pagination/pagination.component";
import { SubHeaderComponent } from "../sub-header/sub-header.component";
import { TranslateModule } from "@ngx-translate/core";
import { SmallHeaderComponent } from "../small-header/small-header.component";
import { SearchInputComponent } from "../search-input/search-input.component";
import { ButtonComponent } from "../button/button.component";
import { InputComponent } from "../input/input.component";
import { DepartmentsPopupComponent } from "../list-department/components/departments-popup/departments-popup.component";
import { DialogService } from "../../core/services/dialog.service";
import { Router } from "@angular/router";
import { ISignalPaginatedResponse } from "../interfaces/signal-paginated-response.interface";
import { ISmallListTableInput } from "../interfaces/small-list-table-input.interface";
import { constructInitialSignalPaginatedResponse, copyPaginatedSignalResponse } from "../utilities/signals.utilities";
import { ITableSortingFilter } from "../interfaces/table-sorting-filter.interface";
import { teamTableHeaders } from "../table-headers/team-table.headers";
import { ITableAction } from "../interfaces/table-action.interface";
import { MatDialog } from "@angular/material/dialog";
import { IPaginationSortPayload } from "../interfaces/pagination-sort-payload.interface";
import { TeamsPopupComponent } from "./components/teams-popup/teams-popup.component";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ITeamPopupInputs } from "./components/teams-popup/teams-popup-inputs.component";

@Component({
  selector: 'ps-team-list',
  standalone: true,
  imports: [
      SmallListTableComponent,
      PaginationComponent,
      SubHeaderComponent,
      TranslateModule,
      SmallHeaderComponent,
      SearchInputComponent,
      ButtonComponent,
      DepartmentsPopupComponent,
      InputComponent
  ],
  templateUrl: './team-list.component.html',
  styleUrl: './team-list.component.scss'
})
export class TeamListComponent extends BasePaginatedTableWithSearchComponent implements OnInit{
    departmentId = input.required<number>()
    isUserTeams = input(false);
    hasEditRights = input(false);
    readonly #teamService = inject(TeamService)
    readonly #dialogService = inject(DialogService)
    readonly #router = inject(Router);
    readonly #destroyRef = inject(DestroyRef);
    override paginatedData: ISignalPaginatedResponse<ISmallListTableInput> = constructInitialSignalPaginatedResponse();
    headers = teamTableHeaders;
    sortingFilterSignal: WritableSignal<ITableSortingFilter> = signal({
        sortBy: "name",
        sortDescending: false,
    });
    readonly loadDataEffect$ = effect(() => {this.loadDataWithCorrectParams()});

    override actions: ITableAction[] = [
        {
            callbackFn: (row: ISmallListTableInput) => this.#router.navigate(['team', row.id]),
            labelFn: () => "TEAM.TEAM_DETAILS",
        },
        {
            callbackFn: (row: ISmallListTableInput) => this.#openDeleteDialog(row),
            labelFn: () => "TEAM.DELETE.TITLE",
            isVisible:() => !this.isUserTeams() && this.hasEditRights()
        }
    ]

    ngOnInit() {
        this.isTableLoading = true;
        this.loadDataWithCorrectParams();
    }

    readonly #isDeletingTeam = signal(false);
    readonly #matDialog = inject(MatDialog);

    override loadData(params: IPaginationSortPayload) {
        this.isTableLoading = true;
        this.#teamService.listTeams(this.departmentId(), params, this.isUserTeams()).subscribe((paginatedProperties) => {
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
                title: "TEAM.DELETE.TITLE",
                tooltipLabel: "TEAM.DELETE.TOOLTIP",
                callBack: () => this.#deleteTeam(row.id),
                submitLabel: "CONFIRM",
                isInputIncluded: false,
                descriptions: ["TEAM.DELETE.QUESTION", "TEAM.DELETE.CONFIRMATION"],
                isSubmitLoading: this.#isDeletingTeam,
                cancelLabel: "CANCEL",
            },
            "confirmation"
        );
    }

    #deleteTeam(id: number): void {
        this.#isDeletingTeam.set(true);
        this.#teamService.deleteTeam(this.departmentId(), id).subscribe({
            next: () => this.loadDataWithCorrectParams(),
            complete: () => {
                this.#isDeletingTeam.set(false);
                this.#dialogService.close();
            }
        })
    }

    openTeamPopup(): void {
        this.#matDialog.open<TeamsPopupComponent, ITeamPopupInputs>(TeamsPopupComponent, {
            minWidth: "50dvh",
            maxHeight: "95dvh",
            data: {
                sourceLevelId: this.departmentId()
            }
        })
            .afterClosed()
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe(() => {this.loadDataWithCorrectParams()})
    }

}
