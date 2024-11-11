import { Component } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { NavigationTabsComponent } from "../../../../shared/navigation-tabs/navigation-tabs.component";
import { INavigationTab } from "../../../../shared/navigation-tabs/navigation-tab.interface";

@Component({
  selector: 'ps-organisation',
  standalone: true,
    imports: [
        RouterOutlet,
        NavigationTabsComponent
    ],
  templateUrl: './organisation.component.html',
  styleUrl: './organisation.component.scss'
})
export class OrganisationComponent {
    protected tabs: INavigationTab[] = [
        {
            label: "DETAIL.NAME_PLURAL",
            routeLink: "details",
            icon: "fa-solid fa-circle-info"
        },
        {
            label: "COMPANY.NAME_PLURAL",
            routeLink: "companies",
            icon: "fa-solid fa-building"
        },
        {
            label: "JOB_TITLE.NAME_PLURAL",
            routeLink: "job-titles",
            icon: "fa-solid fa-table-list"
        },
        {
            label: "ROLE.NAME_PLURAL",
            routeLink: "roles",
            icon: "fa-solid fa-user-check"
        },
        {
            label: "USER.NAME_PLURAL",
            routeLink: "users",
            icon: "fa-solid fa-user-check"
        }
    ];
}
