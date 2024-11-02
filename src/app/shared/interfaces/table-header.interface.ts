import { TableHeaderType } from "../enums/table-header-type.enum";

export interface ITableHeader {
  label: string;
  key: string;
  isSortable: boolean;
  type: TableHeaderType;
  labelIconUrl?: string;
  labelIconTooltipTitle?: string;
  labelIconTooltipText?: string;
  needsTranslation?: boolean;
  partialTranslationKey?: string;
  includeTimeInDate?: boolean;
  maxTextLength?: number;
  routerLink?: (id: any) => void;
}
