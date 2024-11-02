import { inject, Pipe, PipeTransform } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

@Pipe({
    name: "partialTranslate",
    standalone: true,
    pure: false,
})
export class PartialTranslatePipe implements PipeTransform {
    translateService = inject(TranslateService);

    transform(value: string, translateKey: string): string;
    transform(value: string, translateKey: string[]): string;

    transform(value: string, translateKey: string[] | string): string {
        let newValue = value;
        if (Array.isArray(translateKey)) {
            translateKey.forEach((key) => {
                newValue = newValue.replace(key, this.translateService.instant(key));
            });
        } else {
            newValue = newValue.replace(translateKey, this.translateService.instant(translateKey));
        }
        return newValue;
    }
}
