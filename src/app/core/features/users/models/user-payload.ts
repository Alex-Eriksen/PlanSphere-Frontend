import { IAddress } from "../../address/models/address.model";
import { IBase } from "../../../abstract/models/base.model";

export interface IUserPayload extends IBase {
    firstName: string;
    lastName: string;
    email: string;
    address: IAddress;
    phoneNumber: string;
    roleIds: number[];
}
