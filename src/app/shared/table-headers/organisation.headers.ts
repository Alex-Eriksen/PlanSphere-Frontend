import { ITableHeader } from "../interfaces/table-header.interface";
import { TableHeaderType } from "../enums/table-header-type.enum";

export const organisationHeaders: ITableHeader[] = [
    {
        key: "name",
        label: "ORGANISATION.LIST.NAME",
        isSortable: true,
        type: TableHeaderType.Text,
        maxTextLength: 70,
    },
    {
        key: "organisationMembers",
        label: "ORGANISATION.LIST.ORGANISATION_MEMBERS",
        isSortable: true,
        type: TableHeaderType.Text,
        maxTextLength: 70,
    },
    {
        key: "companyMembers",
        label: "ORGANISATION.LIST.COMPANY_MEMBERS",
        isSortable: true,
        type: TableHeaderType.Text,
        maxTextLength: 70,
    },
    {
        key: "departmentMembers",
        label: "ORGANISATION.LIST.DEPARTMENT_MEMBERS",
        isSortable: true,
        type: TableHeaderType.Text,
        maxTextLength: 70,
    },
    {
        key: "teamMembers",
        label: "ORGANISATION.LIST.TEAM_MEMBERS",
        isSortable: true,
        type: TableHeaderType.Text,
        maxTextLength: 70,
    },
    // {
    //     key: "userMembers",
    //     label: "ORGANISATION.LIST.USER_MEMBERS",
    //     isSortable: true,
    //     type: TableHeaderType.Text,
    //     maxTextLength: 70,
    // }
]
