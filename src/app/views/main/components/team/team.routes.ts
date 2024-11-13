import { Route } from "@angular/router";
import { DetailsComponent } from "../department/components/details/details.component";
import { RolesComponent } from "../department/components/roles/roles.component";
import { SettingsComponent } from "../department/components/settings/settings.component";

export const teamRoutes: Route[] = [
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
    },
    {
        path: 'settings',
        component: SettingsComponent,
        data: {
            name: "SETTINGS.NAME_PLURAL"
        }
    }
]
