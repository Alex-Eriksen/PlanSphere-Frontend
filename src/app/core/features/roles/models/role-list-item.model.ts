export interface IRoleListItem {
    id: number;
    name: string;
    rights: number;
    createdAt: Date;
    createdBy: string;
    isInheritanceActive: boolean;
}
