import {
    Component,
    DestroyRef,
    effect,
    EventEmitter,
    inject,
    Input,
    input,
    OnInit,
    Output,
    ViewChild,
    WritableSignal
} from "@angular/core";
import { FormControl, ReactiveFormsModule, Validators } from "@angular/forms";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import {
    MatError,
    MatFormField,
    MatLabel,
    MatOption,
    MatSelect,
    MatSelectChange,
    MatSelectTrigger
} from "@angular/material/select";
import { IDropdownOption } from "../interfaces/dropdown-option.interface";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { NgClass, NgOptimizedImage } from "@angular/common";
import { MatIcon } from "@angular/material/icon";
import { MatDivider } from "@angular/material/divider";
import { PartialTranslatePipe } from "../../core/pipes/partial-translate.pipe";

@Component({
  selector: 'ps-select-field',
  standalone: true,
    imports: [
        MatFormField,
        NgClass,
        TranslateModule,
        NgOptimizedImage,
        MatSelect,
        MatSelectTrigger,
        MatError,
        MatIcon,
        MatDivider,
        ReactiveFormsModule,
        MatOption,
        MatLabel
    ],
  templateUrl: './select-field.component.html',
  styleUrl: './select-field.component.scss'
})
export class SelectFieldComponent implements OnInit {
    @Input() selectSignal?: WritableSignal<any>;
    dropDownOptions = input.required<IDropdownOption[]>();
    dropDownLabel = input<string>("");
    appliedClass = input<string>("");
    control = input<FormControl<any>>(new FormControl());
    selectMultipleOptions = input.required<boolean>();
    predefinedOptions = input<IDropdownOption[]>();
    initialValue = input<any>();
    disabledIds = input<any[]>([]);
    @Output() changeSelectValue: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild("selector", { static: false }) selector: MatSelect | undefined;
    protected readonly Validators = Validators;
    protected readonly translateService = inject(TranslateService);
    protected selectedOption: IDropdownOption | undefined;
    private readonly destroyRef$ = inject(DestroyRef);

    setSelectedOptionOnOptionsChange$ = effect(() => {
        this.dropDownOptions();
        if (this.control().value) {
            this.#setSelectedOption(this.control().value);
        }
    });

    ngOnInit() {
        this.updateSignalAndClearSearchOnControlChange();
        this.#setInitialValue();
        if (this.control().value) {
            this.#setSelectedOption(this.control().value);
        }
        if (this.selectMultipleOptions() && !Array.isArray(this.control().value)) {
            this.control().setValue([this.control().value]);
        }
    }

    emitChangedValue(selectChange: MatSelectChange) {
        this.changeSelectValue.emit(selectChange.value);
        this.#setSelectedOption(selectChange.value);
    }

    private updateSignalAndClearSearchOnControlChange(): void {
        this.control()
            .valueChanges.pipe(takeUntilDestroyed(this.destroyRef$))
            .subscribe((value) => {
                this.selectSignal?.set(value);
                this.#setSelectedOption(value);
            });
    }

    #setSelectedOption(value: any): void {
        this.selectedOption = this.dropDownOptions().find((dropdownOption) => dropdownOption.value === value);
    }

    #setInitialValue(): void {
        if (this.initialValue() !== undefined) this.control().setValue(this.initialValue());
    }
}
