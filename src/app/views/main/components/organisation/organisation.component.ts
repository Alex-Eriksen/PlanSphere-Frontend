import { Component, inject, OnInit } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { NavigationTabsComponent } from "../../../../shared/navigation-tabs/navigation-tabs.component";
import { INavigationTab } from "../../../../shared/navigation-tabs/navigation-tab.interface";
import { instanceOfRightsListener, IRightsListener } from "../../../../core/interfaces/rights-data.interface";
import { AuthenticationService } from "../../../../core/features/authentication/services/authentication.service";
import { ISourceLevelRights } from "../../../../core/features/authentication/models/source-level-rights.model";
import { SourceLevel } from "../../../../core/enums/source-level.enum";
import { LoadingOverlayComponent } from "../../../../shared/loading-overlay/loading-overlay.component";

@Component({
  selector: 'ps-organisation',
  standalone: true,
    imports: [
        RouterOutlet,
        NavigationTabsComponent,
        LoadingOverlayComponent
    ],
  templateUrl: './organisation.component.html',
  styleUrl: './organisation.component.scss'
})
export class OrganisationComponent implements OnInit {
    readonly #authService = inject(AuthenticationService);
    protected tabs: INavigationTab[] = [
        {
            label: "DETAIL.NAME_PLURAL",
            routeLink: "details",
            icon: "fa-solid fa-circle-info",
            isVisible: () => this.hasViewAccess()
        },
        {
            label: "COMPANY.NAME_PLURAL",
            routeLink: "companies",
            icon: "fa-solid fa-building",
            isVisible: () => this.hasViewAccess()
        },
        {
            label: "JOB_TITLE.NAME_PLURAL",
            routeLink: "job-titles",
            icon: "fa-solid fa-table-list",
            isVisible: () => this.hasViewAccess()
        },
        {
            label: "ROLE.NAME_PLURAL",
            routeLink: "roles",
            icon: "fa-solid fa-user-check",
            isVisible: () => this.hasViewAccess()
        },
        {
            label: "SETTINGS.NAME_PLURAL",
            routeLink: "settings",
            icon: "fa-solid fa-cog",
            isVisible: () => this.hasEditAccess()
        }
    ];

    rightsData!: ISourceLevelRights;
    isLoading = false;

    ngOnInit() {
        this.isLoading = true;
        this.#authService.getRights(SourceLevel.Organisation, this.#authService.getOrganisationId())
            .subscribe((rights) => {
            this.rightsData = rights;
            this.isLoading = false;
        });
    }

    onRouterOutletActivate(childComponent: any) {
        if (!instanceOfRightsListener(childComponent)) return;
        (childComponent as IRightsListener).setRightsData(this.rightsData);
    }

    hasViewAccess(): boolean {
        return this.rightsData.hasViewRights || this.rightsData.hasPureViewRights || this.hasEditAccess();
    }

    hasEditAccess(): boolean {
        return this.rightsData.hasEditRights || this.rightsData.hasAdministratorRights;
    }
}
