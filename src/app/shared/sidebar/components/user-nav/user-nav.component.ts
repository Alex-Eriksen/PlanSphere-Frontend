import { Component, input, output } from "@angular/core";
import { ILoggedInUser } from "../../../../core/features/authentication/models/logged-in-user.model";
import { NgClass } from "@angular/common";
import { MatMenu, MatMenuTrigger } from "@angular/material/menu";
import { ButtonComponent } from "../../../button/button.component";
import { TranslateModule } from "@ngx-translate/core";
import { RouterLink, RouterLinkActive } from "@angular/router";

@Component({
  selector: 'ps-user-nav',
  standalone: true,
    imports: [
        NgClass,
        MatMenuTrigger,
        MatMenu,
        ButtonComponent,
        TranslateModule,
        RouterLinkActive,
        RouterLink
    ],
  templateUrl: './user-nav.component.html',
  styleUrl: './user-nav.component.scss'
})
export class UserNavComponent {
    loggedInUserData = input.required<ILoggedInUser>();
    collapsed = input.required<boolean>();
    logOut = output();
}
