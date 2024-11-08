import { Component, input } from "@angular/core";
import { DepartmentListComponent } from "../../../../../../shared/list-department/department-list.component";

@Component({
  selector: 'ps-departments',
  standalone: true,
    imports: [
        DepartmentListComponent
    ],
  templateUrl: './departments.component.html',
  styleUrl: './departments.component.scss'
})
export class DepartmentsComponent {
    companyId = input.required<number>();

}
