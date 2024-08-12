import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { APIS } from "../../../api/plansphere.api";
import { IWeatherForecast } from "../models/weather-forecast.model";

@Injectable({
    providedIn: "root"
})
export class WeatherForecastRepository {
    readonly #http = inject(HttpClient);

    getWeatherForecast(): Observable<IWeatherForecast[]> {
        return this.#http.get<IWeatherForecast[]>(APIS.getWeatherForecast);
    }
}
