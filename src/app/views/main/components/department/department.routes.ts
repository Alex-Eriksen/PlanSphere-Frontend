﻿import { Route } from "@angular/router";
import { DetailsComponent } from "./components/details/details.component";


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
]