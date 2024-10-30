import { Routes } from '@angular/router';
import {MainComponent} from "./views/main/main.component";
import {mainRoutes} from "./views/main/main.routes";
import { SignInComponent } from "./views/main/components/sign-in/sign-in.component";

export const routes: Routes = [
    {
        path: "",
        component: MainComponent,
        children: mainRoutes,
    },
    {
        path: "sign-in",
        component: SignInComponent
    },
    {
        path: "**",
        redirectTo: "/"
    }
];
