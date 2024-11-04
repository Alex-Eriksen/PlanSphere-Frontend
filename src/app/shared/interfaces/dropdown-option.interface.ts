export interface IDropdownOption extends ILabelledValue {
  translateKey?: string;
  subLabel?: string;
}

export interface ILabelledValue {
  label: string;
  value: any;
}
