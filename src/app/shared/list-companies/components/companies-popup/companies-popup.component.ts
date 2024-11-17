import { OnInit, inject, Component, DestroyRef } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { NonNullableFormBuilder, Validators } from "@angular/forms";
import { ICompaniesPopupInputs } from "./companies-popup-inputs.interface";
import { TranslateModule } from "@ngx-translate/core";
import { SmallListTableComponent } from "../../../small-list-table/small-list-table.component";
import { PaginationComponent } from "../../../pagination/pagination.component";
import { SubHeaderComponent } from "../../../sub-header/sub-header.component";
import { SmallHeaderComponent } from "../../../small-header/small-header.component";
import { SearchInputComponent } from "../../../search-input/search-input.component";
import { ButtonComponent } from "../../../button/button.component";
import { InputComponent } from "../../../input/input.component";
import { SelectFieldComponent } from "../../../select-field/select-field.component";
import { DialogHeaderComponent } from "../../../dialog-header/dialog-header.component";
import { LoadingOverlayComponent } from "../../../loading-overlay/loading-overlay.component";
import { LineComponent } from "../../../line/line.component";
import { CompanyService } from "../../../../core/features/company/services/company.service";
import { IDropdownOption } from "../../../interfaces/dropdown-option.interface";
import { CountryService } from "../../../../core/features/address/services/country.service";
import { markAllControlsAsTouchedAndDirty } from "../../../utilities/form.utilities";
import { ICompanyRequest } from "../../../../core/features/company/models/company-request.model";
import { AddressInputComponent } from "../../../address-input/address-input/address-input.component";
import { ToggleInputComponent } from "../../../toggle-input/toggle-input.component";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { constructAddressFormGroup } from "../../../../core/features/address/utilities/address.utilities";


@Component({
    selector: 'ps-companies-popup',
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
        ToggleInputComponent
    ],
    templateUrl: './companies-popup.component.html',
    styleUrl: './companies-popup.component.scss'
})
export class CompaniesPopupComponent implements OnInit{
    readonly #companyService = inject(CompanyService);
    readonly #matDialog = inject(MatDialog);
    readonly #fb = inject(NonNullableFormBuilder);
    readonly #destroyRef = inject(DestroyRef);
    countries: IDropdownOption[] = []
    readonly #countryService = inject(CountryService);
    readonly componentInputs: ICompaniesPopupInputs = inject(MAT_DIALOG_DATA);
    isPageLoading: boolean = false;
    isFormSubmitting: boolean = false;

    addressFormGroup = constructAddressFormGroup(this.#fb);
    formGroup = this.#fb.group({
        name: this.#fb.control("", Validators.required),
        cvr: this.#fb.control("", Validators.required),
        address: this.#fb.group({
            inheritAddress:this.#fb.control(false),
            streetName: this.#fb.control("", Validators.required),
            houseNumber: this.#fb.control("", Validators.required),
            door: this.#fb.control("", Validators.required),
            floor: this.#fb.control("", Validators.required),
            postalCode: this.#fb.control("", Validators.required),
            countryId: this.#fb.control("", Validators.required),
        }),
        careOf: this.#fb.control(""),
        contactName: this.#fb.control("", Validators.required),
        contactEmail: this.#fb.control("", Validators.email),
        contactPhoneNumber: this.#fb.control("", Validators.required),
    })

    ngOnInit(): void {
        this.isPageLoading = true;
        this.#loadCountries();
        this.formGroup.controls.address.controls.inheritAddress.valueChanges
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe((value) => this.#onInheritedToggled(value))
    }

    #loadCountries(): void {
        this.#countryService.getCountryLookups().subscribe({
            next: (data) => {
                this.countries = data;

            },
            complete: () => this.isPageLoading = false,
        })
    }

    #onInheritedToggled(value: boolean): void {
        if (value) {
            this.formGroup = constructAddressFormGroup(this.#fb, undefined, true);
            return;
        }
        this.addressFormGroup.enable();
        this.formGroup.controls.address.controls.inheritAddress.patchValue(false);
    }

    setInheritance() {

    }

    submitForm(){
        if(!this.formGroup.valid) {
            markAllControlsAsTouchedAndDirty(this.formGroup)
            return;
        }
        this.isFormSubmitting = true;


        this.#companyService
            .createCompany(this.componentInputs.sourceLevelId,this.formGroup.value as ICompanyRequest,
                ).subscribe({
            next:() => {
                this.isFormSubmitting = false;
                this.closeDialog();
            }
        })

    }

    closeDialog() {
        this.#matDialog.closeAll();
    }
}
