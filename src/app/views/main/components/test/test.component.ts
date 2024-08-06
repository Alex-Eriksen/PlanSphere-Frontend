import { Component, inject, OnInit } from "@angular/core";
import { WeatherForecastService } from "../../../../core/features/weatherForecast/services/weather-forecast.service";
import { IWeatherForecast } from "../../../../core/features/weatherForecast/models/weather-forecast.model";
import { TranslateModule } from "@ngx-translate/core";

@Component({
  selector: 'ps-test',
  standalone: true,
    imports: [
        TranslateModule
    ],
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss'
})
export class TestComponent implements OnInit {
    readonly #weatherForecastService = inject(WeatherForecastService);
    protected weatherForecasts: IWeatherForecast[] = [];

    ngOnInit(): void {
        this.#weatherForecastService.getWeatherForecast()
            .subscribe({ next: (weatherForecasts) => this.weatherForecasts = weatherForecasts });
    }

}
