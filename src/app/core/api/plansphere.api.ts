import { environment } from "../../../environments/environment";

export const APIS = {
    getWeatherForecast: environment.apiUrl + "WeatherForecast/GetWeatherForecast",
    authentication: {
        login: environment.apiUrl + "Authentication/Login",
        refreshToken: environment.apiUrl + "Authentication/RefreshToken",
        revokeToken: environment.apiUrl + "Authentication/revokeRefreshToken",
        getLoggedInUser: environment.apiUrl + "Authentication/GetLoggedInUser",
    },
    company: {
        getById: (id: number)=> environment.apiUrl + `Company/GetCompanyById/${id}`,
        create: environment.apiUrl + `Company/CreateCompany`,
        patch: (id: number)=> environment.apiUrl + `Company/UpdateCompany/${id}`,
        delete: (id: number) => environment.apiUrl + `Company/DeleteCompany/${id}`,
    },
    country: {
        getCountryLookups: environment.apiUrl + "Country/GetCountryLookups",
    }
}
