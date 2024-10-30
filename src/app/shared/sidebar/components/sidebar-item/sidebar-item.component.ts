import { Component, input } from "@angular/core";
import { INavigationTab } from "../../../interfaces/navigation-tab.interface";
import { TranslateModule } from "@ngx-translate/core";
import { RouterLink, RouterLinkActive } from "@angular/router";

@Component({
  selector: 'ps-sidebar-item',
  standalone: true,
    imports: [
        TranslateModule,
        RouterLink,
        RouterLinkActive
    ],
  templateUrl: './sidebar-item.component.html',
  styleUrl: './sidebar-item.component.scss'
})
export class SidebarItemComponent {
    navigation = input.required<INavigationTab>();
    collapsed = input.required<boolean>();
}
