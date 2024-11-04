import { Component, inject, OnInit } from "@angular/core";
import { OrganisationService } from "../../../../../../core/features/organisation/services/organisation.service";
import { IOrganisation } from "../../../../../../core/features/organisation/models/organisation.model";
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { InputComponent } from "../../../../../../shared/input/input.component";
import { LoadingOverlayComponent } from "../../../../../../shared/loading-overlay/loading-overlay.component";
import { IOrganisationDetails } from "../../../../../../core/features/organisation/models/organisation-details.model";
import { SubHeaderComponent } from "../../../../../../shared/sub-header/sub-header.component";
import { ButtonComponent } from "../../../../../../shared/button/button.component";
import { updateNestedControlsPathAndValue } from "../../../../../../shared/utilities/form.utilities";

@Component({
    selector: 'ps-details',
    standalone: true,
    imports: [
        InputComponent,
        LoadingOverlayComponent,
        SubHeaderComponent,
        ReactiveFormsModule,
        ButtonComponent
    ],
    templateUrl: './details.component.html',
    styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit{
    //organisationId = input.required<number>();
    organisationId = 1;
    organisation?: IOrganisation;
    organisationDetails?: IOrganisationDetails;
    readonly #organisationService = inject(OrganisationService);
    readonly #fb = inject(NonNullableFormBuilder);
    isPageLoading: boolean = false;

    ngOnInit(): void {
        this.isPageLoading = true;
        if (this.organisationId) {
            this.getOrganisationDetail(this.organisationId);
        }
        if (this.organisationId == null) {
            console.log("No organisationId");
        }
    }

    formGroup = this.#fb.group({
        id: this.#fb.control<number>(0, Validators.required),
        name: this.#fb.control("", Validators.required),
        logoUrl: this.#fb.control("", Validators.required),
        address: this.#fb.group({
            streetName: this.#fb.control(""),
            houseNumber: this.#fb.control(""),
            door: this.#fb.control(""),
            floor: this.#fb.control(""),
            postalCode: this.#fb.control(""),
            countryId: this.#fb.control(""),
        }),
        createdAt: this.#fb.control({ value: new Date, disabled: true }),

        // jobTitles: this.#fb.control<string[]>([], Validators.required),
        // //jobTitles: this.#fb.control<JobTitle[]>([], Validators.required),
        // organisationMembers: this.#fb.control<number>(0, Validators.required),
        // companyMembers: this.#fb.control<number>(0, Validators.required),
        // departmentMembers: this.#fb.control<number>(0, Validators.required),
        // teamMembers: this.#fb.control<number>(0, Validators.required)
    });

    getOrganisationDetail(id: number): void {
        this.#organisationService.getOrganisationDetailsById(id).subscribe({
            next: (organisation : IOrganisationDetails) => this.formGroup.patchValue(organisation),
            error: (error) => console.error('This organisation docent exits', error),
            complete: () => this.isPageLoading = false
        });
    }

    patchDetails(): void {
        const paths = updateNestedControlsPathAndValue(this.formGroup);
        console.log(paths);
        if (Object.keys(paths).length) {
            this.#organisationService.patch(this.organisationId, paths).subscribe()
        }
    }

    deleteOrganisation(id: number): void {
        this.#organisationService.delete(id);
    }

}
