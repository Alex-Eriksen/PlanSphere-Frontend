import { Component, inject } from "@angular/core";
import { RouterOutlet } from '@angular/router';
import { GlobalLoaderService } from "./core/services/global-loader.service";
import { GlobalLoaderComponent } from "./shared/global-loader/global-loader.component";

@Component({
    selector: 'ps-root',
    standalone: true,
    imports: [RouterOutlet, GlobalLoaderComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
    title = 'PlanSphere';
    readonly globalLoaderService = inject(GlobalLoaderService);
}
