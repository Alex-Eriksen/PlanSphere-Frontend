export interface INavigationTab {
    label: string;
    routeLink: string;
    icon?: string;
    isVisible?: () => boolean;
}

export interface ISidebarNavigationTab extends INavigationTab{
    routeLinkFn: () => string;
}
