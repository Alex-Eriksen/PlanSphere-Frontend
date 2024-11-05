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
import { companyRoutes } from "./components/company/company.routes";
import { userRoutes } from "./components/user/user.routes";

export const mainRoutes: Routes = [
    {
        path: "",
        redirectTo: "frontpage",
        pathMatch: "full"
    },
    {
        path: "frontpage",
        component: FrontpageComponent,
        data: {
            name: "FRONTPAGE"
        }
    },
    {
        path: "organisation",
        component: OrganisationComponent,
        children: organisationRoutes,
        data: {
            name: "ORGANISATION.NAME"
        }
    },
    {
        path: "organisations",
        component: OrganisationsComponent,
        data: {
            name: "ORGANISATION.NAME_PLURAL"
        }
    },
    {
        path: "company/:companyId",
        component: CompanyComponent,
        children: companyRoutes,
        data: {
            name: "COMPANY.NAME"
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
        path: "department/:departmentId",
        component: DepartmentComponent,
        data: {
            name: "DEPARTMENT.NAME"
        }
    },
    {
        path: "departments",
        component: DepartmentsComponent,
        data: {
            name: "DEPARTMENT.NAME_PLURAL"
        }
    },
    {
        path: "team/:teamId",
        component: TeamComponent,
        data: {
            name: "TEAM.NAME"
        }
    },
    {
        path: "teams",
        component: TeamsComponent,
        data: {
            name: "TEAM.NAME_PLURAL"
        }
    },
    {
        path: "user",
        component: UserComponent,
        children: userRoutes,
        data: {
            name: "USER.NAME"
        }
    }
]
