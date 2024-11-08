import { TableHeaderType } from "../enums/table-header-type.enum";
import { ITableHeader } from "../interfaces/table-header.interface";

export const departmentTableHeaders: ITableHeader[] = [
    {
        key: "name",
        label: "DEPARTMENT.NAME_SPECIFIC",
        isSortable: true,
        type: TableHeaderType.Text,
        maxTextLength: 70
    },
    {
        key: "description",
        label: "DEPARTMENT.DESCRIPTION",
        isSortable: false,
        type: TableHeaderType.Text,
        maxTextLength: 25
    },
    {
        key: "building",
        label: "DEPARTMENT.BUILDING",
        isSortable: false,
        type: TableHeaderType.Text
    },
    {
        key: "streetName",
        label: "ADDRESS.STREET_NAME",
        isSortable: true,
        type: TableHeaderType.Text
    },
    {
        key: "houseNumber",
        label: "ADDRESS.HOUSE_NUMBER",
        isSortable: true,
        type: TableHeaderType.Text
    },
    {
        key: "door",
        label: "ADDRESS.DOOR",
        isSortable: false,
        type: TableHeaderType.Text
    },
    {
        key: "floor",
        label: "ADDRESS.FLOOR",
        isSortable: false,
        type: TableHeaderType.Text
    }
]
