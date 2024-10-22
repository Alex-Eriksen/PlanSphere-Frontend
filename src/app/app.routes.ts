import { Routes } from '@angular/router';
import {MainComponent} from "./views/main/main.component";
import {mainRoutes} from "./views/main/main.routes";

export const routes: Routes = [
    {
        path: "",
        component: MainComponent,
        children: mainRoutes,
    },
    {
        path: "**",
        redirectTo: "/"
    }
];
