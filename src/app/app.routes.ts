import { Routes } from '@angular/router';
import {MainComponent} from "./views/main/main.component";
import {mainRoutes} from "./views/main/main.routes";
import { AuthGuard } from "./core/guards/auth.guard";

export const routes: Routes = [
    {
        path: "",
        component: MainComponent,
        canActivate: [AuthGuard],
        children: mainRoutes,
    },
    {
        path: "**",
        redirectTo: "/"
    }
];
