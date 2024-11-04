import { ISmallListTableInput } from "./small-list-table-input.interface";

export interface IAllCheckedItems {
  checked: boolean;
  rows: (ISmallListTableInput)[];
}
