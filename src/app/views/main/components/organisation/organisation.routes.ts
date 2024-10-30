import { Routes } from "@angular/router";
import { DetailsComponent } from "./components/details/details.component";
import { JobTitlesComponent } from "./components/jobtitles/job-titles.component";
import { CompaniesComponent } from "./components/companies/companies.component";

export const organisationRoutes: Routes = [
    {
        path: "",
        pathMatch: "full",
        redirectTo: "details"
    },
    {
        path: "details",
        component: DetailsComponent
    },
    {
        path: "companies",
        component: CompaniesComponent
    },
    {
        path: "job-titles",
        component: JobTitlesComponent
    }
]
