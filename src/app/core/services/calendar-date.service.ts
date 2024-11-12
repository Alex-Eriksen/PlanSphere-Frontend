import { inject, Injectable } from "@angular/core";
import { DayInfo } from "../../shared/interfaces/day-info.interface";
import { BehaviorSubject } from "rxjs";
import {
    getDayOfWeekFromDaysInMonth,
    getMonthDisplayName
} from "../../views/main/components/frontpage/calendar.utilities";
import { DayOfWeek } from "../../shared/enums/day-of-week.enum";
import { IWorkSchedule } from "../features/workSchedules/models/work-schedule.model";
import { DayInfoMonth } from "../../shared/enums/day-info-month.enum";
import { TranslateService } from "@ngx-translate/core";

@Injectable({
  providedIn: 'root'
})
export class CalendarDateService {

    readonly #translateService = inject(TranslateService);

    #daysInMonth = new BehaviorSubject<DayInfo[]>([]);
    #currentSelectedDay = new BehaviorSubject<DayInfo | null>(null);
    #currentDate = new BehaviorSubject<Date>(new Date());
    #selectedDate = new BehaviorSubject<Date>(new Date());
    #selectedWeek = new BehaviorSubject<number | null>(null);
    #selectedMonth = new BehaviorSubject<number>(new Date().getMonth());

    daysInMonth$ = this.#daysInMonth.asObservable();
    currentSelectedDay$ = this.#currentSelectedDay.asObservable();
    currentDate$ = this.#currentDate.asObservable();
    selectedDate$ = this.#selectedDate.asObservable();
    selectedWeek$ = this.#selectedWeek.asObservable();
    selectedMonth$ = this.#selectedMonth.asObservable();

    setDaysInMonth(days: DayInfo[]) {
        this.#daysInMonth.next(days);
    }

    setCurrentSelectedDay(day: DayInfo) {
        this.#currentSelectedDay.next(day);
    }

    setSelectedWeek(week: number | null) {
        this.#selectedWeek.next(week);
    }

    setSelectedMonth(month: number) {
        this.#selectedMonth.next(month);
    }

    setSelectedDate(date: Date) {
        this.#selectedDate.next(date);
    }

