import {Routes} from "@angular/router";
import { OrganisationComponent } from "./components/organisation/organisation.component";
import { OrganisationsComponent } from "./components/organisations/organisations.component";
import { FrontpageComponent } from "./components/frontpage/frontpage.component";
import { CompanyComponent } from "./components/company/company.component";
import { CompaniesComponent } from "./components/companies/companies.component";
import { DepartmentComponent } from "./components/department/department.component";
import { DepartmentsComponent } from "./components/departments/departments.component";
import { TeamComponent } from "./components/team/team.component";
import { TeamsComponent } from "./components/teams/teams.component";
import { UserComponent } from "./components/user/user.component";
import { organisationRoutes } from "./components/organisation/organisation.routes";

export const mainRoutes: Routes = [
    {
        path: "",
        redirectTo: "frontpage",
        pathMatch: "full"
    },
    {
        path: "frontpage",
        component: FrontpageComponent
    },
    {
        path: "organisation",
        component: OrganisationComponent,
        children: organisationRoutes
    },
    {
        path: "organisations",
        component: OrganisationsComponent
    },
    {
        path: "company/:companyId",
        component: CompanyComponent
    },
    {
        path: "companies",
        component: CompaniesComponent
    },
    {
        path: "department/:departmentId",
        component: DepartmentComponent
    },
    {
        path: "departments",
        component: DepartmentsComponent
    },
    {
        path: "team/:teamId",
        component: TeamComponent
    },
    {
        path: "teams",
        component: TeamsComponent
    },
    {
        path: "user",
        component: UserComponent
    }
]
