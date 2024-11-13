import { Component } from '@angular/core';
import { SmallHeaderComponent } from "../../../../../../shared/small-header/small-header.component";
import { IRightsListener } from "../../../../../../core/interfaces/rights-data.interface";
import { ISourceLevelRights } from '../../../../../../core/features/authentication/models/source-level-rights.model';

@Component({
    selector: "ps-details",
    standalone: true,
    imports: [
        SmallHeaderComponent
    ],
    templateUrl: "./details.component.html",
    styleUrl: "./details.component.scss"
})
export class DetailsComponent implements IRightsListener {
    setRightsData(rights: ISourceLevelRights): void {
        throw new Error('Method not implemented.');
    }
}
