import { Component, input } from "@angular/core";
import { INavigationTab } from "./navigation-tab.interface";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";

@Component({
  selector: 'ps-navigation-tabs',
  standalone: true,
    imports: [
        RouterLink,
        RouterLinkActive,
        TranslateModule
    ],
  templateUrl: './navigation-tabs.component.html',
  styleUrl: './navigation-tabs.component.scss'
})
export class NavigationTabsComponent {
    tabs = input.required({
        transform: (value: INavigationTab[]) =>
            value.map((tap: INavigationTab) => {
                return { ...tap, label: tap.label.toUpperCase()  };
            }),
    });
}
