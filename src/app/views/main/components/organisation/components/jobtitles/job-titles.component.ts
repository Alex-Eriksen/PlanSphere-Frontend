import { Component } from "@angular/core";
import { SmallHeaderComponent } from "../../../../../../shared/small-header/small-header.component";
import { SubHeaderComponent } from "../../../../../../shared/sub-header/sub-header.component";
import { ListJobTitlesComponent } from "../../../../../../shared/list-job-titles/list-job-titles.component";
import { SourceLevel } from "../../../../../../core/enums/source-level.enum";

@Component({
  selector: 'ps-job-titles',
  standalone: true,
    imports: [
        SmallHeaderComponent,
        SubHeaderComponent,
        ListJobTitlesComponent
    ],
  templateUrl: './job-titles.component.html',
  styleUrl: './job-titles.component.scss'
})
export class JobTitlesComponent {
    protected readonly SourceLevel = SourceLevel;
}
