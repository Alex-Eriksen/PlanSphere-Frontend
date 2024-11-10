import { Component } from '@angular/core';
import { SourceLevel } from "../../../../../../core/enums/source-level.enum";
import { RolesViewComponent } from "../../../../../../shared/roles-view/roles-view.component";

@Component({
  selector: 'ps-roles',
  standalone: true,
    imports: [
        RolesViewComponent
    ],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss'
})
export class RolesComponent {
    sourceLevel = SourceLevel.Organisation;
    sourceLevelId = 1;
}
