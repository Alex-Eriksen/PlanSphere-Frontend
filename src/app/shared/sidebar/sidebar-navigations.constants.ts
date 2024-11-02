import { INavigationTab } from "../navigation-tabs/navigation-tab.interface";

export const SIDEBAR_SIDEBAR_CONFIG: INavigationTab[] = [
    {
        label: "FRONTPAGE",
        routeLink: "frontpage",
        icon: "fa-solid fa-house"
    },
    {
        label: "ORGANISATION.NAME",
        routeLink: "organisation",
        icon: "fa-solid fa-sitemap",
    },
    {
        label: "ORGANISATION.NAME_PLURAL",
        routeLink: "organisations",
        icon: "fa-solid fa-sitemap"
    },
    {
        label: "COMPANY.NAME",
        routeLink: "company",
        icon: "fa-solid fa-building"
    },
    {
        label: "COMPANY.NAME_PLURAL",
        routeLink: "companies",
        icon: "fa-solid fa-building"
    },
    {
        label: "DEPARTMENT.NAME",
        routeLink: "department",
        icon: "fa-solid fa-building-user"
    },
    {
        label: "DEPARTMENT.NAME_PLURAL",
        routeLink: "departments",
        icon: "fa-solid fa-building-user"
    },
    {
        label: "TEAM.NAME",
        routeLink: "team",
        icon: "fa-solid fa-people-group"
    },
    {
        label: "TEAM.NAME_PLURAL",
        routeLink: "teams",
        icon: "fa-solid fa-people-group"
    },
];
