import { Component } from '@angular/core';
import { NavigationTabsComponent } from "../../../../shared/navigation-tabs/navigation-tabs.component";
import { RouterOutlet } from "@angular/router";
import { INavigationTab } from "../../../../shared/navigation-tabs/navigation-tab.interface";

@Component({
  selector: 'ps-user',
  standalone: true,
    imports: [
        NavigationTabsComponent,
        RouterOutlet
    ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {
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
}
