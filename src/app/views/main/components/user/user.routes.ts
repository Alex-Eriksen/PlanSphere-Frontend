import { Route } from "@angular/router";
import { DetailsComponent } from "./components/details/details.component";
import { SettingsComponent } from "./components/settings/settings.component";

export const userRoutes: Route[] = [
    {
        path: '',
        redirectTo: 'details',
        pathMatch: 'full',
    },
    {
        path: 'details',
        component: DetailsComponent,
        data: {
            name: "DETAIL.NAME_PLURAL",
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
