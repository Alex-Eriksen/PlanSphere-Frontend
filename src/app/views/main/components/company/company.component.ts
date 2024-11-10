import { Component } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { INavigationTab } from "../../../../shared/navigation-tabs/navigation-tab.interface";
import { NavigationTabsComponent } from "../../../../shared/navigation-tabs/navigation-tabs.component";

@Component({
  selector: 'ps-company',
  standalone: true,
    imports: [
        RouterOutlet,
        NavigationTabsComponent
    ],
  templateUrl: './company.component.html',
  styleUrl: './company.component.scss'
})
export class CompanyComponent {
    tabs: INavigationTab[] = [
        {
            label: "DETAIL.NAME_PLURAL",
            routeLink: "details",
            icon: "fa-solid fa-circle-info"
        },
        {
            label: "DEPARTMENT.NAME_PLURAL",
            routeLink: "departments",
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
        }
    ];
}
