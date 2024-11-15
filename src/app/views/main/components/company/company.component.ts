import { Component, inject, input, OnInit } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { INavigationTab } from "../../../../shared/navigation-tabs/navigation-tab.interface";
import { NavigationTabsComponent } from "../../../../shared/navigation-tabs/navigation-tabs.component";
import { AuthenticationService } from "../../../../core/features/authentication/services/authentication.service";
import { ISourceLevelRights } from "../../../../core/features/authentication/models/source-level-rights.model";
import { SourceLevel } from "../../../../core/enums/source-level.enum";
import { LoadingOverlayComponent } from "../../../../shared/loading-overlay/loading-overlay.component";
import { instanceOfRightsListener } from "../../../../core/interfaces/rights-data.interface";

@Component({
  selector: 'ps-company',
  standalone: true,
    imports: [
        RouterOutlet,
        NavigationTabsComponent,
        LoadingOverlayComponent
    ],
  templateUrl: './company.component.html',
  styleUrl: './company.component.scss'
})
export class CompanyComponent implements OnInit {
    companyId = input.required<number>();
    readonly #authService = inject(AuthenticationService);
    rightData!: ISourceLevelRights;
    isPageLoading = false;
    tabs: INavigationTab[] = [
        {
            label: "DETAIL.NAME_PLURAL",
            routeLink: "details",
            icon: "fa-solid fa-circle-info",
            isVisible: () => this.hasViewAccess()
        },
        {
            label: "DEPARTMENT.NAME_PLURAL",
            routeLink: "departments",
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
            label: "USER.NAME_PLURAL",
            routeLink: "users",
            icon: "fa-solid fa-user-check",
            isVisible: () => this.hasEditAccess()
        },
        {
            label: "SETTINGS.NAME_PLURAL",
            routeLink: "settings",
            isVisible: () => this.hasEditAccess()
        }
    ];

    ngOnInit(): void {
        this.isPageLoading = true;
        this.#authService.getRights(SourceLevel.Company, this.companyId())
            .subscribe((rights) => {
                this.rightData = rights;
                this.isPageLoading = false;
            });
    }

    onRouterOutletActivate(activatedComponent: any) {
        if (!instanceOfRightsListener(activatedComponent)) return;
        activatedComponent.setRightsData(this.rightData);
    }

    hasViewAccess(): boolean {
        return this.rightData.hasViewRights || this.rightData.hasPureViewRights || this.hasEditAccess();
    }

    hasEditAccess(): boolean {
        return this.rightData.hasEditRights || this.rightData.hasAdministratorRights;
    }
}
