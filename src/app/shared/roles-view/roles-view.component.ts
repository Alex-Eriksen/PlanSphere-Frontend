import { Component, EffectRef, WritableSignal, inject, input, signal, effect, DestroyRef } from "@angular/core";
import { SourceLevel } from "../../core/enums/source-level.enum";
import { ButtonComponent } from "../button/button.component";
import { LineComponent } from "../line/line.component";
import { SmallHeaderComponent } from "../small-header/small-header.component";
import { MatDialog } from "@angular/material/dialog";
import { RolePopupComponent } from "./components/role-popup/role-popup.component";
import { IRolePopupInputs } from "./components/role-popup/role-popup.inputs";
import { PaginationComponent } from "../pagination/pagination.component";
import { SearchInputComponent } from "../search-input/search-input.component";
import { SmallListTableComponent } from "../small-list-table/small-list-table.component";
import { SubHeaderComponent } from "../sub-header/sub-header.component";
import { TranslateModule } from "@ngx-translate/core";
import { BasePaginatedTableWithSearchComponent } from "../base-paginated-table-with-search-abstract/base-paginated-table-with-search.abstract";
import { IPaginationSortPayload } from "../interfaces/pagination-sort-payload.interface";
import { ITableHeader } from "../interfaces/table-header.interface";
import { ITableSortingFilter } from "../interfaces/table-sorting-filter.interface";
import { RoleTableHeaders } from "./role-table.headers";
import { copyPaginatedSignalResponse } from "../utilities/signals.utilities";
import { RoleService } from "../../core/features/roles/services/role.service";
import { ISmallListTableInput } from "../interfaces/small-list-table-input.interface";
import { DialogService } from "../../core/services/dialog.service";
import { ITableAction } from "../interfaces/table-action.interface";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
    selector: "ps-roles-view",
    standalone: true,
    imports: [
        ButtonComponent,
        LineComponent,
        SmallHeaderComponent,
        PaginationComponent,
        SearchInputComponent,
        SmallListTableComponent,
        SubHeaderComponent,
        TranslateModule
    ],
    templateUrl: "./roles-view.component.html",
    styleUrl: "./roles-view.component.scss"
})
export class RolesViewComponent extends BasePaginatedTableWithSearchComponent {
    override headers: ITableHeader[] = RoleTableHeaders;
    override sortingFilterSignal: WritableSignal<ITableSortingFilter> = signal({
        sortBy: "name",
        sortDescending: false,
    });
    hasEditRights = input(false);
    override loadDataEffect$: EffectRef = effect(() => {this.loadDataWithCorrectParams()});
    override loadData(params: IPaginationSortPayload): void {
        this.isTableLoading = true;
        this.#roleService.getRoles(params, this.sourceLevel(), this.sourceLevelId())
            .subscribe((paginatedProperties) => {
            copyPaginatedSignalResponse(this.paginatedData, paginatedProperties);
            this.isTableLoading = false;
            this.disabledMap = new Map<number, boolean>();
            this.paginatedData.results().forEach((data) => this.disabledMap.set(data.id, !this.hasEditRights()));
        });
    }
    override actions: ITableAction[] = [
        {
            isVisible: (row: ISmallListTableInput) => row["isInheritanceActive"] === true && this.hasEditRights(),
            callbackFn: (row: ISmallListTableInput) => this.updateRoleInheritance({ row: row, checked: row["isInheritanceActive"] }, true),
            labelFn: () => "DEACTIVATE",
        },
        {
            isVisible: (row: ISmallListTableInput) => row["isInheritanceActive"] === false && this.hasEditRights(),
            callbackFn: (row: ISmallListTableInput) => this.updateRoleInheritance({ row: row, checked: row["isInheritanceActive"] }, true),
            labelFn: () => "ACTIVATE",
        },
        {
            callbackFn: (row: ISmallListTableInput) => this.openPopup(true, row),
            labelFn: () => "ROLE.EDIT.NAME",
            isVisible: (row: ISmallListTableInput) => row['rawSourceLevel'] === this.sourceLevel() && this.hasEditRights(),
        },
        {
            callbackFn: (row: ISmallListTableInput) => this.#openDeleteDialog(row),
            labelFn: () => "ROLE.DELETE.NAME",
            isVisible: (row: ISmallListTableInput) => row['rawSourceLevel'] === this.sourceLevel() && row['isDefaultRole'] === false && this.hasEditRights(),
        },
    ]
    sourceLevel = input.required<SourceLevel>();
    sourceLevelId = input.required<number>();
    readonly #matDialog = inject(MatDialog);
    readonly #roleService = inject(RoleService);
    readonly #dialogService = inject(DialogService);
    readonly #destroyRef = inject(DestroyRef);
    readonly #isDeletingRole = signal(false);
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

    openPopup(isEditPopup: boolean, row?: ISmallListTableInput) {
        this.#matDialog.open<RolePopupComponent, IRolePopupInputs>(RolePopupComponent, {
            data: {
                roleId: row != null ? row.id : undefined,
                sourceLevel: this.sourceLevel(),
                sourceLevelId: this.sourceLevelId(),
                isEditPopup: isEditPopup
            },
            width: "45rem",
            maxHeight: "95dvh"
        })
        .afterClosed()
        .pipe(takeUntilDestroyed(this.#destroyRef))
        .subscribe(() => { this.loadDataWithCorrectParams(); })
    }

    #openDeleteDialog(row: ISmallListTableInput): void {
        this.#dialogService.open(
            {
                title: "ROLE.DELETE.NAME",
                tooltipLabel: "ROLE.DELETE.TOOLTIP",
                callBack: () => this.#deleteRole(row.id),
                submitLabel: "CONFIRM",
                isInputIncluded: false,
                descriptions: ["ROLE.DELETE.QUESTION", "ROLE.DELETE.CONFIRMATION"],
                isSubmitLoading: this.#isDeletingRole,
                cancelLabel: "CANCEL",
            },
            "confirmation"
        );
    }

    #deleteRole(id: number): void {
        this.#isDeletingRole.set(true);
        this.#roleService.deleteRole(this.sourceLevel(), this.sourceLevelId(), id).subscribe({
            next: () => this.loadDataWithCorrectParams(),
            complete: () => {
                this.#isDeletingRole.set(false);
                this.#dialogService.close();
            },
        });
    }

    updateRoleInheritance(row: {checked: boolean; row: any}, isAction?: boolean) {
        this.#roleService.toggleRoleInheritance(this.sourceLevel(), this.sourceLevelId(), row.row.id).subscribe(() => {
            if (isAction) this.#toggleRowInheritanceButton(row);
        });
    }

    #toggleRowInheritanceButton(row: any) {
        row.row.isInheritanceActive = !row.row.isInheritanceActive;
    }
}
