import { SourceLevel } from "../../../core/enums/source-level.enum";

export interface IUserPopupInputs {
    sourceLevel: SourceLevel;
    sourceLevelId: number;
    userId: number;
    isEditPopup: boolean;
}
