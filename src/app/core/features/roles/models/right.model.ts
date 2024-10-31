import { SourceLevel } from "../../../enums/source-level.enum";

export interface IRight {
    name: string;
    description: string;

    sourceLevel: SourceLevel;
    sourceLevelId: number;
}
