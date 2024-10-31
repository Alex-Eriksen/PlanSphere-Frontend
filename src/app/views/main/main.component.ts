import { Component } from '@angular/core';
import {RouterOutlet} from "@angular/router";
import { SidebarComponent } from "../../shared/sidebar/sidebar.component";
import { ISideNavToggle } from "../../shared/sidebar/side-nav-toggle.interface";
import { NgClass } from "@angular/common";
import { BreadcrumbComponent } from "../../shared/breadcrumb/breadcrumb.component";

@Component({
  selector: 'ps-main',
  standalone: true,
    imports: [
        RouterOutlet,
        SidebarComponent,
        NgClass,
        BreadcrumbComponent
    ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
    isSideNavCollapsed: boolean = true;
    screenWidth: number = 0;

    onToggleSideNav(data: ISideNavToggle){
        this.isSideNavCollapsed = data.collapsed;
        this.screenWidth = data.screenWidth;
    }
}
