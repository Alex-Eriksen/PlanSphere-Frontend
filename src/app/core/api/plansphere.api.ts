import { environment } from "../../../environments/environment";
import { SourceLevel } from "../enums/source-level.enum";

export const APIS = {
    getWeatherForecast: environment.apiUrl + "WeatherForecast/GetWeatherForecast",
    authentication: {
        login: environment.apiUrl + "Authentication/Login",
        refreshToken: environment.apiUrl + "Authentication/RefreshToken",
        revokeToken: environment.apiUrl + "Authentication/revokeRefreshToken",
        getLoggedInUser: environment.apiUrl + "Authentication/GetLoggedInUser",
    },
    jobTitles: {
        listAll: (sourceLevel: SourceLevel, sourceLevelId: number) => environment.apiUrl + `JobTitle/ListJobTitle/${sourceLevel}/${sourceLevelId}`,
        getById: (id: number) => environment.apiUrl + `JobTitle/GetJobTitle/${id}`,
        create: (sourceLevel: SourceLevel, sourceLevelId: number) => environment.apiUrl + `JobTitle/CreateJobTitle/${sourceLevel}/${sourceLevelId}`,
        update: (sourceLevel: SourceLevel, sourceLevelId: number, id: number) => environment.apiUrl + `JobTitle/UpdateJobTitle/${sourceLevel}/${sourceLevelId}/${id}`,
        delete: (id: number) => environment.apiUrl + `JobTitle/DeleteJobTitle/${id}`,
        toggleInheritance: (id: number) => environment.apiUrl + `JobTitle/ToggleInheritance/${id}`,
    },
    company: {
        getById: (sourceLevelId: number, companyId: number)=> environment.apiUrl + `Company/GetCompanyById/${sourceLevelId}/${companyId}`,
        listCompanies: (sourceLevelId: number)=>environment.apiUrl + `Company/ListCompanies/${sourceLevelId}`,
        create: (sourceLevelId: number) => environment.apiUrl + `Company/CreateCompany/${sourceLevelId}`,
        patch: (sourceLevelId: number)=> environment.apiUrl + `Company/PatchCompany/${sourceLevelId}`,
        delete: (sourceLevelId: number) => environment.apiUrl + `Company/DeleteCompany/${sourceLevelId}`,
    },
    department: {
        getById: (sourceLevelId: number, sourceLevel: SourceLevel, departmentId: number) => environment.apiUrl + `Department/GetDepartmentId/${departmentId}/${sourceLevel}/${sourceLevelId}`,
        listDepartments: (sourceLevelId: number) => environment.apiUrl + `Department/ListDepartments/${sourceLevelId}`,
        create: (sourceLevelId: number) => environment.apiUrl + `Department/CreateDepartment/${sourceLevelId}`,
        patch: (sourceLevelId: number) => environment.apiUrl + `Department/PatchDepartment/${sourceLevelId}`,
        delete: (sourceLevelId: number, departmentId: number) => environment.apiUrl + `Department/DeleteDepartment/${sourceLevelId}/${departmentId}`,
    },
    country: {
        getCountryLookups: environment.apiUrl + "Country/GetCountryLookups",
    }
}
