import { Component } from '@angular/core';
import { ListJobTitlesComponent } from "../../../../shared/list-job-titles/list-job-titles.component";
import { SourceLevel } from "../../../../core/enums/source-level.enum";

@Component({
  selector: 'ps-frontpage',
  standalone: true,
    imports: [
        ListJobTitlesComponent
    ],
  templateUrl: './frontpage.component.html',
  styleUrl: './frontpage.component.scss'
})
export class FrontpageComponent {

    protected readonly SourceLevel = SourceLevel;
}
