import { Component } from "@angular/core";
import { SmallHeaderComponent } from "../../../../../../shared/small-header/small-header.component";
import { SubHeaderComponent } from "../../../../../../shared/sub-header/sub-header.component";

@Component({
  selector: 'ps-job-titles',
  standalone: true,
    imports: [
        SmallHeaderComponent,
        SubHeaderComponent
    ],
  templateUrl: './job-titles.component.html',
  styleUrl: './job-titles.component.scss'
})
export class JobTitlesComponent {
}
