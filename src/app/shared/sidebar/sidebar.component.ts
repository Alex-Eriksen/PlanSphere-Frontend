import { Component, inject, OnInit, output } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { INavigationTab } from "../interfaces/navigation-tab.interface";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatListItem, MatNavList } from "@angular/material/list";
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { SIDEBAR_SIDEBAR_CONFIG } from "./sidebar-navigations.constants";
import { NgClass, NgOptimizedImage } from "@angular/common";
import { SidebarItemComponent } from "./components/sidebar-item/sidebar-item.component";
import { ISideNavToggle } from "./side-nav-toggle.interface";
import { LOCAL_STORAGE_KEYS } from "../constants/local-storage.constants";
import { AuthenticationService } from "../../core/features/authentication/services/authentication.service";

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
export class SidebarComponent implements OnInit {
    screenWidth: number = window.innerWidth;
    navigations: INavigationTab[] = SIDEBAR_SIDEBAR_CONFIG;
    collapsed = true;
    toggleSideNav = output<ISideNavToggle>();
    readonly #authService = inject(AuthenticationService);
    readonly #router = inject(Router);

    ngOnInit() {
        this.collapsed = localStorage.getItem(LOCAL_STORAGE_KEYS.SideNavState) == "true";
        this.toggleSideNav.emit({screenWidth: this.screenWidth, collapsed: this.collapsed});
    }

    toggleCollapse() {
        this.collapsed = !this.collapsed;
        this.toggleSideNav.emit({screenWidth: this.screenWidth, collapsed: this.collapsed});
        localStorage.setItem(LOCAL_STORAGE_KEYS.SideNavState, this.collapsed.toString());
    }

    logOut() {
        this.#authService.revokeRefreshToken().subscribe({
            next: () => this.#router.navigate(['/sign-in'], { queryParams: { returnUrl: this.#router.routerState.snapshot.url } })
        });
    }
}
