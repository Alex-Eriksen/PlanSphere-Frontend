import { HttpEventType, HttpInterceptorFn } from "@angular/common/http";
import { map } from "rxjs";

export const dateConversionInterceptor: HttpInterceptorFn = (req, next) => {
    const isIsoDateString = (value: any): boolean => {
        return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,})?Z?$/.test(value);
    };

    const convertToDates = (body: any): any => {
        if (body === null || body === undefined) {
            return body;
        }

        if (Array.isArray(body)) {
            return body.map(item => convertToDates(item));
        }

        if (typeof body === 'object') {
            for (const key of Object.keys(body)) {
                const value = body[key];
                if (isIsoDateString(value)) {
                    body[key] = new Date(value);
                } else if (typeof value === 'object') {
                    body[key] = convertToDates(value);
                }
            }
        }

        return body;
    };

    return next(req).pipe(
        map(event => {
            if (event.type === HttpEventType.Response && event.body) {
                return event.clone({
                    body: convertToDates(event.body),
                });
            }
            return event;
        })
    );
};
