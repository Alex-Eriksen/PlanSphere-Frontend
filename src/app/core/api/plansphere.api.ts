import { environment } from "../../../environments/environment";
import { SourceLevel } from "../enums/source-level.enum";

export const APIS = {
    getWeatherForecast: environment.apiUrl + "WeatherForecast/GetWeatherForecast",
    authentication: {
        login: environment.apiUrl + "Authentication/Login",
        refreshToken: environment.apiUrl + "Authentication/RefreshToken",
        revokeToken: environment.apiUrl + "Authentication/revokeRefreshToken",
        getLoggedInUser: environment.apiUrl + "Authentication/GetLoggedInUser",
        getSourceLevelRights: (sourceLevel: SourceLevel, sourceLevelId: number) => environment.apiUrl + `Authentication/GetSourceLevelRights/${sourceLevel}/${sourceLevelId}`
    },
    workSchedules: {
        lookUpWorkSchedules: environment.apiUrl + "WorkSchedule/LookUpWorkSchedules",
        getWorkScheduleById: (workScheduleId: number) => environment.apiUrl + `WorkSchedule/GetWorkScheduleById/${workScheduleId}`,
        updateWorkScheduleWithId: (sourceLevel: SourceLevel, sourceLevelId: number, workScheduleId: number) => environment.apiUrl + `WorkSchedule/UpdateWorkSchedule/${sourceLevel}/${sourceLevelId}/${workScheduleId}`,
        updateWorkScheduleWithoutId: (sourceLevel: SourceLevel, sourceLevelId: number) => environment.apiUrl + `WorkSchedule/UpdateWorkSchedule/${sourceLevel}/${sourceLevelId}`,
    },
    users: {
        getUserDetailsWithId: (userId: number) => environment.apiUrl + `User/GetUserDetails/${userId}`,
        getUserDetailsWithoutId: environment.apiUrl + `User/GetUserDetails`,
        patchUserWithId: (userId: number) => environment.apiUrl + `User/PatchUser/${userId}`,
        patchUserWithoutId: environment.apiUrl + `User/PatchUser`,
        getRights: environment.apiUrl + `Authentication/GetSourceLevelRights`
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
        toggleInheritance: (sourceLevel: SourceLevel, sourceLevelId: number, id: number) => environment.apiUrl + `JobTitle/ToggleInheritance/${sourceLevel}/${sourceLevelId}/${id}`,
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
    country: {
        getCountryLookups: environment.apiUrl + "Country/GetCountryLookups",
    },
    zipCode: {
        getZipCodeLookups: environment.apiUrl + "ZipCode/GetZipCodeLookups",
    }
}
