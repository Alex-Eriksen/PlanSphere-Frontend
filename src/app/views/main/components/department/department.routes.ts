import { Route } from "@angular/router";
import { DetailsComponent } from "./components/details/details.component";
import { RolesComponent } from "./components/roles/roles.component";


export const departmentRoutes: Route[] = [
    {
        path:"",
        pathMatch:"full",
        redirectTo:"details"
    },
    {
        path: 'details',
        component: DetailsComponent,
        data: {
            name: "DETAIL.NAME_PLURAL"
        }
    },
    {
        path: 'roles',
        component: RolesComponent,
        data: {
            name: "ROLE.NAME_PLURAL"
        }
    }
]
