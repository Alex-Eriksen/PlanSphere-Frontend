import { Component } from '@angular/core';
import { generateTranslatedDropdownOptionsFromEnum } from "../../../../../utilities/dropdown-option.utilities";
import { SourceLevel } from "../../../../../../core/enums/source-level.enum";
import { SourceLevelTranslationMapper } from "../../../../../../core/mappers/source-level-translation.mapper";
import { SelectFieldComponent } from "../../../../../select-field/select-field.component";

@Component({
  selector: 'ps-right-request-item',
  standalone: true,
    imports: [
        SelectFieldComponent
    ],
  templateUrl: './right-request-item.component.html',
  styleUrl: './right-request-item.component.scss'
})
export class RightRequestItemComponent {
    sourceLevelOptions = generateTranslatedDropdownOptionsFromEnum(SourceLevel, SourceLevelTranslationMapper);
}
