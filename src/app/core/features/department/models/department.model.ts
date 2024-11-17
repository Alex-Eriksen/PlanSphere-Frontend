import { IAddress } from "../../address/models/address.model";
import { IDepartmentSettings } from "./department-settings.model";

export interface IDepartment {
    id: number;
    name: string;
    description: string;
    building: string;
    address: IAddress;
    inheritAddress: boolean;
    settings: IDepartmentSettings;
}
