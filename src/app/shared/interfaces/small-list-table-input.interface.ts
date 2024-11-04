export interface ISmallListTableInput<T = number> {
  id: T;
  mouseoverMenuInputs?: { [key: string]: any };
  mouseoverItemTextCount?: number;
  textWithImageSrc?: string;
  checkmarkStatus?: boolean;
  appliedClasses?: { key: string; classes: string }[];

  [key: string]: any;
}
