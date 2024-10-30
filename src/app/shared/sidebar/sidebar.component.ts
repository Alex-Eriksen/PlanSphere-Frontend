import { Component, HostListener, output } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { INavigationTab } from "../interfaces/navigation-tab.interface";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatListItem, MatNavList } from "@angular/material/list";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { SIDEBAR_SIDEBAR_CONFIG } from "./sidebar-navigations.constants";
import { NgClass, NgOptimizedImage } from "@angular/common";
import { SidebarItemComponent } from "./components/sidebar-item/sidebar-item.component";
import { ISideNavToggle } from "./side-nav-toggle.interface";

@Component({
  selector: 'ps-sidebar',
  standalone: true,
    imports: [
        TranslateModule,
        MatNavList,
        MatListItem,
        RouterLink,
        RouterLinkActive,
        MatSidenavModule,
        NgOptimizedImage,
        NgClass,
        SidebarItemComponent
    ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
    screenWidth: number = window.innerWidth;
    navigations: INavigationTab[] = SIDEBAR_SIDEBAR_CONFIG;
    collapsed = true;
    toggleSideNav = output<ISideNavToggle>();

    toggleCollapse() {
        this.collapsed = !this.collapsed;
        this.toggleSideNav.emit({screenWidth: this.screenWidth, collapsed: this.collapsed});
    }

    @HostListener("window:resize", ["$event"])
    onResize() {
        this.screenWidth = window.innerWidth;
    }
}
