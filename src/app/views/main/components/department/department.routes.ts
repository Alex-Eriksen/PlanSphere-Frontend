import { Route } from "@angular/router";
import { DetailsComponent } from "./components/details/details.component";
import { SettingsComponent } from "./components/settings/settings.component";
import { RolesComponent } from "./components/roles/roles.component";
import { TeamsComponent } from "./components/teams/teams.component";
import { UsersComponent } from "./components/users/users.component";


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
        path: 'teams',
        component: TeamsComponent,
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
        path: "users",
        component: UsersComponent,
        data: {
            name: "USER.NAME_PLURAL"
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
