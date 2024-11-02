import { Component, DestroyRef, inject, OnInit, output } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { INavigationTab } from "../navigation-tabs/navigation-tab.interface";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatListItem, MatNavList } from "@angular/material/list";
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { NgClass, NgOptimizedImage } from "@angular/common";
import { SidebarItemComponent } from "./components/sidebar-item/sidebar-item.component";
import { ISideNavToggle } from "./side-nav-toggle.interface";
import { LOCAL_STORAGE_KEYS } from "../constants/local-storage.constants";
import { AuthenticationService } from "../../core/features/authentication/services/authentication.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ILoggedInUser } from "../../core/features/authentication/models/logged-in-user.model";
import { AdminRoleNames } from "../constants/admin-role-name.constants";
import { ButtonComponent } from "../button/button.component";
import { UserNavComponent } from "./components/user-nav/user-nav.component";
import { DialogService } from "../../core/services/dialog.service";
import { finalize } from "rxjs";

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
        SidebarItemComponent,
        ButtonComponent,
        UserNavComponent
    ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {
    screenWidth: number = window.innerWidth;
    collapsed = true;
    toggleSideNav = output<ISideNavToggle>();
    loggedInUserData: ILoggedInUser | null = null;
    readonly #destroyRef = inject(DestroyRef);
    readonly #authService = inject(AuthenticationService);
    readonly #router = inject(Router);
    readonly #dialogService = inject(DialogService);
    navigations: INavigationTab[] = [
        {
            label: "FRONTPAGE",
            routeLink: "frontpage",
            icon: "fa-solid fa-house"
        },
        {
            label: "ORGANISATION.NAME",
            routeLink: "organisation",
            icon: "fa-solid fa-sitemap",
        },
        {
            label: "ORGANISATION.NAME_PLURAL",
            routeLink: "organisations",
            icon: "fa-solid fa-sitemap",
            isVisible: () => this.loggedInUserData?.roles.find(x => x.name === AdminRoleNames.SystemAdministrator) !== undefined
        },
        {
            label: "COMPANY.NAME",
            routeLink: "company",
            icon: "fa-solid fa-building"
        },
        {
            label: "COMPANY.NAME_PLURAL",
            routeLink: "companies",
            icon: "fa-solid fa-building"
        },
        {
            label: "DEPARTMENT.NAME",
            routeLink: "department",
            icon: "fa-solid fa-building-user"
        },
        {
            label: "DEPARTMENT.NAME_PLURAL",
            routeLink: "departments",
            icon: "fa-solid fa-building-user"
        },
        {
            label: "TEAM.NAME",
            routeLink: "team",
            icon: "fa-solid fa-people-group"
        },
        {
            label: "TEAM.NAME_PLURAL",
            routeLink: "teams",
            icon: "fa-solid fa-people-group"
        },
    ];

    ngOnInit() {
        this.#authService.LoggedInUserObservable.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe({
            next: data => {
                this.loggedInUserData = data;
            }
        });

        this.collapsed = localStorage.getItem(LOCAL_STORAGE_KEYS.SideNavState) == "true";
        this.toggleSideNav.emit({screenWidth: this.screenWidth, collapsed: this.collapsed});
    }

    toggleCollapse() {
        this.collapsed = !this.collapsed;
        this.toggleSideNav.emit({screenWidth: this.screenWidth, collapsed: this.collapsed});
        localStorage.setItem(LOCAL_STORAGE_KEYS.SideNavState, this.collapsed.toString());
    }

    confirmLogOut() {
        this.#dialogService.open({
            title: "LOGOUT",
            callBack: () => this.logOut(),
            submitLabel: "LOGOUT",
            isInputIncluded: false,
            descriptions: ["LOGOUT_CONFIRMATION"],
            cancelLabel: "CANCEL"
        }, "confirmation");
    }

    logOut() {
        this.#authService.revokeRefreshToken().pipe(finalize(() => {
            this.#dialogService.close();
        })).subscribe({
            next: () => this.#router.navigate(['/sign-in'], { queryParams: { returnUrl: this.#router.routerState.snapshot.url } })
        });
    }

    isTabVisible(tab: INavigationTab): boolean {
        // v DO NOT DELETE COMMENT
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return tab.isVisible ? tab.isVisible() : true;
    }
}
