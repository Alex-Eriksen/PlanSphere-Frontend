import { INavigationTab } from "../../../../shared/interfaces/navigation-tab.interface";

export const OrganisationNavigations: INavigationTab[] = [
    {
        label: "DETAIL.NAME_PLURAL",
        routeLink: "details",
        icon: "fa-solid fa-circle-info"
    },
    {
        label: "COMPANY.NAME_PLURAL",
        routeLink: "companies",
        icon: "fa-solid fa-building"
    },
    {
        label: "JOB_TITLE.NAME_PLURAL",
        routeLink: "job-titles",
        icon: "fa-solid fa-table-list"
    },
    {
        label: "ROLE.NAME_PLURAL",
        routeLink: "roles",
        icon: "fa-solid fa-user-check"
    }
];
