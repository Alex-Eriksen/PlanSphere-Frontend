import { IWorkSchedule } from "../models/work-schedule.model";
import { FormArray, FormGroup, NonNullableFormBuilder } from "@angular/forms";
import { IWorkScheduleShift } from "../models/work-schedule-shift.model";
import { WeekDay } from "@angular/common";
import { ShiftLocation } from "../../../enums/shift-location.enum";

export const recursivelyFindParentWorkSchedule = (workSchedule: IWorkSchedule): IWorkSchedule => {
    if (workSchedule.parent != null) return recursivelyFindParentWorkSchedule(workSchedule.parent);
    return workSchedule;
}

export const constructWorkScheduleFormGroup = (fb: NonNullableFormBuilder, workSchedule?: IWorkSchedule): FormGroup => {
    return fb.group({
        id: fb.control({ value: workSchedule?.id ?? 0, disabled: true }),
        isDefaultWorkSchedule: fb.control({ value: workSchedule?.isDefaultWorkSchedule ?? false, disabled: true }),
        workScheduleShifts: constructWorkScheduleShiftFormArray(fb, workSchedule?.workScheduleShifts ?? [])
    });
};

const constructWorkScheduleShiftFormGroup = (fb: NonNullableFormBuilder, workScheduleShift?: IWorkScheduleShift): FormGroup => {
    return fb.group({
        id: fb.control({ value: workScheduleShift?.id ?? 0, disabled: true }),
        startTime: fb.control<Date | null>(workScheduleShift?.startTime ?? null, { updateOn: "change" }),
        endTime: fb.control<Date | null>(workScheduleShift?.endTime ?? null, { updateOn: "change" }),
        day: fb.control<WeekDay | null>(workScheduleShift?.day ?? WeekDay.Monday),
        location: fb.control<ShiftLocation | null>(workScheduleShift?.location ?? null, { updateOn: "change" }),
    });
};

const constructWorkScheduleShiftFormArray = (fb: NonNullableFormBuilder, workScheduleShifts?: IWorkScheduleShift[]): FormArray => {
    const array = fb.array<FormGroup>([]);
    workScheduleShifts?.forEach((workScheduleShift) => array.push(constructWorkScheduleShiftFormGroup(fb, workScheduleShift)));
    return array;
}
