import { Component, inject } from "@angular/core";
import { FormControl } from "@angular/forms";
import { InputComponent } from "../../../../shared/input/input.component";
import { ButtonComponent } from "../../../../shared/button/button.component";
import { Router } from "@angular/router";

@Component({
  selector: 'ps-companies',
  standalone: true,
    imports: [
        InputComponent,
        ButtonComponent
    ],
  templateUrl: './companies.component.html',
  styleUrl: './companies.component.scss'
})
export class CompaniesComponent {
    companyId = new FormControl();
    readonly #router = inject(Router);

    navigateToCompanyById() {
        this.#router.navigate([`company/${this.companyId.value}`]);
    }
}
