import { Component, input, OnInit } from "@angular/core";
import { INavigationTab } from "../../../interfaces/navigation-tab.interface";
import { TranslateModule } from "@ngx-translate/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { NgClass } from "@angular/common";

@Component({
  selector: 'ps-sidebar-item',
  standalone: true,
    imports: [
        TranslateModule,
        RouterLink,
        RouterLinkActive,
        NgClass
    ],
  templateUrl: './sidebar-item.component.html',
  styleUrl: './sidebar-item.component.scss'
})
export class SidebarItemComponent implements OnInit{
    collapsed = input.required<boolean>();
    selfCollapsed = false;
    tab = input.required<INavigationTab>();
    parentPath = input<string>();

    routerLink: string = "";

    ngOnInit() {
        if (this.parentPath()) {
            this.routerLink = `${this.parentPath()}/${this.tab().routeLink}`;
            return;
        }

        this.routerLink = this.tab().routeLink;
    }

    toggleCollapse() {
        this.selfCollapsed = !this.selfCollapsed;
    }

    isTabVisible(): boolean {
        // v DO NOT DELETE COMMENT
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return this.tab().isVisible ? this.tab().isVisible() : true;
    }
}
