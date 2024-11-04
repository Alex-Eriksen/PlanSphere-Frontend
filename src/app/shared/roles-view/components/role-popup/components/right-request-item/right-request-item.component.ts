import { Component, input, OnInit } from "@angular/core";
import { generateTranslatedDropdownOptionsFromEnum } from "../../../../../utilities/dropdown-option.utilities";
import { SourceLevel } from "../../../../../../core/enums/source-level.enum";
import { SourceLevelTranslationMapper } from "../../../../../../core/mappers/source-level-translation.mapper";
import { SelectFieldComponent } from "../../../../../select-field/select-field.component";
import { IDropdownOption } from "../../../../../interfaces/dropdown-option.interface";
import { FormGroup } from "@angular/forms";
import { castControlFromAbstractToFormControl } from "../../../../../utilities/form.utilities";

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
    rightOptions = input.required<IDropdownOption[]>();
    sourceLevel = input.required<SourceLevel>();
    sourceLevelOptions = generateTranslatedDropdownOptionsFromEnum(SourceLevel, SourceLevelTranslationMapper);
    formGroup = input.required<FormGroup>();
    protected readonly castControlFromAbstractToFormControl = castControlFromAbstractToFormControl;
    protected readonly SourceLevelTranslationMapper = SourceLevelTranslationMapper;

    options: IDropdownOption[] = [];

    ngOnInit() {
        switch (this.sourceLevel()) {
            case SourceLevel.Organisation:
                break;
            case SourceLevel.Company:
                break;
            case SourceLevel.Department:
                break;
            case SourceLevel.Team:
                break;
        }
    }
}
