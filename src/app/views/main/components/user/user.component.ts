import { Component, inject, OnInit } from "@angular/core";
import { NavigationTabsComponent } from "../../../../shared/navigation-tabs/navigation-tabs.component";
import { RouterOutlet } from "@angular/router";
import { INavigationTab } from "../../../../shared/navigation-tabs/navigation-tab.interface";
import { instanceOfRightsListener, IRightsListener } from "../../../../core/interfaces/rights-data.interface";
import { ISourceLevelRights } from "../../../../core/features/authentication/models/source-level-rights.model";
import { AuthenticationService } from "../../../../core/features/authentication/services/authentication.service";
import { LoadingOverlayComponent } from "../../../../shared/loading-overlay/loading-overlay.component";

@Component({
  selector: 'ps-user',
  standalone: true,
    imports: [
        NavigationTabsComponent,
        RouterOutlet,
        LoadingOverlayComponent
    ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit {
    readonly #authService = inject(AuthenticationService);
    isPageLoading = false;
    tabs: INavigationTab[] = [
        {
            label: "DETAIL.NAME_PLURAL",
            routeLink: "details"
        },
        {
            label: "SETTINGS.NAME_PLURAL",
            routeLink: "settings"
        }
    ];
    rightsData!: ISourceLevelRights;

    ngOnInit() {
        this.isPageLoading = true;
        this.#authService.getRights().subscribe((data) => {
            this.rightsData = data;
            this.isPageLoading = false;
        });
    }

    onRouterOutletActivate(activatedComponent: any) {
        if (!instanceOfRightsListener(activatedComponent)) return;
        (activatedComponent as IRightsListener).setRightsData(this.rightsData);
    }
}
