﻿import { environment } from "../../../environments/environment";
import { SourceLevel } from "../enums/source-level.enum";

export const APIS = {
    getWeatherForecast: environment.apiUrl + "WeatherForecast/GetWeatherForecast",
    authentication: {
        login: environment.apiUrl + "Authentication/Login",
        refreshToken: environment.apiUrl + "Authentication/RefreshToken",
        revokeToken: environment.apiUrl + "Authentication/revokeRefreshToken",
        getLoggedInUser: environment.apiUrl + "Authentication/GetLoggedInUser",
        getSourceLevelRights: (sourceLevel: SourceLevel, sourceLevelId: number) => environment.apiUrl + `Authentication/GetSourceLevelRights/${sourceLevel}/${sourceLevelId}`,
        resetPassword: environment.apiUrl + "Authentication/ResetPassword",
        requestPasswordReset: environment.apiUrl + "Authentication/RequestPasswordReset",
    },
    workSchedules: {
        lookUpWorkSchedules: environment.apiUrl + "WorkSchedule/LookUpWorkSchedules",
        getWorkScheduleById: (workScheduleId: number) => environment.apiUrl + `WorkSchedule/GetWorkScheduleById/${workScheduleId}`,
        updateWorkScheduleWithId: (sourceLevel: SourceLevel, sourceLevelId: number, workScheduleId: number) => environment.apiUrl + `WorkSchedule/UpdateWorkSchedule/${sourceLevel}/${sourceLevelId}/${workScheduleId}`,
        updateWorkScheduleWithoutId: (sourceLevel: SourceLevel, sourceLevelId: number) => environment.apiUrl + `WorkSchedule/UpdateWorkSchedule/${sourceLevel}/${sourceLevelId}`,
    },
    users: {
        createUser: (sourceLevel: SourceLevel, sourceLevelId: number) => environment.apiUrl + `User/CreateUser/${sourceLevel}/${sourceLevelId}`,
        getUserDetailsWithId: (userId: number) => environment.apiUrl + `User/GetUserDetails/${userId}`,
        getUserDetailsWithoutId: environment.apiUrl + `User/GetUserDetails`,
        patchUserWithId: (userId: number) => environment.apiUrl + `User/PatchUser/${userId}`,
        patchUserWithoutId: environment.apiUrl + `User/PatchUser`,
        getRights: environment.apiUrl + `Authentication/GetSourceLevelRights`,
        listUsers: (sourceLevel: SourceLevel, sourceLevelId: number) => environment.apiUrl + `User/ListUsers/${sourceLevel}/${sourceLevelId}`,
        updateUser: (sourceLevel: SourceLevel, sourceLevelId: number, userId: number) => environment.apiUrl + `User/UpdateUser/${sourceLevel}/${sourceLevelId}/${userId}`,
        deleteUser: (sourceLevel: SourceLevel, sourceLevelId: number, userId: number) => environment.apiUrl + `User/DeleteUser/${sourceLevel}/${sourceLevelId}/${userId}`,
        lookUpUsers: (organisationId?: number) => environment.apiUrl + `User/LookUpUsers/${organisationId}`,
    },
    roles: {
        createRole: (sourceLevel: SourceLevel, sourceLevelId: number) => environment.apiUrl + `Role/CreateRole/${sourceLevel}/${sourceLevelId}`,
        listAll: (sourceLevel: SourceLevel, sourceLevelId: number) => environment.apiUrl + `Role/ListRoles/${sourceLevel}/${sourceLevelId}`,
        lookUpRoles: () => environment.apiUrl + `Role/LookUpRoles/`,
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
        changeOwnership: (userId: number) => environment.apiUrl + `Organisation/ChangeOrganisationOwner/${userId}`
    },
    jobTitles: {
        listAll: (sourceLevel: SourceLevel, sourceLevelId: number) => environment.apiUrl + `JobTitle/ListJobTitle/${sourceLevel}/${sourceLevelId}`,
        getById: (id: number) => environment.apiUrl + `JobTitle/GetJobTitle/${id}`,
        create: (sourceLevel: SourceLevel, sourceLevelId: number) => environment.apiUrl + `JobTitle/CreateJobTitle/${sourceLevel}/${sourceLevelId}`,
        update: (sourceLevel: SourceLevel, sourceLevelId: number, id: number) => environment.apiUrl + `JobTitle/UpdateJobTitle/${sourceLevel}/${sourceLevelId}/${id}`,
        delete: (id: number) => environment.apiUrl + `JobTitle/DeleteJobTitle/${id}`,
        toggleInheritance: (sourceLevel: SourceLevel, sourceLevelId: number, id: number) => environment.apiUrl + `JobTitle/ToggleInheritance/${sourceLevel}/${sourceLevelId}/${id}`,
        lookUpJobTitles: () => environment.apiUrl + 'JobTitle/LookUpJobTitles/',
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
        getById: (sourceLevelId: number, companyId: number)=> environment.apiUrl + `Company/GetCompanyById/${sourceLevelId}/${companyId}`,
        listCompanies: (sourceLevelId: number)=>environment.apiUrl + `Company/ListCompanies/${sourceLevelId}`,
        listUserCompanies: environment.apiUrl + "Company/ListUserCompanies",
        create: (sourceLevelId: number) => environment.apiUrl + `Company/CreateCompany/${sourceLevelId}`,
        patch: (sourceLevelId: number)=> environment.apiUrl + `Company/PatchCompany/${sourceLevelId}`,
        delete: (sourceLevelId: number, companyId: number) => environment.apiUrl + `Company/DeleteCompany/${sourceLevelId}/${companyId}`,
        uploadLogo: (id: number) => environment.apiUrl + `Company/UploadCompanyLogo/${id}`
    },
    department: {
        getById: (sourceLevelId: number, sourceLevel: SourceLevel, departmentId: number) => environment.apiUrl + `Department/GetDepartmentId/${departmentId}/${sourceLevel}/${sourceLevelId}`,
        listDepartments: (sourceLevelId: number) => environment.apiUrl + `Department/ListDepartments/${sourceLevelId}`,
        listUserDepartments: environment.apiUrl + "Department/ListUserDepartments",
        create: (sourceLevelId: number) => environment.apiUrl + `Department/CreateDepartment/${sourceLevelId}`,
        patch: (sourceLevelId: number) => environment.apiUrl + `Department/PatchDepartment/${sourceLevelId}`,
        delete: (sourceLevelId: number, departmentId: number) => environment.apiUrl + `Department/DeleteDepartment/${sourceLevelId}/${departmentId}`,
        lookUpDepartments: environment.apiUrl + "Department/LookUpDepartments",
    },
    team: {
        getById: (sourceLevelId: number, sourceLevel: SourceLevel, teamId: number) => environment.apiUrl + `Team/GetTeamById/${teamId}/${sourceLevel}/${sourceLevelId}`,
        listTeams: (sourceLevelId: number) => environment.apiUrl + `Team/ListTeam/${sourceLevelId}`,
        listUserTeams: environment.apiUrl + "Team/ListUserTeams",
        create: (sourceLevelId: number) => environment.apiUrl + `Team/CreateTeam/${sourceLevelId}`,
        patch: (sourceLevelId: number) => environment.apiUrl + `Team/PatchTeam/${sourceLevelId}`,
        delete: (sourceLevelId: number, teamId: number) => environment.apiUrl + `Team/DeleteTeam/${sourceLevelId}/${teamId}`,
        lookUpTeams: environment.apiUrl + "Team/LookUpTeams",
    },
    country: {
        getCountryLookups: environment.apiUrl + "Country/GetCountryLookups",
    },
    zipCode: {
        getZipCodeLookups: environment.apiUrl + "ZipCode/GetZipCodeLookups",
    },
    workTimes: {
        getWorkTimesInMonth: environment.apiUrl + "WorkTime/GetWorkTimes",
        createWorkTime: environment.apiUrl + "WorkTime/CreateWorkTime",
        updateWorkTime: (workTimeId: number) => environment.apiUrl + `WorkTime/UpdateWorkTime/${workTimeId}`,
        deleteWorkTime: (workTimeId: number) => environment.apiUrl + `WorkTime/DeleteWorkTime/${workTimeId}`,
        checkIn: environment.apiUrl + "WorkTime/CheckIn",
        checkOut: environment.apiUrl + "WorkTime/CheckOut",
        getWorkTimeWithinPeriod: environment.apiUrl + "WorkTime/GetTotalWorkTimeWithinPeriod"
    }
}
