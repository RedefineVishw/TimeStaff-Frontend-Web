export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps {
  name: string;
  label?: string;
  labelClassName?: string;
  asterisk?: boolean;
  wrapperClassName?: string;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
  searchPlaceholder?: string;
  options?: SelectOption[];
  loadOptions?: () => Promise<SelectOption[]>;
}
