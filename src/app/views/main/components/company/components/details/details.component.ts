import { Component, inject, input,  OnInit } from "@angular/core";
import { CompanyService } from "../../../../../../core/features/company/services/company.service";
import { ICompany } from "../../../../../../core/features/company/models/company.model";
import { NonNullableFormBuilder, Validators } from "@angular/forms";
import { InputComponent } from "../../../../../../shared/input/input.component";

@Component({
  selector: 'ps-details',
  standalone: true,
    imports: [
        InputComponent
    ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit {
    companyId = input.required<number>()
    company?: ICompany
    readonly #service = inject(CompanyService);
    readonly #fb = inject(NonNullableFormBuilder);
    isPageLoading: boolean = false;

    ngOnInit(): void {
        this.isPageLoading = true;
        if (this.companyId) {
            this.loadCompanyDetails(this.companyId());
        }
    }

    formGroup = this.#fb.group({
        name: this.#fb.control("", Validators.required),
        cvr: this.#fb.control("", Validators.required),
        contactName: this.#fb.control("", Validators.required),
        contactEmail: this.#fb.control("", Validators.required),
        contactPhoneNumber: this.#fb.control("", Validators.required),
        address: this.#fb.group({
            streetName: this.#fb.control(""),
            houseNumber: this.#fb.control(""),
            door: this.#fb.control(""),
            floor: this.#fb.control(""),
            postalCode: this.#fb.control(""),
            countryId: this.#fb.control(""),
        }),
        careOf: this.#fb.control(""),
    },{
        updateOn: "blur"
    })

    loadCompanyDetails(id: number): void {
        this.#service.companyById(id).subscribe({
            next: (data: ICompany) => this.formGroup.patchValue(data),
            error: (err) => console.error('Failed to load company deatils:', err),
            complete: () => this.isPageLoading = false
        });
    }

    deleteCompany(id: number): void {
        this.#service.delete(id)
    }

}
