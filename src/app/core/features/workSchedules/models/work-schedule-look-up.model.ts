import { IBaseLookUp } from "../../../abstract/models/base-look.model";
import { SourceLevel } from "../../../enums/source-level.enum";

export interface IWorkScheduleLookUp extends IBaseLookUp {
    sourceLevel: SourceLevel;
}
