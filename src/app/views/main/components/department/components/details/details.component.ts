import { ButtonComponent } from "../../../../../../shared/button/button.component";
import { SelectFieldComponent } from "../../../../../../shared/select-field/select-field.component";
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Component, OnInit, input, inject } from "@angular/core";
import { InputComponent } from "../../../../../../shared/input/input.component";
import { LoadingOverlayComponent } from "../../../../../../shared/loading-overlay/loading-overlay.component";
import { LineComponent } from "../../../../../../shared/line/line.component";
import { SmallHeaderComponent } from "../../../../../../shared/small-header/small-header.component";
import { IDepartment } from "../../../../../../core/features/department/models/department.model";
import { DepartmentService } from "../../../../../../core/features/department/services/department.service";
import { CountryService } from "../../../../../../core/features/countries/services/country.service";
import { ToastService } from "../../../../../../core/services/error-toast.service";
import { IDropdownOption } from "../../../../../../shared/interfaces/dropdown-option.interface";
import { SourceLevel } from "../../../../../../core/enums/source-level.enum";
import {
    markAllControlsAsTouchedAndDirty,
    updateNestedControlsPathAndValue
} from "../../../../../../shared/utilities/form.utilities";


@Component({
    imports: [
        InputComponent,
        ButtonComponent,
        SelectFieldComponent,
        LoadingOverlayComponent,
        ReactiveFormsModule,
        LineComponent,
        SmallHeaderComponent
    ],
    selector: "ps-details",
    standalone: true,
    styleUrl: "./details.component.scss",
    templateUrl: "./details.component.html"
})
export class DetailsComponent implements OnInit{
    departmentId = input.required<number>()
    department?: IDepartment
    readonly #departmentService = inject(DepartmentService);
    readonly #fb = inject(NonNullableFormBuilder);
    readonly #countryService = inject(CountryService);
    readonly #toastService = inject(ToastService);
    countries: IDropdownOption[] = []
    sourceLevel = SourceLevel.Department
    isPageLoading: boolean = false;

    ngOnInit(): void {
        this.isPageLoading = true;
        if (this.departmentId) {
            this.#loadCountries();
            this.loadDepartmentDetails(this.sourceLevel,this.departmentId());
        }
        if (this.departmentId == null){
            this.#toastService.showToast('DEPARTMENT.DO_NOT_EXIST')
        }
    }

    formGroup = this.#fb.group({
        name: this.#fb.control("", Validators.required),
        description: this.#fb.control("", Validators.required),
        building: this.#fb.control("", Validators.required),
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
            this.#departmentService.patch(this.departmentId(), paths).subscribe()
        }
    }

    loadDepartmentDetails(sourceLevel: SourceLevel, departmentId: number): void {
        this.#departmentService.departmentById( departmentId, sourceLevel, departmentId).subscribe({
            next: (data: IDepartment) => this.formGroup.patchValue(data),
            error: () => this.#toastService.showToast('DEPARTMENT.DO_NOT_EXIST'),
            complete: () => this.isPageLoading = false
        });
    }

    deleteDepartment(id: number): void {
        this.#departmentService.deleteDepartment(id, id)
    }

    protected readonly input = input;
}
