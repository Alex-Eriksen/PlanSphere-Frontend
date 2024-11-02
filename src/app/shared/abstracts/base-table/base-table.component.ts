import {
    Component, effect,
    ElementRef,
    EventEmitter,
    inject, Input,
    input, InputSignal,
    OnInit,
    Output,
    Renderer2, signal,
    ViewChild, WritableSignal
} from "@angular/core";
import { ITableAction } from "../../interfaces/table-action.interface";
import { ITableHeader } from "../../interfaces/table-header.interface";
import { ISmallListTableInput } from "../../interfaces/small-list-table-input.interface";
import { ICheckedItem } from "../../interfaces/checked-item.interface";
import { IAllCheckedItems } from "../../interfaces/checked-items.interface";
import { ITableSortingFilter } from "../../interfaces/table-sorting-filter.interface";
import { TableHeaderType } from "../../enums/table-header-type.enum";
import { FormControl } from "@angular/forms";

@Component({
    standalone: true,
    template: "",
    styles: "",
})
export abstract class BaseTableComponent implements OnInit {
    actions = input<ITableAction<any>[]>();
    headers = input.required<ITableHeader[]>();
    isLoading = input<boolean>(false);
    emptyCellValue = input<string>("");
    checkboxControlMapper: InputSignal<Map<string, FormControl<any[] | null>>> = input(new Map());
    checkboxDisabledIds = input<any[]>();
    @Output() checkItem: EventEmitter<ICheckedItem> = new EventEmitter();
    @Output() checkAllItems: EventEmitter<IAllCheckedItems> = new EventEmitter();
    @Output() toggleItem: EventEmitter<{ checked: boolean; row: ISmallListTableInput }> = new EventEmitter();
    @Input({ required: true }) sortingFilterSignal: WritableSignal<ITableSortingFilter> = signal({
        sortBy: "",
        sortDescending: false,
    });
    @ViewChild("wrapperUi", { static: true }) wrapperUi!: ElementRef<HTMLDivElement>;
    protected displayedColumns: string[] = [];
    private readonly renderer = inject(Renderer2);
    private readonly loadingScrollEffect$ = effect(() => {
        if (this.isLoading()) {
            this.wrapperUi.nativeElement.scrollLeft = 0; // Prevents loading overlay overflowing bug
            this.renderer.addClass(this.wrapperUi.nativeElement, "overflow-hidden"); // prevents scrolling while loading to avoid loading overlay overflowing
        } else {
            this.renderer.removeClass(this.wrapperUi.nativeElement, "overflow-hidden");
        }
    });
    data = input.required<any[]>();
    protected readonly TableHeaderType = TableHeaderType;

    ngOnInit() {
        this.constructDisplayedColumnsInOrder();
    }

    constructDisplayedColumnsInOrder(): void {
        this.displayedColumns = this.headers().map((header) => header.key);
    }

    protected updateFilterSignal(key: string): void {
        this.sortingFilterSignal.update((currentFilter) => {
            if (currentFilter.sortBy === key) {
                return { ...currentFilter, sortDescending: !currentFilter.sortDescending };
            } else {
                return { sortBy: key, sortDescending: false };
            }
        });
    }

    getRowAppliedClasses(row: ISmallListTableInput, header: ITableHeader): { [key: string]: boolean } {
        if (!row.appliedClasses) return {};
        const obj: { [key: string]: boolean } = {};
        for (const appliedClassObj of row.appliedClasses) {
            obj[appliedClassObj.classes] = appliedClassObj.key === header.key;
        }
        return obj;
    }

    addMarkedCheckboxesToSelection(): void {
        const checkboxHeader = this.headers().find((header) => header.type === TableHeaderType.Checkbox);
        if (!checkboxHeader) {
            return;
        }
        this.data().forEach((row) => {
            if (row[checkboxHeader.key]) {
                this.#addIdsToCheckboxIfNotExists({ ids: [row.id], key: checkboxHeader.key });
            }
        });
    }

    isAllSelected(key: string): boolean {
        if (!this.data()) return false;
        for (const row of this.data()) {
            if (!this.isCheckboxSelected(row.id, key)) return false;
        }
        return true;
    }

    isOneSelected(key: string): boolean {
        if (!this.data()) return false;
        for (const row of this.data()) {
            if (this.isCheckboxSelected(row.id, key)) return true;
        }
        return false;
    }

    toggleAllRows(checked: boolean, key: string) {
        const dataIds = this.data().map((row) => row.id);
        this.isAllSelected(key)
            ? this.#removeFromCheckboxControl({ ids: dataIds, key: key })
            : this.#addIdsToCheckboxIfNotExists({ ids: dataIds, key: key });
        this.checkAllItems.emit({ checked, rows: [...this.data()] });
    }

    checkboxLabel(key: string, row?: { id: number }): string {
        if (!row) {
            return this.isAllSelected(key) ? "TABLE.DESELECT_ALL" : "TABLE.SELECT_ALL";
        }
        return this.isCheckboxSelected(row.id, key) ? "TABLE.DESELECT_ROW" : "TABLE.SELECT_ROW";
    }

    emitSelectedItem(row: ISmallListTableInput, checked: boolean, key: string) {
        checked
            ? this.#addIdsToCheckboxIfNotExists({ ids: [row.id], key: key })
            : this.#removeFromCheckboxControl({ ids: [row.id], key: key });
        this.checkItem.emit({ checked, row, key });
    }

    #removeFromCheckboxControl(row: { ids: number[]; key: string }): void {
        if (this.checkboxControlMapper().has(row.key)) {
            const formControlByKey = this.checkboxControlMapper().get(row.key);
            if (formControlByKey) {
                if (formControlByKey.value?.length === row.ids.length) {
                    formControlByKey.setValue([]);
                } else {
                    const currentValue = formControlByKey.value || [];
                    const updatedIds = currentValue.filter((id) => !row.ids.includes(id));
                    formControlByKey.setValue(updatedIds);
                }
            }
        }
    }

    #addIdsToCheckboxIfNotExists(row: { ids: any[]; key: string }) {
        if (!this.checkboxControlMapper().has(row.key)) {
            this.checkboxControlMapper().set(row.key, new FormControl([...new Set(row.ids)]));
        } else {
            const formControlByKey = this.checkboxControlMapper().get(row.key);
            if (formControlByKey) {
                const currentValue = formControlByKey.value || [];
                const updatedIds = [...new Set([...currentValue, ...row.ids])];
                formControlByKey.setValue(updatedIds);
            }
        }
    }

    isCheckboxSelected(id: number, key: string): boolean {
        const formControlKey = this.checkboxControlMapper().get(key);
        return formControlKey?.value?.includes(id) || false;
    }

    isCheckboxDisabled(id: number): boolean {
        return this.checkboxDisabledIds()?.includes(id) || false;
    }

    disabledAll(id: any, key: string): boolean {
        if (this.isCheckboxDisabled(id)) return false;
        return this.isCheckboxSelected(id, key);
    }
}
