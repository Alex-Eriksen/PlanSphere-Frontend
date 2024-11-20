import { IBase } from "../../../abstract/models/base.model";
import { IUserSettings } from "./user-settings.model";
import { IAddress } from "../../address/models/address.model";

export interface IUser extends IBase {
    firstName: string;
    lastName: string;
    email: string;
    address: IAddress;
    phoneNumber: string;
    birthday: Date;
    roleIds: number[];
    jobTitleIds: number[];
    settings: IUserSettings;
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
}
