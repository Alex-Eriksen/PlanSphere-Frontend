import { SourceLevel } from "../../../enums/source-level.enum";
import { IBase } from "../../../abstract/models/base.model";

export interface IRoleListItem extends IBase {
    name: string;
    rights: number;
    createdAt: Date;
    createdBy: string;
    isInheritanceActive: boolean;
    isDefaultRole: boolean;
    sourceLevel: SourceLevel;
}
