import {Routes} from "@angular/router";
import {TestComponent} from "./components/test/test.component";

export const mainRoutes: Routes = [
    {
        path: "",
        redirectTo: "test",
        pathMatch: "full"
    },
    {
        path: "test",
        component: TestComponent
    }
]
