import { ITableHeader } from "../interfaces/table-header.interface";
import { TableHeaderType } from "../enums/table-header-type.enum";

export const jobTitleHeaders: ITableHeader[] = [
    {
        key: "isInheritanceActive",
        label: "ACTIVE",
        isSortable: true,
        type: TableHeaderType.Toggle,
        maxTextLength: 70,
    },
    {
        key: "name",
        label: "JOB_TITLE.NAME_OF",
        isSortable: true,
        type: TableHeaderType.Text,
        maxTextLength: 70,
    },
    {
        key: "sourceLevel",
        label: "SOURCE",
        isSortable: true,
        type: TableHeaderType.Text,
        maxTextLength: 70,
    },
]
