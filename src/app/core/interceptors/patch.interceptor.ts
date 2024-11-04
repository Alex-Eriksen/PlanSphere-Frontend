import { HttpInterceptorFn } from "@angular/common/http";
import { addPatchJsonParser } from "../../shared/utilities/form.utilities";

export const patchRequestInterceptor: HttpInterceptorFn = (req, next) => {
    if (req.method === "PATCH") {
        const newReq = req.clone({
            headers: req.headers
                .set("Content-Type", "application/json-patch+json"),
            body: addPatchJsonParser(req.body),
        });
        return next(newReq);
    }
    return next(req);
};
