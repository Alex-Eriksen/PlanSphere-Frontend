import { inject, Injectable } from "@angular/core";
import { DayInfo } from "../../shared/interfaces/day-info.interface";
import {
    getDayOfWeekFromDaysInMonth,
    getMonthDisplayName
} from "../../views/main/components/frontpage/calendar.utilities";
import { IWorkSchedule } from "../features/workSchedules/models/work-schedule.model";
import { DayInfoMonth } from "../../shared/enums/day-info-month.enum";
import { TranslateService } from "@ngx-translate/core";
import { IWorkTime } from "../features/workTimes/models/work-time.models";
import { DayOfWeek } from "../enums/day-of-week.enum";

@Injectable({
  providedIn: 'root'
})
export class CalendarDateService {
    readonly #translateService = inject(TranslateService);

    #daysInMonth: DayInfo[] = [];
    #currentSelectedDay: DayInfo | null = null;
    #currentDate: Date = new Date();
    #selectedDate: Date = new Date();
    #selectedWeek: number | null = null;
    #selectedMonth: number = new Date().getMonth();
    #workTimes: IWorkTime[] = [];

    setDaysInMonth(days: DayInfo[]) {
        this.#daysInMonth = days;
    }

    setCurrentSelectedDay(day: DayInfo) {
        this.#currentSelectedDay = day;
    }

    setSelectedWeek(week: number | null) {
        this.#selectedWeek = week;
    }

    setSelectedMonth(month: number) {
        this.#selectedMonth = month;
    }

    setSelectedDate(date: Date) {
        this.#selectedDate = date;
    }

    setWorkTimes(workTimes: IWorkTime[]) {
        this.#workTimes = workTimes;
    }

    isDateCurrentDate(day: DayInfo): boolean {
        return (
            day.isMonth === DayInfoMonth.Current &&
            day.date === this.#currentDate.getDate() &&
            this.#currentDate.getMonth() === this.#selectedDate.getMonth() &&
            this.#currentDate.getFullYear() === this.#selectedDate.getFullYear()
        );
    }

    isDateInMonthCurrentDate(dayName: string, weekNumber: number): boolean {
        const date = this.#getWeekDayInDaysInMonths(dayName, weekNumber);
        return date.date === this.#currentDate.getDate() && date.month === this.#currentDate.getMonth();
    }

    isDateInMonthSelected(dayName: string, weekNumber: number): boolean {
        const date = this.#getWeekDayInDaysInMonths(dayName, weekNumber);
        return date.date === this.#currentSelectedDay!.date && date.month === this.#currentSelectedDay!.month;
    }

    isSelectedDate(day: DayInfo): boolean {
        return day === this.#currentSelectedDay;
    }

    isSelectedDateOfWeek(dayName: string): boolean {
        const date = this.#getWeekDayInDaysInMonths(dayName, this.#currentSelectedDay!.weekNumber);
        return (
            this.#currentDate.getDate() === date.date &&
            this.#currentDate.getMonth() === date.month &&
            this.#currentDate.getFullYear() === this.#selectedDate.getFullYear()
        );
    }

    isSelectedDayCurrentDate(): boolean {
        return (
            this.#currentDate.getDate() === this.#currentSelectedDay!.date &&
            this.#currentDate.getMonth() === this.#currentSelectedDay!.month &&
            this.#currentDate.getFullYear() === this.#selectedDate.getFullYear()
        );
    }

    isPastDate(dayName: string, weekNumber: number): boolean {
        const date = this.#getWeekDayInDaysInMonths(dayName, weekNumber);
        const newDate = new Date(this.#selectedDate.getFullYear(), date.month, date.date, 23, 59);
        return this.#currentDate > newDate;
    }

    isFirstInWeek(day: DayInfo): boolean {
        const firstDayInWeek = this.#daysInMonth.find(d => d?.weekNumber === day.weekNumber);
        return (
            day === firstDayInWeek &&
            this.#selectedMonth === this.#selectedDate.getMonth() &&
            day.weekNumber === this.#selectedWeek
        );
    }

    isLastInWeek(day: DayInfo): boolean {
        const lastDayInWeek = this.#daysInMonth.find(d => d?.weekNumber === day.weekNumber && d.name === DayOfWeek.Sunday);
        return day === lastDayInWeek;
    }

    getDayDate(): string {
        return this.#refactorDate(this.#currentSelectedDay!.date);
    }

    getWeekDate(dayName: string): string {
        return this.#refactorDate(this.#daysInMonth.find(x => x.name === dayName && x.weekNumber === this.#currentSelectedDay!.weekNumber)!.date);
    }

    getMonthDate(dayName: string, weekNumber: number): string {
        return this.#refactorDate(this.#daysInMonth.find(x => x.name === dayName && x.weekNumber === weekNumber)!.date);
    }

    formatDayHeader(): string {
        const day = this.getDayDate();
        const month = getMonthDisplayName(this.#selectedMonth);
        const year = this.#selectedDate.getFullYear();
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
        const month = getMonthDisplayName(this.#selectedMonth);
        const year = this.#selectedDate.getFullYear();
        return `${month} ${year}`;
    }

    getWorkTimeDuration(day: string, weekNumber: number): string {
        const dayOfWorkWeek = this.#daysInMonth.find(x => x.weekNumber === weekNumber && x.name === day);
        const currentWorkTime = this.#workTimes.find(x => x.startDateTime.getDate() === dayOfWorkWeek?.date && x.startDateTime.getMonth() === dayOfWorkWeek.month);
        if(currentWorkTime?.endDateTime === null) {
            return `${currentWorkTime.startDateTime} - ??`;
        }
        return `${currentWorkTime?.startDateTime.getHours()}.${this.#refactorDate(currentWorkTime!.startDateTime.getMinutes())} - ${currentWorkTime?.endDateTime?.getHours()}.${this.#refactorDate(currentWorkTime!.endDateTime?.getMinutes())}`;
    }

    getWorkTime(day: string, hour: number) {
        const dayOfWeek = this.#daysInMonth.find(x => x.weekNumber === this.#selectedWeek && x.month === this.#selectedMonth && x.name === day);
        return this.#workTimes.find(x =>
            x.startDateTime.getDate() === dayOfWeek?.date &&
            x.startDateTime.getMonth() === dayOfWeek.month &&
            x.startDateTime.getHours() <= hour &&
            ((x.endDateTime !== null && x.endDateTime!.getHours() >= hour) || (x.endDateTime === null && new Date().getHours() >= hour)));
    }

    getWorkTimeMonth(day: string, weekNumber: number)  {
        const dayOfWeek = this.#daysInMonth.find(x => x.weekNumber === weekNumber && x.month === this.#selectedMonth && x.name === day);
        return this.#workTimes.find(x =>
            x.startDateTime.getDate() === dayOfWeek?.date &&
            x.startDateTime.getMonth() === dayOfWeek.month);
    }

    isHourCheckedDay(hour: number, isFirstHalfHour: boolean): boolean {
        const currentWorkTimes = this.#workTimes.filter(
            x =>
                x.startDateTime.getDate() === this.#currentSelectedDay?.date &&
                x.startDateTime.getMonth() === this.#currentSelectedDay?.month
        );

        return currentWorkTimes.some(workTime =>
            this.#isHalfHourWithinWorkTime(workTime, hour, isFirstHalfHour)
        );
    }


