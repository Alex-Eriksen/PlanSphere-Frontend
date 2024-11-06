import { Component, input } from "@angular/core";
import { IWorkScheduleShift } from "../../../../core/features/workSchedules/models/work-schedule-shift.model";

@Component({
  selector: 'ps-work-schedule-shift',
  standalone: true,
  imports: [],
  templateUrl: './work-schedule-shift.component.html',
  styleUrl: './work-schedule-shift.component.scss'
})
export class WorkScheduleShiftComponent {
    workScheduleShift = input.required<IWorkScheduleShift>();
}
