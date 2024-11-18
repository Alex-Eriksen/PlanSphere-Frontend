import {
    Component, ElementRef,
    EventEmitter,
    Input,
    input, InputSignal,
    OnInit,
    Output,
    signal,
    ViewChild, WritableSignal
} from "@angular/core";
import { ITableAction } from "../../interfaces/table-action.interface";
import { ITableHeader } from "../../interfaces/table-header.interface";
import { ISmallListTableInput } from "../../interfaces/small-list-table-input.interface";
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
    @Output() toggleItem: EventEmitter<{ checked: boolean; row: ISmallListTableInput }> = new EventEmitter();
    @Input({ required: true }) sortingFilterSignal: WritableSignal<ITableSortingFilter> = signal({
        sortBy: "",
        sortDescending: false,
    });
    @ViewChild("wrapperUi", { static: true }) wrapperUi!: ElementRef<HTMLDivElement>;
    protected displayedColumns: string[] = [];
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

}
