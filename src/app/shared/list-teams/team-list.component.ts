import { Component, OnInit, input, inject } from "@angular/core";
import {
    BasePaginatedTableWithSearchComponent
} from "../base-paginated-table-with-search-abstract/base-paginated-table-with-search.abstract";
import { TeamService } from "../../core/features/team/services/team.service";

@Component({
  selector: 'ps-team-list.component',
  standalone: true,
  imports: [],
  templateUrl: './team-list.component.html',
  styleUrl: './team-list.component.scss'
})
export class TeamListComponent extends BasePaginatedTableWithSearchComponent implements OnInit{
    departmentId = input.required<number>()
    isUserTeams = input(false);
    readonly #teamService = inject(TeamService)
}
