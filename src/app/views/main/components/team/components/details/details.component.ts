import { Component, inject, input, OnDestroy, OnInit } from "@angular/core";
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
import { forkJoin, Subscription, tap } from "rxjs";
import { recursivelyFindParentAddress } from "../../../../../../core/features/address/utilities/address.utilities";
import { ToggleInputComponent } from "../../../../../../shared/toggle-input/toggle-input.component";
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
        AddressInputComponent,
        ToggleInputComponent
    ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit, OnDestroy, IRightsListener{
    teamId = input.required<number>()
    team!: ITeam
    readonly #teamService = inject(TeamService);
    readonly #fb = inject(NonNullableFormBuilder);
    readonly #countryService = inject(CountryService);
    readonly #toastService = inject(ToastService);
    countries: IDropdownOption[] =[]
    sourceLevel = SourceLevel.Team
    teamDetailsSubscription!: Subscription;
    isPageLoading: boolean = false;

    ngOnInit(): void {
        this.isPageLoading = true;
        if(this.teamId) {
            this.#loadCountries();
            this.teamDetailsSubscription = forkJoin([
                this.loadTeamDetails(this.sourceLevel, this.teamId())
            ]).subscribe({
                next: () => {
                    this.formGroup.patchValue(this.team);
                    this.formGroup.controls.address.patchValue(recursivelyFindParentAddress(this.team.address));
                    this.onInheritedToggled(this.team.inheritAddress!)
                },
                error: () => {
                    if(this.teamId == null){
                        this.#toastService.showToast('TEAM.DO_NOT_EXIST')
                    }
                },
                complete: () => {
                    this.isPageLoading = false;
                }
            });
        }

    }

    ngOnDestroy() {
        this.teamDetailsSubscription.unsubscribe();
    }

    formGroup = this.#fb.group({
        name: this.#fb.control("", Validators.required),
        description: this.#fb.control(""),
        identifier: this.#fb.control(""),
        inheritAddress: this.#fb.control(false),
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

    onInheritedToggled(value: boolean): void {
        if(value)
        {
            const paths = updateNestedControlsPathAndValue(this.formGroup);
            if(Object.keys(paths).length) {
                this.#teamService.patchTeams(this.teamId(), paths).subscribe(() => {
                    this.loadTeamDetails(this.sourceLevel ,this.teamId()).subscribe();
                });
            }
            this.formGroup.controls.address.disable();
        }
        else
        {
            this.formGroup.controls.address.enable();
            this.formGroup.controls.address.patchValue(this.team.address);
        }
    }

    loadTeamDetails(sourceLevel: SourceLevel, teamId: number){
        return this.#teamService.getTeamById(teamId, sourceLevel, teamId).pipe(tap(data => {
            this.team = data;
            this.formGroup.controls.address.patchValue(recursivelyFindParentAddress(data.address));
        }));
    }

    setRightsData(rights: ISourceLevelRights) {
        if (!rights.hasEditRights && !rights.hasAdministratorRights) {
            this.formGroup.disable();
        }
    }

    protected readonly input = input;
}
