import { ISourceLevel } from "../../../../shared/interfaces/source-level.interface";

export interface IJobTitle {
    id: number;
    name: string;
    isInheritanceActive: boolean;
    sourceLevel: ISourceLevel;
}
