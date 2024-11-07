import { IAddress } from "../../address/models/address.model";

export interface IDepartmentRequest {
    id: number;
    name: string;
    description: string;
    building: string;
    address: IAddress;
}
