export interface INavigationTab {
    label: string;
    routeLink: string;
    icon?: string;
    children?: INavigationTab[];
}
