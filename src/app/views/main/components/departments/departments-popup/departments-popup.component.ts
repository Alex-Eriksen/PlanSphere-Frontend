import { Component, inject, OnInit } from "@angular/core";
import { SmallListTableComponent } from "../../../../../shared/small-list-table/small-list-table.component";
import { PaginationComponent } from "../../../../../shared/pagination/pagination.component";
import { SubHeaderComponent } from "../../../../../shared/sub-header/sub-header.component";
import { TranslateModule } from "@ngx-translate/core";
import { SmallHeaderComponent } from "../../../../../shared/small-header/small-header.component";
import { SearchInputComponent } from "../../../../../shared/search-input/search-input.component";
import { ButtonComponent } from "../../../../../shared/button/button.component";
import { InputComponent } from "../../../../../shared/input/input.component";
import { SelectFieldComponent } from "../../../../../shared/select-field/select-field.component";
import { DialogHeaderComponent } from "../../../../../shared/dialog-header/dialog-header.component";
import { LoadingOverlayComponent } from "../../../../../shared/loading-overlay/loading-overlay.component";
import { LineComponent } from "../../../../../shared/line/line.component";
import { DepartmentService } from "../../../../../core/features/department/services/department.service";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { NonNullableFormBuilder, Validators } from "@angular/forms";
import { IDropdownOption } from "../../../../../shared/interfaces/dropdown-option.interface";
import { CountryService } from "../../../../../core/features/countries/services/country.service";
import { IDepartmentsPopupInputs } from "./departments-popup-inputs.component";
import { markAllControlsAsTouchedAndDirty } from "../../../../../shared/utilities/form.utilities";
import { IDepartmentRequest } from "../../../../../core/features/department/models/department-request.model";

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
        LineComponent
    ],
    templateUrl: './departments-popup.component.html',
    styleUrl: './departments-popup.component.scss'
})
export class DepartmentsPopupComponent implements OnInit{
    readonly #departmentService = inject(DepartmentService);
    readonly #matDialog = inject(MatDialog);
    readonly #fb = inject(NonNullableFormBuilder);
    countries: IDropdownOption[] = []
    readonly #countryService = inject(CountryService);
    readonly componentInputs: IDepartmentsPopupInputs = inject(MAT_DIALOG_DATA);
    isPageLoading: boolean = false;
    isFormSubmitting: boolean = false;

    formGroup = this.#fb.group({
        name: this.#fb.control("", Validators.required),
        description: this.#fb.control("", Validators.required),
        building: this.#fb.control("", Validators.required),
        address: this.#fb.group({
            streetName: this.#fb.control("", Validators.required),
            houseNumber: this.#fb.control("", Validators.required),
            door: this.#fb.control("", Validators.required),
            floor: this.#fb.control("", Validators.required),
            postalCode: this.#fb.control("", Validators.required),
            countryId: this.#fb.control("", Validators.required),
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

        this.#departmentService
            .createDepartment(this.componentInputs.sourceLevelId, this.formGroup.value as IDepartmentRequest,
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
