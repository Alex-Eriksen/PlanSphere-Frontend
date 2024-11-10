import { SourceLevel } from "../../../../core/enums/source-level.enum";

export interface IRolePopupInputs {
    roleId?: number;
    sourceLevel: SourceLevel;
    sourceLevelId: number;
    isEditPopup: boolean;
}
