import { Component, input, OnInit } from "@angular/core";
import { ISidebarNavigationTab } from "../../../navigation-tabs/navigation-tab.interface";
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
    tab = input.required<ISidebarNavigationTab>();
    parentPath = input<string>();

    routerLink: string = "";

    ngOnInit() {
        if (this.parentPath()) {
            this.routerLink = `${this.parentPath()}/${this.tab().routeLinkFn()}`;
            return;
        }

        this.routerLink = this.tab().routeLinkFn();
    }
}
