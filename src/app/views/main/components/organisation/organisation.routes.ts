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
        component: DetailsComponent,
        data: {
            name: "DETAIL.NAME_PLURAL"
        }
    },
    {
        path: "companies",
        component: CompaniesComponent,
        data: {
            name: "COMPANY.NAME_PLURAL"
        }
    },
    {
        path: "job-titles",
        component: JobTitlesComponent,
        data: {
            name: "JOB_TITLE.NAME_PLURAL"
        }
    }
]
