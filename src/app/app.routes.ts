import { Routes } from '@angular/router';
import {MainComponent} from "./views/main/main.component";
import {mainRoutes} from "./views/main/main.routes";
import { SignInComponent } from "./views/main/components/sign-in/sign-in.component";
import { AuthGuard } from "./core/guards/auth.guard";
import { ResetPasswordComponent } from "./views/main/components/reset-password/reset-password.component";

export const routes: Routes = [
    {
        path: "",
        component: MainComponent,
        children: mainRoutes,
        canActivate: [AuthGuard]
    },
    {
        path: "sign-in",
        component: SignInComponent
    },
    {
        path: "reset-password",
        component: ResetPasswordComponent,
    },
    {
        path: "**",
        redirectTo: "/"
    }
];