    isHourCheckedWeek(day: string, hour: number, isFirstHalfHour: boolean): boolean {
        const dayOfWorkWeek = this.#daysInMonth.find(x => x.weekNumber === this.#selectedWeek && x.name === day);
        const currentWorkTime = this.#workTimes.find(
            x =>
                x.startDateTime.getDate() === dayOfWorkWeek?.date &&
                x.startDateTime.getMonth() === dayOfWorkWeek.month
        );

        return currentWorkTime ? this.#isHalfHourWithinWorkTime(currentWorkTime, hour, isFirstHalfHour) : false;
    }


    isHourCheckedMonth(day: string, weekNumber: number) {
        const dayOfWorkWeek = this.#daysInMonth.find(x => x.weekNumber === weekNumber && x.name === day);
        const currentWorkTime = this.#workTimes.find(x => x.startDateTime.getDate() === dayOfWorkWeek?.date && x.startDateTime.getMonth() === dayOfWorkWeek.month);
        return currentWorkTime !== undefined;
    }

    #isHalfHourWithinWorkTime(workTime: IWorkTime, hour: number, isFirstHalfHour: boolean): boolean {
        if (!workTime) return false;

        const startMinutes = isFirstHalfHour ? 0 : 30;
        const endMinutes = isFirstHalfHour ? 30 : 60;

        const halfHourStart = new Date(
            workTime.startDateTime.getFullYear(),
            workTime.startDateTime.getMonth(),
            workTime.startDateTime.getDate(),
            hour,
            startMinutes
        );

        const halfHourEnd = new Date(
            workTime.startDateTime.getFullYear(),
            workTime.startDateTime.getMonth(),
            workTime.startDateTime.getDate(),
            hour,
            endMinutes
        );

        return (
            halfHourStart >= workTime.startDateTime &&
            halfHourStart < (workTime.endDateTime || new Date()) &&
            halfHourEnd > workTime.startDateTime
        );
    }


    #getWeekBoundaries(startDay: DayOfWeek, endDay: DayOfWeek) {
        const firstDay = getDayOfWeekFromDaysInMonth(this.#daysInMonth, startDay, this.#selectedWeek!);
        const lastDay = getDayOfWeekFromDaysInMonth(this.#daysInMonth, endDay, this.#selectedWeek!);
        return { firstDay, lastDay };
    }

    #formatDateRange(firstDay: DayInfo, lastDay: DayInfo): string {
        const sameMonth = firstDay.month === lastDay.month;
        const year = this.#selectedDate.getFullYear();

        if (sameMonth) {
            return `${this.#refactorDate(firstDay.date)} - ${this.#refactorDate(lastDay.date)} ${this.#translate(getMonthDisplayName(firstDay.month))} ${year}`;
        }

        return `${this.#refactorDate(firstDay.date)} ${this.#translate(getMonthDisplayName(firstDay.month))} - ${this.#refactorDate(lastDay.date)} ${this.#translate(getMonthDisplayName(lastDay.month))} ${year}`;
    }

    #refactorDate(date: number): string {
        return date > 9 ? date.toString() : `0${date}`;
    }

    #getWeekDayInDaysInMonths(dayName: string, weekNumber: number): DayInfo {
        return this.#daysInMonth.find(x => x.name === dayName && x.weekNumber === weekNumber)!;
    }

    #translate(key: string): string {
        return this.#translateService.instant(key.toUpperCase());
    }

    hasCheckedIn(): boolean {
        const workTimes = this.getWorkTimesOnDate(this.#currentDate.getDate(), this.#currentDate.getMonth()!);
        if (workTimes === undefined || workTimes.length === 0) return false;

        return workTimes.find(x => x.endDateTime === null) !== undefined;
    }

    getWorkTimesOnDate(date: number, month: number): IWorkTime[] {
        return this.#workTimes.filter(x => x.startDateTime.getDate() === date && x.startDateTime.getMonth() === month);
    }
}
