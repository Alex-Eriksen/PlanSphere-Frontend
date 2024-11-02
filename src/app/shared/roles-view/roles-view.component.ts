import { Component, inject, input } from "@angular/core";
import { SourceLevel } from "../../core/enums/source-level.enum";
import { ButtonComponent } from "../button/button.component";
import { LineComponent } from "../line/line.component";
import { SmallHeaderComponent } from "../small-header/small-header.component";
import { MatDialog } from "@angular/material/dialog";
import { RolePopupComponent } from "./components/role-popup/role-popup.component";
import { IRolePopupInputs } from "./components/role-popup/role-popup.inputs";

@Component({
  selector: 'ps-roles-view',
  standalone: true,
    imports: [
        ButtonComponent,
        LineComponent,
        SmallHeaderComponent
    ],
  templateUrl: './roles-view.component.html',
  styleUrl: './roles-view.component.scss'
})
export class RolesViewComponent {
    sourceLevel = input.required<SourceLevel>();
    sourceLevelId = input.required<number>();
    readonly #matDialog = inject(MatDialog);

    openCreatePopup() {
        this.#matDialog.open<RolePopupComponent, IRolePopupInputs>(RolePopupComponent, {
            data: {
                sourceLevel: this.sourceLevel(),
                sourceLevelId: this.sourceLevelId(),
                isEditPopup: false
            },
            width: "45rem",
            maxHeight: "95dvh"
        });
    }
}
