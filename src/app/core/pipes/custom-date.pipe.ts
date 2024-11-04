import { inject, Pipe, PipeTransform } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { formatDateToShortString, formatDateToTime } from "../../shared/utilities/date.utilities";

@Pipe({
  name: "customDate",
  standalone: true,
  pure: false,
})
export class CustomDatePipe implements PipeTransform {
  readonly #translateService = inject(TranslateService);

  transform(isoString: string, includeTime?: boolean): string {
    if (!isoString) {
      return "-";
    }
    const date = new Date(isoString);
    let formattedDate = formatDateToShortString(date);
    if (includeTime) {
      formattedDate += ` ${this.#translateService.instant("AT")} ${formatDateToTime(date)}`;
    }
    return formattedDate;
  }
}
