import { Component, inject, OnInit } from "@angular/core";
import { SmallListTableComponent } from "../../small-list-table/small-list-table.component";
import { PaginationComponent } from "../../pagination/pagination.component";
import { SubHeaderComponent } from "../../sub-header/sub-header.component";
import { TranslateModule } from "@ngx-translate/core";
import { SmallHeaderComponent } from "../../small-header/small-header.component";
import { SearchInputComponent } from "../../search-input/search-input.component";
import { ButtonComponent } from "../../button/button.component";
import { InputComponent } from "../../input/input.component";
import { SelectFieldComponent } from "../../select-field/select-field.component";
import { DialogHeaderComponent } from "../../dialog-header/dialog-header.component";
import { LoadingOverlayComponent } from "../../loading-overlay/loading-overlay.component";
import { LineComponent } from "../../line/line.component";
import { AddressInputComponent } from "../../address-input/address-input/address-input.component";
import { TeamService } from "../../../core/features/team/services/team.service";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { NonNullableFormBuilder, Validators } from "@angular/forms";
import { IDropdownOption } from "../../interfaces/dropdown-option.interface";
import { CountryService } from "../../../core/features/address/services/country.service";
import { ITeamPopupInputs } from "./teams-popup-inputs.component";
import { markAllControlsAsTouchedAndDirty } from "../../utilities/form.utilities";
import { ITeam } from "../../../core/features/team/models/team.model";
import { TooltipComponent } from "../../tooltip/tooltip.component";

@Component({
  selector: 'ps-teams-popup',
  standalone: true,
    imports: [
        SmallListTableComponent,
        PaginationComponent,
        SubHeaderComponent,
        TranslateModule,
        SmallHeaderComponent,
        SearchInputComponent,
        ButtonComponent,
        InputComponent,
        SelectFieldComponent,
        DialogHeaderComponent,
        LoadingOverlayComponent,
        LineComponent,
        AddressInputComponent,
        TooltipComponent
    ],
  templateUrl: './teams-popup.component.html',
  styleUrl: './teams-popup.component.scss'
})
export class TeamsPopupComponent implements OnInit {
    readonly #teamService = inject(TeamService);
    readonly #matDialog = inject(MatDialog);
    readonly #fb = inject(NonNullableFormBuilder);
    countries: IDropdownOption[] = []
    readonly #countryService = inject(CountryService);
    readonly componentInputs: ITeamPopupInputs = inject(MAT_DIALOG_DATA);
    isPageLoading: boolean = false;
    isFormSubmitting: boolean = false;

    formGroup = this.#fb.group({
        name: this.#fb.control("", Validators.required),
        description: this.#fb.control(""),
        identifier: this.#fb.control(""),
        address: this.#fb.group({
            streetName: this.#fb.control(""),
            houseNumber: this.#fb.control(""),
            door: this.#fb.control(""),
            floor: this.#fb.control(""),
            postalCode: this.#fb.control(""),
            countryId: this.#fb.control(""),
        })
    })

    ngOnInit() {
        this.isPageLoading = true;
        this.#loadCountries();
    }

    #loadCountries(): void {
        this.#countryService.getCountryLookups().subscribe({
            next: (data) => {
                this.countries = data;
            },
            complete: () => this.isPageLoading = false,
        })
    }

    submitForm(){
        if(!this.formGroup.valid) {
            markAllControlsAsTouchedAndDirty(this.formGroup)
            return;
        }
        this.isFormSubmitting = true;

        this.#teamService
            .createTeams(this.componentInputs.sourceLevelId, this.formGroup.value as ITeam,
                ).subscribe({
            next: () => {
                this.isFormSubmitting = false;
                this.closeDialog();
            }
        })
    }

    closeDialog() {
        this.#matDialog.closeAll();
    }
}
