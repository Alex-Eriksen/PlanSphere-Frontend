import { inject, Injectable } from "@angular/core";
import { WorkScheduleRepository } from "../repositories/work-schedule.repository";
import { map, Observable } from "rxjs";
import { IDropdownOption } from "../../../../shared/interfaces/dropdown-option.interface";
import { TranslateService } from "@ngx-translate/core";
import { SourceLevelTranslationMapper } from "../../../mappers/source-level-translation.mapper";
import { SourceLevel } from "../../../enums/source-level.enum";
import { IWorkSchedule } from "../models/work-schedule.model";
import { convertToUTCTimeString } from "../../../../shared/utilities/date.utilities";

@Injectable({
    providedIn: 'root'
})
export class WorkScheduleService {
    readonly #workScheduleRepository = inject(WorkScheduleRepository);
    readonly #translateService = inject(TranslateService);

    lookUpWorkSchedules(): Observable<IDropdownOption[]> {
        return this.#workScheduleRepository.lookUpWorkSchedules()
            .pipe(map((values) => values.map(
                (value) => {
                    return {
                        label: value.value,
                        subLabel: this.#translateService.instant(SourceLevelTranslationMapper.get(value.sourceLevel as SourceLevel)!),
                        value: value.id
                    };
                })
            ));
    }

    getWorkScheduleById(workScheduleId: number): Observable<IWorkSchedule> {
        return this.#workScheduleRepository.getWorkScheduleById(workScheduleId);
    }

    updateWorkSchedule(sourceLevel: SourceLevel, sourceLevelId: number, workSchedule: IWorkSchedule, workScheduleId?: number): Observable<void> {
        workSchedule.workScheduleShifts.forEach(shift => {
            shift.startTime = convertToUTCTimeString(shift.startTime);
            shift.endTime = convertToUTCTimeString(shift.endTime);
        })

        return this.#workScheduleRepository.updateWorkSchedule(sourceLevel, sourceLevelId, workSchedule, workScheduleId);
    }
}
