import { inject, Injectable } from "@angular/core";
import { WeatherForecastRepository } from "../repositories/weather-forecast.repository";
import { Observable } from "rxjs";
import { IWeatherForecast } from "../models/weather-forecast.model";

@Injectable({
    providedIn: "root"
})
export class WeatherForecastService {
    readonly #weatherForecastRepository = inject(WeatherForecastRepository);

    getWeatherForecast(): Observable<IWeatherForecast[]> {
        return this.#weatherForecastRepository.getWeatherForecast();
    }
}
