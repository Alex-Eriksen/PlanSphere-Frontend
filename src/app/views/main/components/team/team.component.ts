import { Component, inject, input, OnInit } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { NavigationTabsComponent } from "../../../../shared/navigation-tabs/navigation-tabs.component";
import { LoadingOverlayComponent } from "../../../../shared/loading-overlay/loading-overlay.component";
import { AuthenticationService } from "../../../../core/features/authentication/services/authentication.service";
import { ISourceLevelRights } from "../../../../core/features/authentication/models/source-level-rights.model";
import { INavigationTab } from "../../../../shared/navigation-tabs/navigation-tab.interface";
import { SourceLevel } from "../../../../core/enums/source-level.enum";
import { instanceOfRightsListener } from "../../../../core/interfaces/rights-data.interface";
import { hasEditAccess, hasManageUsersRights, hasViewAccess } from "../../../../shared/utilities/right.utilities";

@Component({
  selector: 'ps-team',
  standalone: true,
  imports: [
      RouterOutlet,
      NavigationTabsComponent,
      LoadingOverlayComponent
  ],
  templateUrl: './team.component.html',
  styleUrl: './team.component.scss'
})
export class TeamComponent implements OnInit {
    readonly #authService = inject(AuthenticationService);
    teamId = input.required<number>();
    rightsData!: ISourceLevelRights;
    isPageLoading = false;
    tabs: INavigationTab[] = [
        {
            label: "DETAIL.NAME_PLURAL",
            routeLink: "details",
            icon: "fa-solid fa-circle-info",
            isVisible: () => hasViewAccess(this.rightsData)
        },
        {
            label: "JOB_TITLE.NAME_PLURAL",
            routeLink: "job-titles",
            icon: "fa-solid fa-table-list",
            isVisible: () => hasViewAccess(this.rightsData)
        },
        {
            label: "ROLE.NAME_PLURAL",
            routeLink: "roles",
            icon: "fa-solid fa-user-check",
            isVisible: () => hasViewAccess(this.rightsData)
        },
        {
            label: "USER.NAME_PLURAL",
            routeLink: "users",
            icon: "fa-solid fa-user-check",
            isVisible: () => hasManageUsersRights(this.rightsData)
        },
        {
            label: "SETTINGS.NAME_PLURAL",
            routeLink: "settings",
            isVisible: () => hasEditAccess(this.rightsData)
        }
    ]

    ngOnInit(): void{
        this.isPageLoading = true;
        this.#authService.getRights(SourceLevel.Team, this.teamId()).subscribe((data) => {
            this.rightsData = data;
            this.isPageLoading = false;
        })
    }

    onRouterOutletActivate(activatedComponent: any) {
        if (!instanceOfRightsListener(activatedComponent)) return;
        activatedComponent.setRightsData(this.rightsData);
    }
}
