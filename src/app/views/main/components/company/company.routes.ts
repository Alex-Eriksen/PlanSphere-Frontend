import { Route } from "@angular/router";
import { DetailsComponent } from "./components/details/details.component";
import { DepartmentsComponent } from "../departments/departments.component";

export const companyRoutes: Route[] = [
    {
        path: "",
        pathMatch: "full",
        redirectTo: "details"
    },
    {
        path: 'details',
        component: DetailsComponent,
        data: {
            name: "DETAIL.NAME_PLURAL"
        }
    },
    {
        path: 'departments',
        component: DepartmentsComponent,
        data: {
            name: "DEPARTMENT.NAME_PLURAL"
        }
    }
]
