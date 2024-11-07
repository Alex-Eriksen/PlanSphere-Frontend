import { ITableHeader } from "../interfaces/table-header.interface";
import { TableHeaderType } from "../enums/table-header-type.enum";

export const organisationHeaders: ITableHeader[] = [
    {
        key: "name",
        label: "ORGANISATION.NAME_OF",
        isSortable: true,
        type: TableHeaderType.Text,
        maxTextLength: 70,
    }
]
