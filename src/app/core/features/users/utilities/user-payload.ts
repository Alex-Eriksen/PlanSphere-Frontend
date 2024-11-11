import { IAddress } from "../../address/models/address.model";
import { IUserSettings } from "../models/user-settings.model";

export interface IUserPayload {
    firstName: string;
    lastName: string;
    email: string;
    address: IAddress;
    phoneNumber: string;
    birthday: string;
    settings: IUserSettings;
    profilePictureUrl: string;
}
