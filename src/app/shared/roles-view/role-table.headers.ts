import { ITableHeader } from "../interfaces/table-header.interface";
import { TableHeaderType } from "../enums/table-header-type.enum";

export const RoleTableHeaders: ITableHeader[] = [
    {
        key: "isInheritanceActive",
        label: "ACTIVE",
        isSortable: true,
        type: TableHeaderType.Toggle,
        maxTextLength: 70,
    },
    {
        key: "sourceLevel",
        label: "SOURCE",
        isSortable: true,
        type: TableHeaderType.Text,
        maxTextLength: 70,
        needsTranslation: true
    },
    {
        key: "name",
        label: "NAME",
        isSortable: true,
        type: TableHeaderType.Text,
        maxTextLength: 70,
    },
    {
        key: "rights",
        label: "RIGHT.NUMBER_OF",
        isSortable: false,
        type: TableHeaderType.Text,
        maxTextLength: 70,
    },
    {
        key: "isDefaultRole",
        label: "ROLE.STANDARD",
        isSortable: true,
        type: TableHeaderType.Boolean,
        maxTextLength: 70,
    },
    {
        key: "createdBy",
        label: "CREATED_BY",
        isSortable: true,
        type: TableHeaderType.Text,
        maxTextLength: 70
    },
    {
        key: "createdAt",
        label: "CREATED_AT",
        isSortable: true,
        type: TableHeaderType.Date,
        maxTextLength: 70
    },
];
