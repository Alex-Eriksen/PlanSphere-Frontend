import { IAddress } from "../../address/models/address.model";
import { IUserSettings } from "./user.settings.model";

export interface IUser {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    address: IAddress;
    phoneNumber: string;
    birthday: string;
    settings: IUserSettings;
}
