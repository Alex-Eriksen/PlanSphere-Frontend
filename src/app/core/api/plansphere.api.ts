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
    }
}
