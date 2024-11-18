import {
    booleanAttribute,
    Component, input,
    OnInit, output, ViewChild
} from "@angular/core";
import { ISmallListTableInput } from "../interfaces/small-list-table-input.interface";
import { FormsModule } from "@angular/forms";
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
import { CdkDrag, CdkDropList } from "@angular/cdk/drag-drop";
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
import { LoadingOverlayComponent } from "../loading-overlay/loading-overlay.component";

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
        MatHeaderRowDef,
        LoadingOverlayComponent
    ],
  templateUrl: './small-list-table.component.html',
  styleUrl: './small-list-table.component.scss'
})
export class SmallListTableComponent extends BaseTableComponent implements OnInit {
    override data = input.required<ISmallListTableInput[]>();
    appliedClasses = input("");
    disableToggle = input(false, {transform: booleanAttribute})
    confirmToggle = output<ISmallListTableInput>();
    confirmDelete = output<ISmallListTableInput>();
    @ViewChild("table") table!: MatTable<HTMLTableElement>;
    itemPopup = output<ISmallListTableInput>();
    toggleButtonDisableHashMap = input<Map<number, boolean>>();

    override ngOnInit() {
        super.ngOnInit();
        this.headers().forEach(header => header.key)
    }

    toggleRow(event: MatSlideToggleChange, row: any) {
        row.active = event.checked;
        if(this.disableToggle()) return;
        this.toggleItem.emit({ checked: event.checked, row });
    }

    protected readonly isDateValid = isDateValid;
}
