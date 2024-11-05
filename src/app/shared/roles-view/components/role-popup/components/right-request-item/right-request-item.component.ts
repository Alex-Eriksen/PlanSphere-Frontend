import { Component, DestroyRef, inject, input, OnInit, output } from "@angular/core";
import { generateTranslatedDropdownOptionsFromEnum } from "../../../../../utilities/dropdown-option.utilities";
import { SourceLevel } from "../../../../../../core/enums/source-level.enum";
import { SourceLevelTranslationMapper } from "../../../../../../core/mappers/source-level-translation.mapper";
import { SelectFieldComponent } from "../../../../../select-field/select-field.component";
import { IDropdownOption } from "../../../../../interfaces/dropdown-option.interface";
import { FormGroup } from "@angular/forms";
import { castControlFromAbstractToFormControl } from "../../../../../utilities/form.utilities";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
  selector: 'ps-right-request-item',
  standalone: true,
    imports: [
        SelectFieldComponent
    ],
  templateUrl: './right-request-item.component.html',
  styleUrl: './right-request-item.component.scss'
})
export class RightRequestItemComponent implements OnInit {
    companyOptions = input.required<IDropdownOption[]>();
    organisationOptions = input.required<IDropdownOption[]>();
    rightOptions = input.required<IDropdownOption[]>();
    sourceLevel = input.required<SourceLevel>();
    sourceLevelOptions = generateTranslatedDropdownOptionsFromEnum(SourceLevel, SourceLevelTranslationMapper);
    formGroup = input.required<FormGroup>();
    readonly #destroyRef = inject(DestroyRef);
    protected readonly castControlFromAbstractToFormControl = castControlFromAbstractToFormControl;
    protected readonly SourceLevelTranslationMapper = SourceLevelTranslationMapper;
    remove = output<FormGroup>();

    options: IDropdownOption[] = [];

    ngOnInit() {
        this.#updateOptions(this.formGroup().controls["sourceLevel"].value);
        this.formGroup().controls["sourceLevel"].valueChanges
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe((sourceLevel: SourceLevel) => this.#updateOptions(sourceLevel))
    }

    removeSelf() {
        this.remove.emit(this.formGroup());
    }

    #updateOptions(sourceLevel: SourceLevel){
        switch (sourceLevel) {
            case SourceLevel.Organisation:
                this.options = this.organisationOptions();
                break;
            case SourceLevel.Company:
                this.options = this.companyOptions();
                break;
            case SourceLevel.Department:
                this.options = [];
                break;
            case SourceLevel.Team:
                this.options = [];
                break;
        }
    }
}
