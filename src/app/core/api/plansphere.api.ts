﻿import { environment } from "../../../environments/environment";
import { SourceLevel } from "../enums/source-level.enum";

export const APIS = {
    getWeatherForecast: environment.apiUrl + "WeatherForecast/GetWeatherForecast",
    authentication: {
        login: environment.apiUrl + "Authentication/Login",
        refreshToken: environment.apiUrl + "Authentication/RefreshToken",
        revokeToken: environment.apiUrl + "Authentication/revokeRefreshToken",
        getLoggedInUser: environment.apiUrl + "Authentication/GetLoggedInUser",
    },
    roles: {
        createRole: (sourceLevel: SourceLevel, sourceLevelId: number) => environment.apiUrl + `Role/CreateRole/${sourceLevel}/${sourceLevelId}`,
        listAll: (sourceLevel: SourceLevel, sourceLevelId: number) => environment.apiUrl + `Role/ListRoles/${sourceLevel}/${sourceLevelId}`,
        updateRole: (sourceLevel: SourceLevel, sourceLevelId: number, roleId: number) => environment.apiUrl + `Role/UpdateRole/${sourceLevel}/${sourceLevelId}/${roleId}`,
        deleteRole: (sourceLevel: SourceLevel, sourceLevelId: number, roleId: number) => environment.apiUrl + `Role/DeleteRole/${sourceLevel}/${sourceLevelId}/${roleId}`,
        getById: (sourceLevel: SourceLevel, sourceLevelId: number, roleId: number) => environment.apiUrl + `Role/GetRoleById/${sourceLevel}/${sourceLevelId}/${roleId}`,
        toggleRoleInheritance: (sourceLevel: SourceLevel, sourceLevelId: number,  roleId: number) => environment.apiUrl + `Role/ToggleRoleInheritance/${sourceLevel}/${sourceLevelId}/${roleId}`,
        lookUpRights: environment.apiUrl + "Role/LookUpRights",
    },
    companies: {
        lookup: environment.apiUrl + "Company/LookUpCompanies",
    },
    organisations: {
        lookUp: environment.apiUrl + "Organisation/LookUpOrganisations",
    },
    jobTitles: {
        listAll: (sourceLevel: SourceLevel, sourceLevelId: number) => environment.apiUrl + `JobTitle/ListJobTitle/${sourceLevel}/${sourceLevelId}`,
        getById: (id: number) => environment.apiUrl + `JobTitle/GetJobTitle/${id}`,
        create: (sourceLevel: SourceLevel, sourceLevelId: number) => environment.apiUrl + `JobTitle/CreateJobTitle/${sourceLevel}/${sourceLevelId}`,
        update: (sourceLevel: SourceLevel, sourceLevelId: number, id: number) => environment.apiUrl + `JobTitle/UpdateJobTitle/${sourceLevel}/${sourceLevelId}/${id}`,
        delete: (id: number) => environment.apiUrl + `JobTitle/DeleteJobTitle/${id}`,
        toggleInheritance: (id: number) => environment.apiUrl + `JobTitle/ToggleInheritance/${id}`,
    },
    organisation: {
        createOrganisation: () => environment.apiUrl + "Organisation/CreateOrganisation",
        getOrganisationDetailsById: (sourceLevelId: number) => environment.apiUrl + `Organisation/GetOrganisationById/${sourceLevelId}`,
        getListOfOrganisations: () => environment.apiUrl + `Organisation/ListOrganisations`,
        patch: (sourceLevelId: number) => environment.apiUrl + `Organisation/PatchOrganisation/${sourceLevelId}`,
        delete: (sourceLevelId: number) => environment.apiUrl + `Organisation/DeleteOrganisation/${sourceLevelId}`,
        update: (sourceLevelId: number) => environment.apiUrl + `Organisation/UpdateOrganisation/${sourceLevelId}`,
    },
    company: {
        getById: (id: number)=> environment.apiUrl + `Company/GetCompanyById/${id}`,
        listCompanies: () => environment.apiUrl + `Company/ListCompanies`,
        create: environment.apiUrl + `Company/CreateCompany`,
        patch: (id: number)=> environment.apiUrl + `Company/PatchCompany/${id}`,
        delete: (id: number) => environment.apiUrl + `Company/DeleteCompany/${id}`,
    },
    country: {
        getCountryLookups: environment.apiUrl + "Country/GetCountryLookups",
    },
    zipCode: {
        getZipCodeLookups: environment.apiUrl + "ZipCode/GetZipCodeLookups",
    }
}