    isDateCurrentDate(day: DayInfo): boolean {
        return (
            day.isMonth === DayInfoMonth.Current &&
            day.date === this.#currentDate.value.getDate() &&
            this.#currentDate.value.getMonth() === this.#selectedDate.value.getMonth() &&
            this.#currentDate.value.getFullYear() === this.#selectedDate.value.getFullYear());
    }

    isDateInMonthCurrentDate(dayName: string, weekNumber: number): boolean {
        const date = this.#getWeekDayInDaysInMonths(dayName, weekNumber);
        return date.date === this.#currentDate.value.getDate() && date.month === this.#currentDate.value.getMonth();
    }

    isDateInMonthSelected(dayName: string, weekNumber: number): boolean {
        const date = this.#getWeekDayInDaysInMonths(dayName, weekNumber);
        return date.date === this.#currentSelectedDay.value!.date &&  date.month === this.#currentSelectedDay.value!.month;
    }

    isSelectedDate(day: DayInfo): boolean {
        return day === this.#currentSelectedDay.getValue();
    }

    isSelectedDateOfWeek(dayName: string): boolean {
        const date = this.#getWeekDayInDaysInMonths(dayName, this.#currentSelectedDay.value!.weekNumber);
        return (
            this.#currentDate.value.getDate() === date.date &&
            this.#currentDate.value.getMonth() === date.month &&
            this.#currentDate.value.getFullYear() === this.#selectedDate.value.getFullYear()
        );
    }

    isSelectedDayCurrentDate(): boolean {
        return this.#currentDate.value.getDate() === this.#currentSelectedDay.value!.date && this.#currentDate.value.getMonth() === this.#currentSelectedDay.value!.month && this.#currentDate.value.getFullYear() === this.#selectedDate.value.getFullYear();
    }

    isPastDate(dayName: string, weekNumber: number): boolean {
        const date = this.#getWeekDayInDaysInMonths(dayName, weekNumber);
        const newDate = new Date(this.#selectedDate.getValue().getFullYear(), date.month, date.date, 0, 0, 0);
        return this.#currentDate.getValue() > newDate;
    }

    isFirstInWeek(day: DayInfo): boolean {
        const firstDayInWeek = this.#daysInMonth.value.find(day => day?.weekNumber === day.weekNumber);
        return day === firstDayInWeek && this.#selectedMonth.value === this.#selectedDate.value.getMonth() && day.weekNumber === this.#selectedWeek.value;
    }

    isLastInWeek(day: DayInfo): boolean {
        const lastDayInWeek = this.#daysInMonth.value.slice().reverse().find(day => day?.weekNumber === day.weekNumber);

        return day === lastDayInWeek && this.#selectedMonth.value === this.#selectedDate.value.getMonth() && day.weekNumber === this.#selectedWeek.value;
    }

    getDayDate(): string {
        return this.#refactorDate(this.#currentSelectedDay.value!.date);
    }

    getWeekDate(dayName: string): string {
        return this.#refactorDate(this.#daysInMonth.value.find(x => x.name === dayName && x.weekNumber === this.#currentSelectedDay.value!.weekNumber)!.date);
    }

    getMonthDate(dayName: string, weekNumber: number) {
        return this.#refactorDate(this.#daysInMonth.value.find(x => x.name === dayName && x.weekNumber === weekNumber)!.date);
    }

    formatDayHeader(): string {
        const day = this.getDayDate();
        const month = getMonthDisplayName(this.#selectedMonth.value!);
        const year = this.#selectedDate.value.getFullYear();
        return `${day} ${month} ${year}`;
    }

    formatWorkWeekHeader(workSchedule: IWorkSchedule): string {
        const workWeek = this.#getWeekBoundaries(
            workSchedule.workScheduleShifts[0].day,
            workSchedule.workScheduleShifts.at(-1)!.day
        );
        return this.#formatDateRange(workWeek.firstDay, workWeek.lastDay);
    }

    formatWeekHeader(): string {
        const week = this.#getWeekBoundaries(DayOfWeek.Monday, DayOfWeek.Sunday);
        return this.#formatDateRange(week.firstDay, week.lastDay);
    }

    formatMonthHeader(): string {
        const month = getMonthDisplayName(this.#selectedMonth.value!);
        const year = this.#selectedDate.value.getFullYear();
        return `${month} ${year}`;
    }

    #getWeekBoundaries(startDay: DayOfWeek, endDay: DayOfWeek) {
        const firstDay = getDayOfWeekFromDaysInMonth(this.#daysInMonth.value, startDay, this.#selectedWeek.value!);
        const lastDay = getDayOfWeekFromDaysInMonth(this.#daysInMonth.value, endDay, this.#selectedWeek.value!);
        return { firstDay, lastDay };
    }

    #formatDateRange(firstDay: DayInfo, lastDay: DayInfo): string {
        const sameMonth = firstDay.month === lastDay.month;
        const year = this.#selectedDate.value.getFullYear();

        if (sameMonth) {
            return `${this.#refactorDate(firstDay.date)}. - ${this.#refactorDate(lastDay.date)}. ${this.#translate(getMonthDisplayName(firstDay.month))} ${year}`;
        }

        return `${this.#refactorDate(firstDay.date)}. ${this.#translate(getMonthDisplayName(firstDay.month))} - ${this.#refactorDate(lastDay.date)}. ${this.#translate(getMonthDisplayName(lastDay.month))} ${year}`;
    }

    #refactorDate(date: number): string {
        if(date > 9) {
            return date.toString();
        }
        return `0${date}`;
    }


    #getWeekDayInDaysInMonths(dayName: string, weekNumber: number): DayInfo {
        return this.#daysInMonth.value.find(x => x.name === dayName && x.weekNumber === weekNumber)!;
    }

    #translate(key: string): string {
        return this.#translateService.instant(key.toUpperCase())
    }
}
