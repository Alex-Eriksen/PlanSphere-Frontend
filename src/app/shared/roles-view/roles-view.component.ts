import { Component, EffectRef, WritableSignal, inject, input, signal, effect } from "@angular/core";
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
    override loadDataEffect$: EffectRef = effect(() => {this.loadDataWithCorrectParams()});
    override loadData(params: IPaginationSortPayload): void {
        this.isTableLoading = true;
        this.#roleService.getRoles(params, this.sourceLevel(), this.sourceLevelId()).subscribe((paginatedProperties) => {
            copyPaginatedSignalResponse(this.paginatedData, paginatedProperties);
            this.isTableLoading = false;
        });
    }

    sourceLevel = input.required<SourceLevel>();
    sourceLevelId = input.required<number>();
    readonly #matDialog = inject(MatDialog);
    readonly #roleService = inject(RoleService);

    loadDataWithCorrectParams(): void {
        this.loadData({
            sortBy: this.sortingFilterSignal().sortBy,
            sortDescending: this.sortingFilterSignal().sortDescending,
            pageSize: this.paginatedData.pageSize(),
            pageNumber: this.paginatedData.currentPage(),
            search: this.searchSignal()
        });
    }

    openCreatePopup() {
        this.#matDialog.open<RolePopupComponent, IRolePopupInputs>(RolePopupComponent, {
            data: {
                sourceLevel: this.sourceLevel(),
                sourceLevelId: this.sourceLevelId(),
                isEditPopup: false
            },
            width: "45rem",
            maxHeight: "95dvh"
        });
    }
}
