import { ISmallListTableInput } from "./small-list-table-input.interface";

export interface ITableAction<T = number> {
    labelFn: (item: ISmallListTableInput<T>) => string;
    callbackFn: (item: ISmallListTableInput<T>) => void;
    isVisible?: (item: ISmallListTableInput<T>) => boolean;
}
