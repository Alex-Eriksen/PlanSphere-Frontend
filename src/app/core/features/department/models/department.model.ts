import { IAddress } from "../../address/models/address.model";

export interface IDepartment {
    id: number;
    name: string;
    description: string;
    building: string;
    address: IAddress;
}
