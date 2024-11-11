import { Component, DestroyRef, effect, inject, input, signal, WritableSignal } from "@angular/core";
import { ButtonComponent } from "../button/button.component";
import { PaginationComponent } from "../pagination/pagination.component";
import { SearchInputComponent } from "../search-input/search-input.component";
import { SmallHeaderComponent } from "../small-header/small-header.component";
import { SmallListTableComponent } from "../small-list-table/small-list-table.component";
import { SubHeaderComponent } from "../sub-header/sub-header.component";
import { TranslateModule } from "@ngx-translate/core";
import { UserService } from "../../core/features/user/services/user.service";
import { MatDialog } from "@angular/material/dialog";
import { constructInitialSignalPaginatedResponse, copyPaginatedSignalResponse } from "../utilities/signals.utilities";
import { ISmallListTableInput } from "../interfaces/small-list-table-input.interface";
import { ISignalPaginatedResponse } from "../interfaces/signal-paginated-response.interface";
import {
    BasePaginatedTableWithSearchComponent
} from "../base-paginated-table-with-search-abstract/base-paginated-table-with-search.abstract";
import { DialogService } from "../ui-services/small-dialog.service";
import { ITableSortingFilter } from "../interfaces/table-sorting-filter.interface";
import { IPaginationSortPayload } from "../interfaces/pagination-sort-payload.interface";
import { ITableAction } from "../interfaces/table-action.interface";
import { UserPopupComponent } from "./user-popup/user-popup.component";
import { IUserPopupInputs } from "./user-popup/user-popup-inputs.interfaces";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { userHeaders } from "../table-headers/user.headers";

@Component({
  selector: 'ps-list-users',
  standalone: true,
    imports: [
        ButtonComponent,
        PaginationComponent,
        SearchInputComponent,
        SmallHeaderComponent,
        SmallListTableComponent,
        SubHeaderComponent,
        TranslateModule
    ],
  templateUrl: './list-users.component.html',
  styleUrl: './list-users.component.scss'
})
export class ListUsersComponent extends BasePaginatedTableWithSearchComponent {
    headers = userHeaders;
    readonly #userService = inject(UserService);
    override paginatedData: ISignalPaginatedResponse<ISmallListTableInput> = constructInitialSignalPaginatedResponse();
    readonly #matDialog = inject(MatDialog);
    readonly #dialogService = inject(DialogService);
    readonly #isDeletingUser = signal(false);
    readonly #destroyRef = inject(DestroyRef);
    sourceLevelId = input.required<number>();
    sortingFilterSignal: WritableSignal<ITableSortingFilter> = signal({
        sortBy: "firstName",
        sortDescending: false,
    });
    readonly loadDataEffect$ = effect(() => {this.loadDataWithCorrectParams()});

    override loadData(params: IPaginationSortPayload): void {
        this.isTableLoading = true;
        this.#userService.listUsers(params).subscribe((paginatedProperties) => {
            copyPaginatedSignalResponse(this.paginatedData, paginatedProperties);
            this.isTableLoading = false;
        });
    }

    override actions: ITableAction[] = [
        {
            callbackFn: (row: ISmallListTableInput) => this.openUserPopup(true, row),
            labelFn: () => "USER.EDIT.TITLE",
        },
        {
            callbackFn: (row: ISmallListTableInput) => this.#openDeleteDialog(row),
            labelFn: () => "USER.DELETE.TITLE",
        },
    ];

    loadDataWithCorrectParams(): void {
        this.loadData({
            sortBy: this.sortingFilterSignal().sortBy,
            sortDescending: this.sortingFilterSignal().sortDescending,
            pageSize: this.paginatedData.pageSize(),
            pageNumber: this.paginatedData.currentPage(),
            search: this.searchSignal()
        });
    }

    openUserPopup(isEditPopup: boolean, row?: ISmallListTableInput): void {
        this.#matDialog.open<UserPopupComponent, IUserPopupInputs>(UserPopupComponent, {
            minWidth: "75dvw",
            maxHeight: "95dvh",
            data: {
                sourceLevelId: row != null ? row.id : this.sourceLevelId(),
                isEditPopup: isEditPopup,
            }
        })
            .afterClosed()
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe(() => this.loadDataWithCorrectParams());
    }

    #openDeleteDialog(row: ISmallListTableInput): void {
        this.#dialogService.open(
            {
                title: 'USER.DELETE.TITLE',
                tooltipLabel: 'USER.DELETE.TOOLTIP',
                callBack: () => this.#deleteUser(row.id),
                submitLabel: 'CONFIRM',
                isInputIncluded: false,
                descriptions: ['USER.DELETE.QUESTION', 'USER.DELETE.CONFIRMATION'],
                isSubmitLoading: this.#isDeletingUser,
                cancelLabel: 'CANCEL',
            },
            "warning"
        );
    }

    #deleteUser(id: number): void {
        this.#isDeletingUser.set(true);
        this.#userService.deleteUser(id).subscribe({
            next: () => this.loadDataWithCorrectParams(),
            complete: () => {
                this.#isDeletingUser.set(false);
                this.#dialogService.close();
            }
        });
    }
}
