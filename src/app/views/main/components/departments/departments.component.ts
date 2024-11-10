import { Component  } from "@angular/core";
import { DepartmentListComponent } from "../../../../shared/list-department/department-list.component";
import { RouterOutlet } from "@angular/router";

@Component({
    selector: 'ps-departments',
    standalone: true,
    imports: [
        DepartmentListComponent,
        RouterOutlet
    ],
  templateUrl: './departments.component.html',
  styleUrl: './departments.component.scss'
})
export class DepartmentsComponent  {
}
