import { IAddress } from "../../address/models/address.model";
import { ITeamSettings } from "./team-settings.model";

export interface ITeam {
    id: number;
    name: string;
    description: string;
    identifier: string;
    inheritAddress: boolean;
    address: IAddress;
    settings: ITeamSettings;
}
