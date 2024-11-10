import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { NavigationTabsComponent } from "../../../../shared/navigation-tabs/navigation-tabs.component";
import { INavigationTab } from "../../../../shared/navigation-tabs/navigation-tab.interface";

@Component({
    selector: 'ps-company',
    standalone: true,
    imports: [
        RouterOutlet,
        NavigationTabsComponent
    ],
    templateUrl: './department.component.html',
    styleUrl: './department.component.scss'
})
export class DepartmentComponent {
    tabs: INavigationTab[] = [
        {
            label: "DETAIL.NAME_PLURAL",
            routeLink: "details",
            icon: "fa-solid fa-circle-info"
        },
        {
          label: "TEAM.NAME_PLURAL",
          routeLink: "teams",
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
    ]
}
