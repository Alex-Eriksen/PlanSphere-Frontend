import { Component, input } from "@angular/core";
import { IRightsListener } from "../../../../../../core/interfaces/rights-data.interface";
import { ISourceLevelRights } from "../../../../../../core/features/authentication/models/source-level-rights.model";
import { SourceLevel } from "../../../../../../core/enums/source-level.enum";
import { ListJobTitlesComponent } from "../../../../../../shared/list-job-titles/list-job-titles.component";

@Component({
  selector: 'ps-job-titles',
  standalone: true,
    imports: [
        ListJobTitlesComponent
    ],
  templateUrl: './job-titles.component.html',
  styleUrl: './job-titles.component.scss'
})
export class JobTitlesComponent implements IRightsListener {
    companyId = input.required<number>();
    hasEditRights: boolean = false;

    setRightsData(rights: ISourceLevelRights) {
        this.hasEditRights = rights.hasAdministratorRights || rights.hasEditRights;
    }

    protected readonly SourceLevel = SourceLevel;
}
