import {
    booleanAttribute,
    Component, computed, effect, EventEmitter,
    Input,
    input,
    InputSignal,
    numberAttribute, OnInit, Output,
    output, signal, ViewChild,
    WritableSignal
} from "@angular/core";
import { ISmallListTableInput } from "../interfaces/small-list-table-input.interface";
import { FormControl, FormsModule } from "@angular/forms";
import {
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatTable
} from "@angular/material/table";
import { BaseTableComponent } from "../abstracts/base-table/base-table.component";
import { CdkDrag, CdkDropList, moveItemInArray } from "@angular/cdk/drag-drop";
import { MatSlideToggle, MatSlideToggleChange } from "@angular/material/slide-toggle";
import { TranslateModule } from "@ngx-translate/core";
import { MatMenu, MatMenuItem, MatMenuTrigger } from "@angular/material/menu";
import { MatIcon } from "@angular/material/icon";
import { NgClass, NgOptimizedImage } from "@angular/common";
import { MatTooltip } from "@angular/material/tooltip";
import { MatCheckbox } from "@angular/material/checkbox";
import { MatRadioButton } from "@angular/material/radio";
import { CustomDatePipe } from "../../core/pipes/custom-date.pipe";
import { TruncatePipe } from "../../core/pipes/truncate.pipe";
import { PartialTranslatePipe } from "../../core/pipes/partial-translate.pipe";
import { isDateValid } from "../utilities/date.utilities";

@Component({
  selector: 'ps-small-list-table',
  standalone: true,
    imports: [
        TranslateModule,
        MatMenu,
        MatIcon,
        NgClass,
        MatTooltip,
        MatTable,
        CdkDropList,
        MatColumnDef,
        MatHeaderCell,
        MatCheckbox,
        MatMenuTrigger,
        MatCellDef,
        MatCell,
        NgOptimizedImage,
        MatRadioButton,
        MatSlideToggle,
        FormsModule,
        CustomDatePipe,
        MatRow,
        MatRowDef,
        CdkDrag,
        MatHeaderCellDef,
        MatMenuItem,
        TruncatePipe,
        PartialTranslatePipe,
        MatHeaderRow,
        MatHeaderRowDef
    ],
  templateUrl: './small-list-table.component.html',
  styleUrl: './small-list-table.component.scss'
})
export class SmallListTableComponent extends BaseTableComponent implements OnInit {
    override data = input.required<ISmallListTableInput[]>();
    isDraggable = input(false, { transform: booleanAttribute });
    iconMenuComponentType = input<any>();
    radioButtonControl: InputSignal<FormControl<number | null>> = input(new FormControl<number | null>(null));
    radioGroupHashMap = input<Map<number, string>>();
    appliedClasses = input("");
    hasConfirmationCheckbox = input(false, { transform: booleanAttribute });
    hasSchedule = input(false, { transform: booleanAttribute });
    isScheduleDisabled = input(false, { transform: booleanAttribute });
    hasAllCheckbox = input(true, { transform: booleanAttribute });
    extraRows = input(0, { transform: numberAttribute });
    extraRowsLabel = input("");
    confirmationCheckboxPropertyName = input("");
    schedule = output<ISmallListTableInput>();
    confirmToggle = output<ISmallListTableInput>();
    confirmDelete = output<ISmallListTableInput>();

    @Input() isPopupIconAvailable?: (item: ISmallListTableInput) => boolean;
    @Input() isMouseoverIconVisibleFn?: (item: ISmallListTableInput) => boolean;
    @Input() showOrHideLoaderOnClickedRow: WritableSignal<null | number> = signal(null);
    @ViewChild("table") table!: MatTable<HTMLTableElement>;
    @Output() dragAndReorder: EventEmitter<{ [key: string]: any }> = new EventEmitter();
    @Output() selectRadioItem: EventEmitter<{ row: any }> = new EventEmitter();
    itemPopup = output<ISmallListTableInput>();
    selectRadioGroup = output<{ key: string; row: ISmallListTableInput }>();
    heart = output<any>();
    isDragDropListDisabled = true;
    toggleButtonDisableHashMap = input<Map<number, boolean>>(); // Set to true if disabled
    extraRowsArray = computed(() =>
        Array.from({
            length: this.extraRows(),
        }),
    );

    readonly #addMarkedCheckboxesToSelectionEffect$ = effect(() => {
        this.addMarkedCheckboxesToSelection();
    });

    override ngOnInit() {
        super.ngOnInit();
    }

    dragAndDrop(event: any) {
        moveItemInArray(this.data(), event.previousIndex, event.currentIndex);
        const updatedRows = this.data().map((row) => {
            return {
                ...row,
                order: this.data().findIndex((r) => r === row) + 1,
            };
        });
        this.table.renderRows();
        this.dragAndReorder.emit({ rows: updatedRows });
    }

    toggleRow(event: MatSlideToggleChange, row: any) {
        row.active = event.checked;
        this.toggleItem.emit({ checked: event.checked, row });
    }

    emitRadioSelectedRow(row: ISmallListTableInput) {
        if (!row) return;
        this.radioButtonControl().setValue(row.id);
        this.selectRadioItem.emit({ row: row });
    }

    radioButtonLabel(row: ISmallListTableInput): string {
        return this.radioButtonControl().value === row.id ? "TABLE.DESELECT_ROW" : "TABLE.SELECT_ROW";
    }

    isRadioGroupKeySelected(radioGroupValue: string, row: ISmallListTableInput): boolean {
        if (!this.radioGroupHashMap()) return false;
        return this.radioGroupHashMap()!.get(row.id) === radioGroupValue;
    }

    isRadioButtonChecked(row: ISmallListTableInput) {
        if (!this.radioButtonControl().value) return;
        return this.radioButtonControl().value === row.id;
    }

    updateRadioGroupControl(radioGroupValue: string, row: ISmallListTableInput): void {
        if (!this.radioGroupHashMap()) return;
        this.radioGroupHashMap()!.set(row.id, radioGroupValue);
    }

    emitValueAndViewDocument(row: ISmallListTableInput) {
        this.itemPopup.emit(row);
        this.showOrHideLoaderOnClickedRow.set(row.id);
    }

    protected readonly isDateValid = isDateValid;
}
