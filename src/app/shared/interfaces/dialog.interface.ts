import { WritableSignal } from "@angular/core";

export interface IDialog {
  title: string;
  tooltipLabel?: string;
  cancelLabel?: string;
  descriptions: string[];
  isInputIncluded: boolean;
  inputLabel?: string;
  callBack?: (item?: any) => void;
  submitLabel?: string;
  isSubmitLoading?: WritableSignal<boolean>;
  additionalData?: any;
}
