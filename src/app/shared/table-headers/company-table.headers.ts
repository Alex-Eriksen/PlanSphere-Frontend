import { ITableHeader } from "../interfaces/table-header.interface";
import { TableHeaderType } from "../enums/table-header-type.enum";

export const companyTableHeaders: ITableHeader[] = [
    {
        key: "name",
        label: "COMPANY.NAME_SPECIFIC",
        isSortable: true,
        type: TableHeaderType.Text,
        maxTextLength: 70,
    },
    {
        key: "logo",
        label: "COMPANY.LOGO",
        isSortable: false,
        type: TableHeaderType.Image,
    },
    {
        key: "cvr",
        label: "COMPANY.VAT",
        isSortable: false,
        type: TableHeaderType.Text,
    },
    {
        key: "contactName",
        label: "CONTACT.CONTACT_NAME",
        isSortable: false,
        type: TableHeaderType.Text,
    },
    {
        key: "contactEmail",
        label: "CONTACT.CONTACT_EMAIL",
        isSortable: false,
        type: TableHeaderType.Text,
    },
    {
        key: "contactPhoneNumber",
        label: "CONTACT.CONTACT_PHONENUMBER",
        isSortable: false,
        type: TableHeaderType.Text,
    },

]
