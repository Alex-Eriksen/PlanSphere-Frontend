import { Component, inject, input, OnInit } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { NavigationTabsComponent } from "../../../../shared/navigation-tabs/navigation-tabs.component";
import { INavigationTab } from "../../../../shared/navigation-tabs/navigation-tab.interface";
import { AuthenticationService } from "../../../../core/features/authentication/services/authentication.service";
import { LoadingOverlayComponent } from "../../../../shared/loading-overlay/loading-overlay.component";
import { instanceOfRightsListener } from "../../../../core/interfaces/rights-data.interface";
import { ISourceLevelRights } from "../../../../core/features/authentication/models/source-level-rights.model";
import { SourceLevel } from "../../../../core/enums/source-level.enum";

@Component({
    selector: 'ps-company',
    standalone: true,
    imports: [
        RouterOutlet,
        NavigationTabsComponent,
        LoadingOverlayComponent
    ],
    templateUrl: './department.component.html',
    styleUrl: './department.component.scss'
})
export class DepartmentComponent implements OnInit {
    readonly #authService = inject(AuthenticationService);
    departmentId = input.required<number>();
    rightsData!: ISourceLevelRights;
    isPageLoading = false;
    tabs: INavigationTab[] = [
        {
            label: "DETAIL.NAME_PLURAL",
            routeLink: "details",
            icon: "fa-solid fa-circle-info",
            isVisible: () => this.hasViewAccess()
        },
        {
          label: "TEAM.NAME_PLURAL",
          routeLink: "teams",
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
            isVisible: () => this.hasEditAccess()
        }
    ]

    ngOnInit() {
        this.isPageLoading = true;
        this.#authService.getRights(SourceLevel.Department, this.departmentId()).subscribe((data) => {
            this.rightsData = data;
            this.isPageLoading = false;
        });
    }

    onRouterOutletActivate(activatedComponent: any) {
        if (!instanceOfRightsListener(activatedComponent)) return;
        activatedComponent.setRightsData(this.rightsData);
    }

    hasViewAccess(): boolean {
        return this.rightsData.hasViewRights || this.rightsData.hasPureViewRights || this.hasEditAccess();
    }

    hasEditAccess(): boolean {
        return this.rightsData.hasEditRights || this.rightsData.hasAdministratorRights;
    }
}
