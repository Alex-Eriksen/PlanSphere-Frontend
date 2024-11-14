import { Component, inject, input, OnInit, viewChild } from "@angular/core";
import { LoadingOverlayComponent } from "../../../../../../shared/loading-overlay/loading-overlay.component";
import { SmallHeaderComponent } from "../../../../../../shared/small-header/small-header.component";
import { ToggleInputComponent } from "../../../../../../shared/toggle-input/toggle-input.component";
import { TranslateModule } from "@ngx-translate/core";
import { WorkScheduleComponent } from "../../../../../../shared/work-schedule/work-schedule.component";
import { SourceLevel } from "../../../../../../core/enums/source-level.enum";
import { SourceLevelTranslationMapper } from "../../../../../../core/mappers/source-level-translation.mapper";
import { NonNullableFormBuilder } from "@angular/forms";
import { WorkScheduleService } from "../../../../../../core/features/workSchedules/services/work-schedule.service";
import { constructWorkScheduleFormGroup, recursivelyFindParentWorkSchedule } from "../../../../../../core/features/workSchedules/utilities/work-schedule.utilities";
import { IWorkSchedule } from "../../../../../../core/features/workSchedules/models/work-schedule.model";
import { updateNestedControlsPathAndValue } from "../../../../../../shared/utilities/form.utilities";
import { TeamService } from "../../../../../../core/features/team/services/team.service";
import { ITeam } from "../../../../../../core/features/team/models/team.model";

@Component({
  selector: 'ps-settings',
  standalone: true,
    imports: [
        LoadingOverlayComponent,
        SmallHeaderComponent,
        ToggleInputComponent,
        TranslateModule,
        WorkScheduleComponent
    ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit {
    teamId = input.required<number>();
    readonly #fb = inject(NonNullableFormBuilder);
    readonly #workScheduleService = inject(WorkScheduleService);
    readonly #teamService = inject(TeamService);
    isPageLoading = false;
    isUpdatingWorkSchedule = false;
    workScheduleFormGroup = constructWorkScheduleFormGroup(this.#fb);
    #workSchedule!: IWorkSchedule;
    formGroup = this.#fb.group({
        inheritDefaultWorkSchedule: this.#fb.control(false)
    });
    protected readonly SourceLevel = SourceLevel;
    protected readonly SourceLevelTranslationMapper = SourceLevelTranslationMapper;
    protected readonly workScheduleComponent = viewChild<WorkScheduleComponent>("workSchedule");

    ngOnInit() {
        this.isPageLoading = true;
        this.#getTeamById();
    }

    protected updateWorkSchedule(workSchedule: IWorkSchedule) {
        this.isUpdatingWorkSchedule = true;
        this.#workScheduleService.updateWorkSchedule(SourceLevel.Team, this.teamId(), workSchedule, workSchedule.id).subscribe(() => {
            this.isUpdatingWorkSchedule = false;
        });
    }

    protected onInheritToggled(value: boolean) {
        if (value) {
            this.isPageLoading = true;
            this.#teamService.patchTeams(this.teamId(), updateNestedControlsPathAndValue(this.formGroup))
                .subscribe(() => this.#getTeamById());
            return;
        }
        this.#teamService.patchTeams(this.teamId(), updateNestedControlsPathAndValue(this.formGroup)).subscribe();
        this.workScheduleFormGroup = constructWorkScheduleFormGroup(this.#fb, this.#workSchedule);
        this.workScheduleComponent()?.updateSelectedDays(this.#workSchedule.workScheduleShifts);
    }

    #getTeamById(){
        this.#teamService.getTeamById(this.teamId(), SourceLevel.Team, this.teamId())
            .subscribe((team: ITeam) => {
                this.#workSchedule = team.settings.defaultWorkSchedule;
                this.workScheduleFormGroup = constructWorkScheduleFormGroup(this.#fb, recursivelyFindParentWorkSchedule(team.settings.defaultWorkSchedule), team.settings.inheritDefaultWorkSchedule);
                this.formGroup.controls.inheritDefaultWorkSchedule.patchValue(team.settings.inheritDefaultWorkSchedule);
                this.isPageLoading = false;
            });
    }
}
