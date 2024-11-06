import { SourceLevel } from "../../../enums/source-level.enum";

export interface IRight {
    id?: number;
    rightId?: number;
    name: string;
    description: string;

    sourceLevel: SourceLevel;
    sourceLevelId: number;
}
