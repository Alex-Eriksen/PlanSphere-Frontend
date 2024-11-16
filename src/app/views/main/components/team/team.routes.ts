import { Route } from "@angular/router";
import { DetailsComponent } from "./components/details/details.component";
import { RolesComponent } from "./components/roles/roles.component";
import { SettingsComponent } from "./components/settings/settings.component";
import { JobTitlesComponent } from "./components/job-titles/job-titles.component";

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
        path: "job-titles",
        component: JobTitlesComponent,
        data: {
            name: "JOB_TITLE.NAME_PLURAL"
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
