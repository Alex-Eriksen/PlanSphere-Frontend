import { Component, inject, input, OnInit } from "@angular/core";
import { InputComponent } from "../../../../../../shared/input/input.component";
import { ButtonComponent } from "../../../../../../shared/button/button.component";
import { SelectFieldComponent } from "../../../../../../shared/select-field/select-field.component";
import { LoadingOverlayComponent } from "../../../../../../shared/loading-overlay/loading-overlay.component";
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { LineComponent } from "../../../../../../shared/line/line.component";
import { SmallHeaderComponent } from "../../../../../../shared/small-header/small-header.component";
import { IRightsListener } from "../../../../../../core/interfaces/rights-data.interface";
import { ITeam } from "../../../../../../core/features/team/models/team.model";
import { TeamService } from "../../../../../../core/features/team/services/team.service";
import { CountryService } from "../../../../../../core/features/address/services/country.service";
import { ToastService } from "../../../../../../core/services/error-toast.service";
import { IDropdownOption } from "../../../../../../shared/interfaces/dropdown-option.interface";
import { SourceLevel } from "../../../../../../core/enums/source-level.enum";
import { markAllControlsAsTouchedAndDirty, updateNestedControlsPathAndValue } from "../../../../../../shared/utilities/form.utilities";
import { ISourceLevelRights } from "../../../../../../core/features/authentication/models/source-level-rights.model";
import { AddressInputComponent } from "../../../../../../shared/address-input/address-input.component";

@Component({
  selector: 'ps-details',
  standalone: true,
  imports: [
      InputComponent,
      ButtonComponent,
      SelectFieldComponent,
      LoadingOverlayComponent,
      ReactiveFormsModule,
      LineComponent,
      SmallHeaderComponent,
      AddressInputComponent
  ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit, IRightsListener{
    teamId = input.required<number>()
    team?: ITeam
    readonly #teamService = inject(TeamService);
    readonly #fb = inject(NonNullableFormBuilder);
    readonly #countryService = inject(CountryService);
    readonly #toastService = inject(ToastService);
    countries: IDropdownOption[] =[]
    sourceLevel = SourceLevel.Team
    isPageLoading: boolean = false;

    ngOnInit(): void {
        this.isPageLoading = true;
        if(this.teamId) {
            this.#loadCountries();
            this.loadTeamDetails(this.sourceLevel, this.teamId())
        }
        if(this.teamId == null){
            this.#toastService.showToast('TEAM.DO_NOT_EXIST')
        }
    }

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
        }),
        updateOn: "blur"
    })

    #loadCountries(): void {
        this.#countryService.getCountryLookups().subscribe({
            next: (data) => {
                this.countries = data;
            }
        })
    }

    patchDetails(): void {
        if (!this.formGroup.valid)
        {
            markAllControlsAsTouchedAndDirty(this.formGroup);
            return;
        }
        const paths = updateNestedControlsPathAndValue(this.formGroup);
        if(Object.keys(paths).length) {
            this.#teamService.patchTeams(this.teamId(), paths).subscribe()
        }
    }

    loadTeamDetails(sourceLevel: SourceLevel, teamId: number): void {
        this.#teamService.getTeamById(teamId, sourceLevel, teamId).subscribe({
            next: (data: ITeam) => this.formGroup.patchValue(data),
            error: () => this.#toastService.showToast('TEAM.DO_NOT_EXIST'),
            complete: () => this.isPageLoading = false
        });
    }

    setRightsData(rights: ISourceLevelRights) {
        if (!rights.hasEditRights && !rights.hasAdministratorRights) {
            this.formGroup.disable();
        }
    }

    protected readonly input = input;
}
