import { IWorkSchedule } from "../models/work-schedule.model";
import { FormArray, FormGroup, NonNullableFormBuilder } from "@angular/forms";
import { IWorkScheduleShift } from "../models/work-schedule-shift.model";
import { ShiftLocation } from "../../../enums/shift-location.enum";
import { DayOfWeek } from "../../../enums/day-of-week.enum";

export const recursivelyFindParentWorkSchedule = (workSchedule: IWorkSchedule): IWorkSchedule => {
    if (workSchedule.parent !== null) return recursivelyFindParentWorkSchedule(workSchedule.parent);
    return workSchedule;
}

export const constructWorkScheduleFormGroup = (fb: NonNullableFormBuilder, workSchedule?: IWorkSchedule, disabled?: boolean): FormGroup => {
    const fg = fb.group({
        id: fb.control({ value: workSchedule?.id ?? 0, disabled: true }),
        isDefaultWorkSchedule: fb.control({ value: workSchedule?.isDefaultWorkSchedule ?? false, disabled: true }),
        workScheduleShifts: constructWorkScheduleShiftFormArray(fb, workSchedule?.workScheduleShifts ?? [])
    });
    if (disabled) {
        fg.disable();
        return fg;
    }
    return fg;
};

export const constructWorkScheduleShiftFormGroup = (fb: NonNullableFormBuilder, workScheduleShift?: IWorkScheduleShift): FormGroup => {
    return fb.group({
        id: fb.control({ value: workScheduleShift?.id ?? 0, disabled: true }),
        startTime: fb.control<string | null>(workScheduleShift?.startTime ?? null, { updateOn: "change" }),
        endTime: fb.control<string | null>(workScheduleShift?.endTime ?? null, { updateOn: "change" }),
        day: fb.control<DayOfWeek | null>(workScheduleShift?.day ?? DayOfWeek.Monday),
        location: fb.control<ShiftLocation | null>(workScheduleShift?.location ?? null, { updateOn: "change" }),
    });
};

const constructWorkScheduleShiftFormArray = (fb: NonNullableFormBuilder, workScheduleShifts?: IWorkScheduleShift[]): FormArray => {
    const array = fb.array<FormGroup>([]);
    workScheduleShifts?.forEach((workScheduleShift) => array.push(constructWorkScheduleShiftFormGroup(fb, workScheduleShift)));
    return array;
}

export const sortWorkScheduleShifts = (workScheduleShifts: IWorkScheduleShift[]): IWorkScheduleShift[] => {
    return workScheduleShifts.sort((a, b) => Object.values(DayOfWeek).indexOf(a.day) - Object.values(DayOfWeek).indexOf(b.day));
}
