import { INavigationTab } from "../../../../shared/interfaces/navigation-tab.interface";

export const CompanyNavigations: INavigationTab[] = [
    {
        label: "DETAIL.NAME_PLURAL",
        routeLink: "details",
        icon: "fa-solid fa-circle-info"
    },
    {
        label: "DEPARTMENT.NAME_PLURAL",
        routeLink: "departments",
        icon: "fa-solid fa-building"
    },
    {
        label: "JOB_TITLE.NAME_PLURAL",
        routeLink: "job-titles",
        icon: "fa-solid fa-table-list"
    }
];
