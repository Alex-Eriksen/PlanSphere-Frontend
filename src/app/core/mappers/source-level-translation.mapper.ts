import { SourceLevel } from "../enums/source-level.enum";

export const SourceLevelTranslationMapper = new Map<SourceLevel, string>([
    [SourceLevel.Organisation, "ORGANISATION.NAME"],
    [SourceLevel.Company, "COMPANY.NAME"],
    [SourceLevel.Department, "DEPARTMENT.NAME"],
    [SourceLevel.Team, "TEAM.NAME"],
]);
