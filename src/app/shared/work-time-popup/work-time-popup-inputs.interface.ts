import { IWorkTime } from "../../core/features/workTimes/models/work-time.models";

export interface IWorkTimePopupInputs {
    currentWorkTime?: IWorkTime;
    workTimes: IWorkTime[];
    isEditPopup: boolean;
}
