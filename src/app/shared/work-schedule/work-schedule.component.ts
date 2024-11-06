import { Component, input } from "@angular/core";
import { FormGroup } from "@angular/forms";

@Component({
  selector: 'ps-work-schedule',
  standalone: true,
  imports: [],
  templateUrl: './work-schedule.component.html',
  styleUrl: './work-schedule.component.scss'
})
export class WorkScheduleComponent {
    formGroup = input.required<FormGroup>();
}
