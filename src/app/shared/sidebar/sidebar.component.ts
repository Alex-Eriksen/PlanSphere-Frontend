import { Component, DestroyRef, inject, OnInit, output } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { INavigationTab, ISidebarNavigationTab } from "../navigation-tabs/navigation-tab.interface";
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
import { SourceLevel } from "../../core/enums/source-level.enum";
import { Right } from "../../core/enums/right.enum";

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
    navigations: ISidebarNavigationTab[] = [
        {
            label: "FRONTPAGE",
            routeLink: "frontpage",
            routeLinkFn: () => "frontpage",
            icon: "fa-solid fa-house"
        },
        {
            label: "ORGANISATION.NAME",
            routeLink: "organisation",
            routeLinkFn: () => `organisation/${this.#getSingleOrganisationId()}`,
            icon: "fa-solid fa-sitemap",
            isVisible: () => this.#hasOrganisationViewAccess()
        },
        {
            label: "ORGANISATION.NAME_PLURAL",
            routeLink: "organisations",
            routeLinkFn: () => `organisations`,
            icon: "fa-solid fa-sitemap",
            isVisible: () => this.loggedInUserData?.roles.find(x => x.name === AdminRoleNames.SystemAdministrator) !== undefined
        },
        {
            label: "COMPANY.NAME",
            routeLink: "company",
            routeLinkFn: () => `company/${this.#getSingleCompanyId()}`,
            icon: "fa-solid fa-building",
            isVisible: () => this.#canSeeOneCompany()
        },
        {
            label: "COMPANY.NAME_PLURAL",
            routeLink: "companies",
            routeLinkFn: () => "companies",
            icon: "fa-solid fa-building",
            isVisible: () => this.#canSeeMultipleCompanies()
        },
        {
            label: "DEPARTMENT.NAME",
            routeLink: "department",
            routeLinkFn: () => `department/${this.#getSingleDepartmentId()}`,
            icon: "fa-solid fa-building-user",
            isVisible: () => this.#canSeeOneDepartment()
        },
        {
            label: "DEPARTMENT.NAME_PLURAL",
            routeLink: "departments",
            routeLinkFn: () => "departments",
            icon: "fa-solid fa-building-user",
            isVisible: () => this.#canSeeMultipleDepartments()
        },
        {
            label: "TEAM.NAME",
            routeLink: "team",
            routeLinkFn: () => `team/${this.#getSingleTeamId()}`,
            icon: "fa-solid fa-people-group",
            isVisible: () => this.#canSeeOneTeam()
        },
        {
            label: "TEAM.NAME_PLURAL",
            routeLink: "teams",
            routeLinkFn: () => "teams",
            icon: "fa-solid fa-people-group",
            isVisible: () => this.#canSeeMultipleTeams()
        },
    ];
    isLoading: boolean = false;

    ngOnInit() {
        this.isLoading = true;
        this.#authService.LoggedInUserObservable
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe((data) => {
                if (data === null) return;
                this.loggedInUserData = data;
                this.isLoading = false;
            }
        );

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

    #canSeeMultipleCompanies(): boolean {
        const hasAccessThroughOrganisation = this.#hasOrganisationViewAccess();
        if (hasAccessThroughOrganisation) return true;
        return this.loggedInUserData!.roles.filter(x => x.rights.find(y => y.sourceLevel === SourceLevel.Company && (y.rightId as Right) <= Right.View)).length > 1;
    }

    #canSeeMultipleDepartments(): boolean {
        const hasAccessThroughOrganisation = this.#hasOrganisationViewAccess();
        if (hasAccessThroughOrganisation) return true;

        const hasAccessThroughCompany = this.#hasCompanyViewAccess();
        if (hasAccessThroughCompany) return true;

        return this.loggedInUserData!.roles.filter(x => x.rights.find(y => y.sourceLevel === SourceLevel.Department  && (y.rightId as Right) <= Right.View)).length > 1;
    }

    #canSeeMultipleTeams(): boolean {
        const hasAccessThroughOrganisation = this.#hasOrganisationViewAccess();
        if (hasAccessThroughOrganisation) return true;

        const hasAccessThroughCompany = this.#hasCompanyViewAccess();
        if (hasAccessThroughCompany) return true;

        const hasAccessThroughDepartment = this.#hasDepartmentViewAccess();
        if (hasAccessThroughDepartment) return true;

        return this.loggedInUserData!.roles.filter(x => x.rights.find(y => y.sourceLevel === SourceLevel.Team  && (y.rightId as Right) <= Right.View)).length > 1;
    }

    #canSeeOneCompany(): boolean {
        if (this.#canSeeMultipleCompanies()) return false;
        return this.loggedInUserData!.roles.filter(x => x.rights.find(y => y.sourceLevel === SourceLevel.Company && (y.rightId as Right) <= Right.View)).length === 1;
    }

    #canSeeOneDepartment(): boolean {
        if (this.#canSeeMultipleCompanies()) return false;
        return this.loggedInUserData!.roles.filter(x => x.rights.find(y => y.sourceLevel === SourceLevel.Department && (y.rightId as Right) <= Right.View)).length === 1;
    }

    #canSeeOneTeam(): boolean {
        if (this.#canSeeMultipleTeams()) return false;
        return this.loggedInUserData!.roles.filter(x => x.rights.find(y => y.sourceLevel === SourceLevel.Team && (y.rightId as Right) <= Right.View)).length === 1;
    }

    #getSingleOrganisationId(): number {
        return this.loggedInUserData!.roles.find(x => x.rights.some(y => y.sourceLevel === SourceLevel.Organisation && (y.rightId as Right) <= Right.View))!.rights.find(y => y.sourceLevel === SourceLevel.Organisation && (y.rightId as Right) <= Right.View)!.sourceLevelId;
    }

    #getSingleCompanyId(): number {
        return this.loggedInUserData!.roles.find(x => x.rights.some(y => y.sourceLevel === SourceLevel.Company && (y.rightId as Right) <= Right.View))!.rights.find(y => y.sourceLevel === SourceLevel.Company && (y.rightId as Right) <= Right.View)!.sourceLevelId;
    }

    #getSingleDepartmentId(): number {
        return this.loggedInUserData!.roles.find(x => x.rights.some(y => y.sourceLevel === SourceLevel.Department && (y.rightId as Right) <= Right.View))!.rights.find(y => y.sourceLevel === SourceLevel.Department && (y.rightId as Right) <= Right.View)!.sourceLevelId;
    }

    #getSingleTeamId(): number {
        return this.loggedInUserData!.roles.find(x => x.rights.some(y => y.sourceLevel === SourceLevel.Team && (y.rightId as Right) <= Right.View))!.rights.find(y => y.sourceLevel === SourceLevel.Team && (y.rightId as Right) <= Right.View)!.sourceLevelId;
    }

    #hasOrganisationViewAccess(): boolean {
        return this.loggedInUserData?.roles.find(x => x.rights.find(y => y.sourceLevel === SourceLevel.Organisation && (y.rightId as Right) <= Right.View)) !== undefined;
    }

    #hasCompanyViewAccess(): boolean {
        return this.loggedInUserData?.roles.find(x => x.rights.find(y => y.sourceLevel === SourceLevel.Company && (y.rightId as Right) <= Right.View)) !== undefined;
    }

    #hasDepartmentViewAccess(): boolean {
        return this.loggedInUserData?.roles.find(x => x.rights.find(y => y.sourceLevel === SourceLevel.Department && (y.rightId as Right) <= Right.View)) !== undefined;
    }
}
