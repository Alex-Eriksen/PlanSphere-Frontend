import { Component, input } from "@angular/core";
import { RolesViewComponent } from "../../../../../../shared/roles-view/roles-view.component";
import { SourceLevel } from "../../../../../../core/enums/source-level.enum";

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
    companyId = input.required<number>();
    sourceLevel = SourceLevel.Company;
}
