import { SourceLevel } from "../../../../core/enums/source-level.enum";

export interface IJobTitlePopupInputs {
    jobTitleId?: number;
    sourceLevel: SourceLevel;
    sourceLevelId: number;
    isEditPopup: boolean;
}
