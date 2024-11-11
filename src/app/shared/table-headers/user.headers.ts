import { ITableHeader } from "../interfaces/table-header.interface";
import { TableHeaderType } from "../enums/table-header-type.enum";

export const userHeaders: ITableHeader[] = [
    {
        key: "firstName",
        label: "USER.LIST.FIRSTNAME",
        isSortable: true,
        type: TableHeaderType.Text,
        maxTextLength: 70,
    },
    {
        key: "lastName",
        label: "USER.LIST.LASTNAME",
        isSortable: true,
        type: TableHeaderType.Text,
        maxTextLength: 70,
    },
    {
        key: "phoneNumber",
        label: "USER.LIST.PHONENUMBER",
        isSortable: true,
        type: TableHeaderType.Text,
        maxTextLength: 70,
    },
    {
        key: "email",
        label: "USER.LIST.EMAIL",
        isSortable: true,
        type: TableHeaderType.Text,
        maxTextLength: 70,
    },
    {
        key: "createdAt",
        label: "USER.LIST.CREATED_AT",
        isSortable: true,
        type: TableHeaderType.Text,
        maxTextLength: 70,
    },
    {
        key: "createdBy",
        label: "USER.LIST.CREATED_BY",
        isSortable: true,
        type: TableHeaderType.Text,
        maxTextLength: 70,
    },
]
