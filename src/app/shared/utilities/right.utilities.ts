import { ISourceLevelRights } from "../../core/features/authentication/models/source-level-rights.model";

export const hasViewAccess = (rightsData: ISourceLevelRights): boolean => {
    return rightsData.hasViewRights || rightsData.hasPureViewRights || hasEditAccess(rightsData);
}

export const hasEditAccess = (rightsData: ISourceLevelRights): boolean => {
    return  rightsData.hasEditRights ||  rightsData.hasAdministratorRights;
}

export const hasManageUsersRights = (rightsData: ISourceLevelRights): boolean => {
    return  rightsData.hasManageUsersRights ||  rightsData.hasAdministratorRights;
}
