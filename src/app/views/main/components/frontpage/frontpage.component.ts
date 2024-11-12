import { Component, DestroyRef, inject, OnInit } from "@angular/core";
import { ButtonComponent } from "../../../../shared/button/button.component";
import { LoadingOverlayComponent } from "../../../../shared/loading-overlay/loading-overlay.component";
import { NgClass, NgIf } from "@angular/common";
import { LineComponent } from "../../../../shared/line/line.component";
import { SubHeaderComponent } from "../../../../shared/sub-header/sub-header.component";
import { SmallHeaderComponent } from "../../../../shared/small-header/small-header.component";
import { TranslateModule } from "@ngx-translate/core";
import { CalenderTableComponent } from "../../../../shared/calender-table/calender-table.component";
import { CalendarSidePanelComponent } from "../../../../shared/calendar-side-panel/calendar-side-panel.component";
import { CalendarComponent } from "../../../../shared/calendar/calendar.component";
import { AuthenticationService } from "../../../../core/features/authentication/services/authentication.service";
import { UserService } from "../../../../core/features/users/services/user.service";
import { catchError, finalize, of, tap } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { IUser } from "../../../../core/features/users/models/user.model";
import { IWorkSchedule } from "../../../../core/features/workSchedules/models/work-schedule.model";

@Component({
  selector: 'ps-frontpage',
  standalone: true,
    imports: [
        ButtonComponent,
        LoadingOverlayComponent,
        NgClass,
        NgIf,
        LineComponent,
        SubHeaderComponent,
        SmallHeaderComponent,
        TranslateModule,
        CalenderTableComponent,
        CalendarSidePanelComponent,
        CalendarComponent
    ],
  templateUrl: './frontpage.component.html',
  styleUrl: './frontpage.component.scss'
})
export class FrontpageComponent implements OnInit {
    readonly #destroyRef = inject(DestroyRef);
    readonly #authenticationService = inject(AuthenticationService);
    readonly #userService = inject(UserService);
    isPageLoading: boolean = false;
    workSchedule!: IWorkSchedule;

    ngOnInit() {
        this.isPageLoading = true;
        this.#userService.getUserDetails(this.#authenticationService.getUserId())
            .pipe(
                takeUntilDestroyed(this.#destroyRef),
                tap((userDetails: IUser) => {
                    this.workSchedule = userDetails.settings.workSchedule;
                }),
                catchError((error) => {
                    console.error('Error fetching user details:', error);
                    return of(null);
                }),
                finalize(() => {
                    this.isPageLoading = false;
                })
            )
            .subscribe();
    }
}
