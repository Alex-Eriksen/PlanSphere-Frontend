import { Component, inject, OnInit } from "@angular/core";
import { CompanyService } from "../../../../core/features/company/services/company.service";
import { FormControl, NonNullableFormBuilder, Validators } from "@angular/forms";
import { ICompany } from "../../../../shared/interfaces/company.interface";
import { UploadFileDropZoneComponent } from "../../../../shared/upload-logo/upload-logo.component";

@Component({
  selector: 'ps-frontpage',
  standalone: true,
    imports: [
        UploadFileDropZoneComponent
    ],
  templateUrl: './frontpage.component.html',
  styleUrl: './frontpage.component.scss'
})
export class FrontpageComponent implements OnInit {
    #companyService = inject(CompanyService)
    readonly #fb = inject(NonNullableFormBuilder);

    imageSize = new FormControl("");
    imageName = new FormControl("");
    fileSize = new FormControl("");
    imageDimensions = new FormControl("");

    formGroup = this.#fb.group({
        name: this.#fb.control("", Validators.required),
        logoUrl: this.#fb.control(""),
        cvr: this.#fb.control("", Validators.required),
        contactName: this.#fb.control(""),
        contactEmail: this.#fb.control("", Validators.email),
        contactPhoneNumber: this.#fb.control("", [Validators.pattern(/^[0-9]*$/), Validators.minLength(8), Validators.maxLength(8)]),
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

    ngOnInit() {
        this.loadCompanyDetails(1);
    }

    uploadCompanyLogo(image: File): void {
        const formData = new FormData();
        formData.append('image', image, image.name); // 'file' should match the parameter name expected by the backend
        this.#companyService.uploadLogo(formData, 1).subscribe({
            next: (logoUrl) => this.formGroup.controls.logoUrl.patchValue(logoUrl)
        })
    }


    loadCompanyDetails(id: number): void {
        this.#companyService.companyById(id).subscribe({
            next: (data: ICompany) => this.formGroup.patchValue(data)
        });
    }
}
