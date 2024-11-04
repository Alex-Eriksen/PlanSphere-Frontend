import { ISmallListTableInput } from "./small-list-table-input.interface";

export interface ICheckedItem {
    checked: boolean;
    row: ISmallListTableInput;
    key: string;
}
