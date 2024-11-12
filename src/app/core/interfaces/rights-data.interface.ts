import { ISourceLevelRights } from "../features/authentication/models/source-level-rights.model";

export interface IRightsListener {
    setRightsData(rights: ISourceLevelRights): void;
}
